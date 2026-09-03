# TripBuilder WebMCP Challenge Submission Guide

This guide turns the official [WebMCP Challenge resources](https://webmcp.devpost.com/resources) and the [Chrome WebMCP documentation](https://developer.chrome.com/docs/ai/webmcp) into an execution checklist for TripBuilder. It distinguishes what is already implemented in the source archive from the items that require the owner's accounts, hosting, media, and Devpost submission.

## 1. Current implementation status

| Requirement | Status | Evidence or action |
| --- | --- | --- |
| Working WebMCP-enabled project | Implemented locally | `client/src/pages/Home.tsx` registers seven tools and the normal UI still works without WebMCP. |
| Structured tool discovery and JSON Schemas | Implemented | Search, itinerary, and proposal tools have names, descriptions, schemas, and execute callbacks. |
| Human-centered sensitive-action boundary | Implemented | Payment is a normal UI handler only; no payment tool is registered. |
| Origin isolation and permissions policy | Implemented | Server sends `Origin-Agent-Cluster: ?1` and `Permissions-Policy: tools=(self)`. |
| Public repository with open-source license | Source-ready | `LICENSE` is present. Publish the repository publicly and verify the license is visible on the repository landing page. |
| Hosted project with a live URL | Owner action required | Deploy the project to a provider with a free tier, configure server environment variables, and test the public URL. |
| Project description | Source-ready | README explains the problem, WebMCP fit, tools, security, and payment boundary. Adapt it into the Devpost description. |
| Demo video shorter than three minutes | Owner action required | Record a clear narrated demonstration with audio; use the storyboard below. |
| Judge testing instructions | Ready to complete | Add the final live URL and any private test credentials to Devpost's Testing Instructions field. |
| Free, unrestricted testing through judging | Owner action required | Keep the live app accessible without a paywall or required login; keep test payment in Razorpay test mode. |
| Existing-project disclosure | Owner action required | If the project existed before August 25, 2026, explicitly document what WebMCP work was meaningfully added after that date. |
| Deadline and judging freeze | Time-critical owner action | The resources page states the submission deadline is September 3, 2026 at 1:00 PM PDT; after submission closes, do not edit the submission, repository, or live site until winners are announced. |

The current date in the supplied task context is September 3, 2026. Confirm the live Devpost status and local time conversion before relying on the deadline, because the deadline is close and the official page controls.

## 2. Required deployment steps

Choose one provider that supports a public HTTPS URL and a Node server, such as Render, Cloudflare, Vercel, or Netlify with an appropriate server function arrangement. Deploy the repository from a public source-control URL. Set `RAZORPAY_KEY_ID` to a test key beginning with `rzp_test_` and set `RAZORPAY_KEY_SECRET` only in the provider's server-side environment configuration. Never commit either value, paste the secret into Devpost, or place it in client environment variables.

After deployment, open the live URL in a normal browser and verify that the static app loads, the API routes respond, the response headers include `Origin-Agent-Cluster: ?1` and `Permissions-Policy: tools=(self)`, and the client can add and remove itinerary items. Then use ChatGPT's in-app browser or Chrome 149+ with WebMCP enabled. Chrome local testing requires opening `chrome://flags/`, enabling the WebMCP testing flag when available, relaunching Chrome, and opening the deployed site directly. WebMCP tools are discovered only after the browser visits the site.

## 3. Judge test script

A judge should be able to follow this sequence without a login. First, open the live URL and confirm the normal interface displays destinations and options. Next, inspect WebMCP tools with the WebMCP Inspector or Chrome DevTools WebMCP panel. The expected tools are `search_destinations`, `search_options`, `add_to_itinerary`, `remove_from_itinerary`, `get_itinerary`, `preview_trip_change`, and `apply_trip_change`. There must be no reservation, checkout, Razorpay, or payment tool.

Ask an agent to search for Goa, search Goa options under a suitable budget, add the morning direct flight and hotel, and call `get_itinerary`. Confirm that the visible itinerary and running total update without a reload and that the ledger marks those events as AGENT. Ask the agent to preview removing an item. Confirm that the proposal appears and the itinerary does not change until a human clicks Apply change. Reject one proposal as an additional human-review check.

Then, as a human, add at least one item if the itinerary is empty and click **Reserve (test payment)**. Confirm that the button is shown only for a non-empty itinerary and that **TEST MODE — no real payment** is always visible. Use Razorpay's documented test card details in the Checkout.js widget. After checkout, confirm that the server verifies the signature, the UI says **Reservation confirmed (test payment)**, and the ledger records a HUMAN action. Send a deliberately incorrect signature to `/api/verify-payment`; it must be rejected and must not confirm a reservation.

## 4. Security and WebMCP compliance checks

Before submission, run the following commands from the project root:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
! rg -n 'RAZORPAY_KEY_SECRET' client dist/public
```

The final check must produce no matches. Inspect the source diff for the `registerWebMcpTools` function and confirm no existing tool was modified and no payment-related registration was added. Confirm that `RAZORPAY_KEY_SECRET` occurs only in server-side code and deployment configuration. Confirm that the server computes the order amount from its validated server-side session state, rather than accepting a client-supplied amount. Confirm that invalid catalog IDs cannot create itinerary entries.

The Chrome security guidance recommends `readOnlyHint` for tools that do not change state, succinct descriptions and parameter descriptions, careful origin exposure, and an `untrustedContentHint` when a tool returns user-generated or externally sourced content. TripBuilder already uses read-only annotations for the preview tool and does not configure cross-origin exposure. If externally sourced or user-generated content is added later, review every tool output and add the appropriate untrusted-content signal supported by the target WebMCP implementation.

## 5. Three-minute demo storyboard

| Time | Demonstration |
| --- | --- |
| 0:00–0:20 | State the problem: travel interfaces are difficult for agents, while humans need visibility and control. Introduce TripBuilder as one shared itinerary workspace. |
| 0:20–0:55 | Show the normal UI, select Goa, and add a flight and hotel. Explain that human and agent actions share the same state. |
| 0:55–1:35 | Open WebMCP inspection, show the seven structured tools, ask an agent to search, add, and read the itinerary, and point to the live ledger. |
| 1:35–2:05 | Ask the agent to preview a removal. Show the review proposal, apply it with a human click, and explain why the mutation is reviewable. |
| 2:05–2:35 | As a human, show the test-payment button and the always-visible test-mode notice. Open Razorpay Checkout in test mode and show the confirmed state. Do not show credentials. |
| 2:35–2:55 | Show that payment is absent from the WebMCP tool list and explain that sensitive payment remains human-only. |
| 2:55–3:00 | State the live URL and the practical WebMCP outcome. |

The video must have clear audio, demonstrate the project functioning, and explain both what was built and how WebMCP is used. Avoid claiming capabilities that are not visible in the recording.

## 6. Devpost submission fields

Use a specific project name chosen by the owner rather than asking an AI to name it. Provide the live URL, public repository URL, and under-three-minute video URL. In the description, explain the user problem, the shared-state design, the seven tools, the human confirmation boundary, and what WebMCP enables that ordinary DOM scraping does not. Include a concise build summary and the technologies used. State that Razorpay is test mode only and is not exposed as an agent tool.

Place any login or private testing credentials only in Devpost's private Testing Instructions field. Prefer no-login judging for this app. Include exact browser instructions: ChatGPT in-app browser, or Chrome 149+ with the WebMCP flag enabled. Add a short judge flow from Section 3 and list known limitations, including the static catalog and the need for test credentials to execute the payment path.

## 7. Final owner checklist

Before clicking Devpost's final submission action, confirm that the repository is public, has a visible open-source license, contains the final source and README, and is tagged or committed so the submitted version can be identified. Confirm the live URL works in an incognito window and in a WebMCP-capable browser. Confirm the demo video is under three minutes and has understandable audio. Confirm the description does not overstate functionality. Confirm all Razorpay credentials are test-only and secret-side. Save the submission before the stated deadline, capture the submitted URLs and timestamp, and then freeze the submitted repository, live site, and Devpost entry during judging.

## Official references

- [Devpost WebMCP resources and FAQ](https://webmcp.devpost.com/resources)
- [Chrome WebMCP developer documentation](https://developer.chrome.com/docs/ai/webmcp)
- [Chrome WebMCP tool security guidance](https://developer.chrome.com/docs/ai/webmcp/secure-tools)
- [WebMCP specification and explainer](https://github.com/webmachinelearning/webmcp)
- [WebMCP origin trial information](https://developer.chrome.com/blog/ai-webmcp-origin-trial)
- [Chrome WebMCP evals](https://developer.chrome.com/docs/ai/webmcp/evals)
