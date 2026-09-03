# Project Handoff

## 4. Changelog

Added a human-only Razorpay test-mode reservation flow to the itinerary panel. The client synchronizes selected catalog item IDs to a server-side in-memory session; the server computes the amount from its own catalog price map and creates Razorpay orders using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. The client loads Checkout.js only from the standard Razorpay script URL and sends the checkout response to server-side HMAC-SHA256 verification. A verified payment is recorded as a human action in the existing activity ledger and shown as “Reservation confirmed (test payment)”. No payment route, handler, or reference was added to the WebMCP tool registration list; the existing tool definitions remain unchanged.

The UI labels the action “Reserve (test payment)” and permanently displays “TEST MODE — no real payment”. The server rejects missing/non-test configuration, zero-value itineraries, incomplete payment responses, invalid signatures, and verification attempts that do not match an order created for the same server-side session. The secret key is read only by `server/index.ts` and is never exposed to client code.

Reviewed the official Devpost resources and Chrome WebMCP documentation. Added explicit `Origin-Agent-Cluster: ?1` and `Permissions-Policy: tools=(self)` response headers, corrected the README's tool inventory, and added `SUBMISSION_GUIDE.md` covering deployment, judge testing, security checks, the under-three-minute demo storyboard, Devpost fields, public-repository/license requirements, existing-project disclosure, and the judging freeze.

## 5. Verification Status

- `pnpm check`: passed after dependency installation.
- `pnpm build`: passed; Vite client assets and the bundled server were generated successfully.
- Client-source and built-client secret scan: passed; `RAZORPAY_KEY_SECRET` is absent from `client/` and `dist/public/`.
- WebMCP preservation: completed by inspection; `registerWebMcpTools` and its six existing tool definitions were not changed.
- Invalid-signature rejection: tested against a local server using placeholder test-mode configuration; the tampered request returned HTTP 400 with “Payment signature verification failed.”
- Full Razorpay test-card checkout: not executed in this sandbox because no Razorpay test credentials were provided. Run with `RAZORPAY_KEY_ID=rzp_test_...` and `RAZORPAY_KEY_SECRET=...`, then use Razorpay's documented test card details. Do not use live keys.
