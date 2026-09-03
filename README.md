# trip_world

## You go. We go.

**trip_world** is a WebMCP-powered travel planning workspace designed for people and AI agents to explore destinations together. It combines a focused travel interface with structured discovery tools so users can search, compare, and build an itinerary without moving between disconnected websites.

The experience is intentionally simple: discover a place, review useful options, choose what fits, and keep the final itinerary visible in one shared workspace.

> **trip_world makes travel discovery easier for both humans and agents while keeping human judgment at the center.**

---

## Why trip_world?

Travel research is often spread across search engines, hotel websites, maps, notes, and booking platforms. This makes it difficult to compare information and even harder for an AI agent to work with a website reliably.

trip_world provides a common planning space where a human and an agent can work with the same destination information and itinerary state. The user can see what is being searched, what is recommended, and what has been added to the plan.

The project focuses on **transparent planning rather than invisible automation**. Discovery can be assisted by an agent, while important decisions remain visible to the human.

---

## What the application provides

- A clean destination discovery interface.

- Search across cities, countries, regions, and travel interests.

- A compact destination carousel that keeps the home screen focused.

- Direct city selection with city-specific travel options.

- Travel suggestions across stays, activities, attractions, nature, transport, and offers.

- Filters for budget, category, tags, accessibility, and other trip preferences.

- Destination and option details with reference links.

- A shared itinerary for human and agent actions.

- Localized Indian rupee pricing for the planning experience.

- A visible activity ledger that records shared actions.

- Human review before proposed itinerary changes are applied.

- Responsive layouts for desktop and mobile screens.

The interface uses a focused first view instead of showing the entire catalog at once. Users can search or browse gradually, keeping the planning experience readable and intentional.

---

## WebMCP experience

WebMCP allows compatible AI agents to use structured capabilities exposed by the webpage. In trip_world, the agent can assist with destination discovery, filtering, comparison, details, source inspection, and itinerary planning.

The agent works with the same state that the user sees. This means an agent's search or itinerary action can be reflected immediately in the visible workspace rather than remaining hidden in a separate conversation.

Sensitive actions are deliberately separated from agent-assisted discovery. Reservation and payment are not exposed as WebMCP tools and remain human-controlled interface actions.

For technical implementation details, see the source files and the project documentation in:

```
SUBMISSION_GUIDE.md
PROJECT_HANDOFF.md
API_KEYS_GUIDE.md
```

---

## Travel data

The project includes an expanded structured travel dataset covering cities and travel options across multiple regions of the world. The data supports destination discovery, category filtering, budget comparison, option details, and source references.

The user-facing planning prices are presented in **Indian rupees (INR)**. The dataset is intended for demonstration and exploration. It does not represent guaranteed live availability, real-time inventory, or a confirmed commercial booking offer.

The data source file is located at:

```
client/src/data/travelData.ts
```

---

## Interface highlights

### Focused destination browsing

The home view shows a small number of destination cards at a time. Up and down controls allow the user to browse further places without overwhelming the first screen.

### City-specific planning

Selecting a city opens options belonging to that city. The interface clears stale filters and prevents results from another destination from appearing in the selected city's view.

### Shared itinerary

The itinerary panel shows selected items, prices, the running total, source links, and recent human or agent actions. The panel is designed to remain readable while the main workspace continues to scroll independently.

### Human control

Agents can help with research and planning, but the user remains responsible for final sensitive decisions. Proposed changes can be reviewed before they are applied.

---

## Technology

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| Agent interface | WebMCP imperative API |
| Styling | Responsive CSS with lightweight transitions and animations |
| Icons | Lucide React |
| Test payment | Razorpay test mode through the human interface |
| Package manager | pnpm |

---

## Project structure

```
trip_world/
├── client/
│   ├── public/images/       # Bundled visual resources
│   └── src/
│       ├── data/            # Structured travel dataset
│       ├── pages/           # Main application interface
│       └── index.css        # Application styling
├── server/
│   ├── index.ts             # Express API and production server
│   └── start-production.mjs # Cross-platform production launcher
├── API_KEYS_GUIDE.md
├── PROJECT_HANDOFF.md
├── SUBMISSION_GUIDE.md
├── LICENSE
├── package.json
└── README.md
```

---

## Run locally

### Requirements

- Node.js 20 or newer.

- pnpm.

- A modern browser.

### Install and validate

```bash
pnpm install
pnpm check
pnpm build
```

### Start the production build

```bash
pnpm start
```

Open the application at:

```
http://localhost:3000
```

For development mode, use:

```bash
pnpm dev
```

---

## Environment variables

Create a local `.env` file only when testing the Razorpay test flow. Never commit it to GitHub.

```
NODE_ENV=development
PORT=3000
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_server_only_test_secret
```

Use `.env.example` as the safe template. Real secrets must be added only to the hosting provider's protected environment-variable settings.

---

## Basic test flow

1. Open the application.

1. Search for a city such as Goa, Kyoto, or Lisbon.

1. Confirm that only matching destination cards appear.

1. Select a destination.

1. Confirm that only options for the selected city are shown.

1. Add an option to the itinerary.

1. Confirm that the itinerary and INR total update without a page reload.

1. Open a source/details link.

1. Test the WebMCP workflow in a compatible browser.

1. Confirm that payment remains a human-only test-mode action.

A detailed judging and deployment checklist is available in [`SUBMISSION_GUIDE.md`](./SUBMISSION_GUIDE.md).

---

## Deployment

The frontend can be deployed through a modern static or frontend hosting provider. The Express API and Razorpay routes require a compatible server or serverless-function configuration.

For Vercel deployment, configure the project with the appropriate Vite build settings and deploy server routes as compatible API functions, or host the Express backend separately. Add Razorpay test credentials through the Vercel environment-variable settings rather than the repository.

After deployment, test the public HTTPS URL independently of the local computer. Confirm that destination search, city selection, itinerary updates, source links, and WebMCP discovery work on the deployed site.

---

## Data and service disclosure

The travel catalog is a structured demonstration dataset with reference links. It should not be described as live inventory or guaranteed availability.

Razorpay is used only for the human-controlled test-payment flow. Any production use would require authorized credentials, current provider terms, persistent order storage, webhook validation, monitoring, and additional security review.

Third-party libraries and services are used according to their applicable licenses and terms. See [`API_KEYS_GUIDE.md`](./API_KEYS_GUIDE.md) and [`SUBMISSION_GUIDE.md`](./SUBMISSION_GUIDE.md) for operational details.

---

## Project status

The current implementation includes the core shared planning experience, structured destination discovery, expanded travel data, WebMCP integration, INR display pricing, responsive layout behavior, and human-controlled test payment separation.

The next steps before a public hackathon submission are to push the repository to GitHub, deploy a public HTTPS version, verify WebMCP on the judging browser, record a short demonstration video, and complete the submission fields with accurate project history and data disclosure.

---

## License

This project is released under the MIT License. See [`LICENSE`](./LICENSE).

## References

[1]: https://developer.chrome.com/docs/ai/webmcp "Chrome WebMCP documentation"

[2]: https://developer.chrome.com/docs/ai/webmcp/imperative-api "Chrome WebMCP imperative API"

[3]: https://developer.chrome.com/docs/ai/webmcp/secure-tools "Chrome WebMCP security guidance"

[4]: https://webmcp.devpost.com/resources "WebMCP Challenge resources"

[5]: https://vercel.com/docs/frameworks/frontend/vite "Vite on Vercel"

[6]: https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/ "Razorpay server integration documentation"

trip_world is an open-web experiment for making travel planning more understandable, collaborative, and agent-ready.
