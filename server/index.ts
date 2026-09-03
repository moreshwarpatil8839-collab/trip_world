import express, { type Request, type Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { options as travelOptions } from "../client/src/data/travelData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PRICES: Record<string, number> = Object.fromEntries(travelOptions.map((item) => [item.id, item.price]));

type SessionState = { itemIds: string[]; pendingOrderId: string | null; reservation: { orderId: string; paymentId: string } | null };
const sessions = new Map<string, SessionState>();

function getSession(req: Request, res: Response) {
  let sessionId = req.headers.cookie?.match(/(?:^|; )trip_world_session=([^;]+)/)?.[1];
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    res.setHeader("Set-Cookie", `trip_world_session=${sessionId}; HttpOnly; SameSite=Lax; Path=/`);
  }
  if (!sessions.has(sessionId)) sessions.set(sessionId, { itemIds: [], pendingOrderId: null, reservation: null });
  return sessions.get(sessionId)!;
}

function itineraryTotal(itemIds: string[]) {
  return itemIds.reduce((sum, id) => sum + (CATALOG_PRICES[id] ?? 0), 0);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "20kb" }));
  app.use((_req, res, next) => {
    res.setHeader("Origin-Agent-Cluster", "?1");
    res.setHeader("Permissions-Policy", "tools=(self)");
    next();
  });

  // UI-only state synchronization. The amount is always recomputed from this server-side state.
  app.post("/api/itinerary-state", (req, res) => {
    const session = getSession(req, res);
    const itemIds = Array.isArray(req.body?.itemIds) ? req.body.itemIds.filter((id: unknown): id is string => typeof id === "string" && id in CATALOG_PRICES) : [];
    session.itemIds = Array.from(new Set(itemIds));
    session.pendingOrderId = null;
    session.reservation = null;
    res.json({ ok: true, total: itineraryTotal(session.itemIds) });
  });

  app.post("/api/create-order", async (req, res) => {
    const session = getSession(req, res);
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret || !keyId.startsWith("rzp_test_")) {
      return res.status(503).json({ error: "Razorpay test-mode keys are not configured." });
    }
    const total = itineraryTotal(session.itemIds);
    if (total <= 0) return res.status(400).json({ error: "Add at least one itinerary item before reserving." });

    // Razorpay expects the smallest currency unit. trip_world catalog prices are Indian rupees, converted to paise.
    const amount = total * 100;
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    try {
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "INR", receipt: `tripbuilder_${Date.now()}`, notes: { itemCount: String(session.itemIds.length) } }),
      });
      const data = await response.json() as { id?: string; error?: { description?: string } };
      if (!response.ok || !data.id) return res.status(502).json({ error: data.error?.description ?? "Unable to create Razorpay order." });
      session.pendingOrderId = data.id;
      return res.json({ orderId: data.id, amount, currency: "INR", keyId });
    } catch {
      return res.status(502).json({ error: "Unable to reach Razorpay." });
    }
  });

  app.post("/api/verify-payment", (req, res) => {
    const session = getSession(req, res);
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body ?? {};
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || !orderId || !paymentId || !signature) return res.status(400).json({ ok: false, error: "Incomplete payment response." });
    if (session.pendingOrderId !== orderId) return res.status(400).json({ ok: false, error: "Unknown or expired payment order." });
    const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
    const valid = signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!valid) return res.status(400).json({ ok: false, error: "Payment signature verification failed." });
    session.reservation = { orderId, paymentId };
    session.pendingOrderId = null;
    return res.json({ ok: true, status: "confirmed" });
  });

  const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "public") : path.resolve(__dirname, "..", "dist", "public");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}

startServer().catch(console.error);
