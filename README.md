# TripBuilder

TripBuilder is a standalone WebMCP trip-planning workspace where a human and an AI agent share one living itinerary. It exposes structured search, itinerary, and decision-workspace tools while keeping the sensitive reservation/payment boundary human-only.

## Why this fits WebMCP

The app registers seven imperative `document.modelContext.registerTool` tools when the browser provides the WebMCP API. Their JSON Schemas describe the inputs, their `execute` functions reuse the same client-side state transitions as the visible UI, and their returned objects expose grounded itinerary state. Human and agent actions are visible together in the activity ledger.

The six tools are:

| Tool | Purpose | State effect |
| --- | --- | --- |
| `search_destinations` | Search the destination catalog | Read-only search plus ledger event |
| `search_options` | Find catalog options, optionally under a budget | Read-only search plus ledger event |
| `add_to_itinerary` | Add a validated catalog item | Mutates shared itinerary |
| `remove_from_itinerary` | Remove a validated itinerary item | Mutates shared itinerary |
| `get_itinerary` | Read the current items and total | Read-only state read plus ledger event |
| `preview_trip_change` | Preview an item removal and its cost impact | Creates a reviewable proposal, without changing itinerary items |
| `apply_trip_change` | Apply a previously previewed proposal | Mutates shared itinerary after the proposal is visible |

The implementation keeps this existing seven-tool registration surface unchanged from the supplied project. The important boundary is deliberate: there is **no booking, payment, or reservation WebMCP tool**.

## Human-only test payment

When the itinerary is non-empty, a human can click **Reserve (test payment)**. The client first synchronizes item IDs to a server-side session. The server recomputes the amount from its own catalog, creates a Razorpay test-mode order, and returns only the public key ID, order ID, amount, and currency. Razorpay Checkout.js runs in the regular UI flow, never in a WebMCP `execute` callback.

After checkout, the server verifies `razorpay_order_id|razorpay_payment_id` with HMAC-SHA256 using `RAZORPAY_KEY_SECRET`, confirms that the order belongs to the same server-side session, and only then records the reservation. The secret is read from the server environment and is absent from client source and built client output. Use only `rzp_test_...` credentials.

## Run locally

```bash
pnpm install
pnpm dev
```

For the payment flow, provide test credentials to the server process:

```bash
RAZORPAY_KEY_ID=rzp_test_... RAZORPAY_KEY_SECRET=... pnpm start
```

The site remains fully usable as a normal website when `document.modelContext` is unavailable. For Chrome testing, use Chrome 149+ with the WebMCP flag enabled, or use ChatGPT's in-app browser where available. The page sends `Origin-Agent-Cluster: ?1` and `Permissions-Policy: tools=(self)` headers.

## Verification

Run `pnpm check` for TypeScript validation and `pnpm build` for the production client/server build. Confirm that `RAZORPAY_KEY_SECRET` does not occur under `client/` or `dist/public/`. Use the WebMCP Inspector or Chrome DevTools WebMCP panel to inspect the registered tools and manually test valid and invalid schemas. Confirm that payment is absent from the tool list, that a tampered payment signature returns an error, and that a verified test payment produces a HUMAN ledger entry.

## Security design

The app follows the WebMCP security guidance by using `readOnlyHint` on tools that do not directly modify itinerary items, limiting tool descriptions and parameter descriptions, validating catalog IDs before mutation, and keeping sensitive actions out of the agent tool surface. Externally sourced links are references only; the catalog is static and deterministic. No cross-origin tool exposure is configured.

## Project references

- [WebMCP Challenge resources](https://webmcp.devpost.com/resources)
- [Chrome WebMCP developer documentation](https://developer.chrome.com/docs/ai/webmcp)
- [Chrome WebMCP security guidance](https://developer.chrome.com/docs/ai/webmcp/secure-tools)
- [WebMCP specification and explainer](https://github.com/webmachinelearning/webmcp)
- See [`PROJECT_HANDOFF.md`](./PROJECT_HANDOFF.md) for implementation status and [`SUBMISSION_GUIDE.md`](./SUBMISSION_GUIDE.md) for the complete next-steps checklist.
