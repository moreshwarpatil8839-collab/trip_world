# TripBuilder Design Brief

## Three directions

### Theme Name: Field Notes / Coastal Ledger
**Very Brief Intro:** A warm editorial travel-planning interface that feels like a well-kept expedition notebook: tactile paper tones, ink-dark type, and one mineral accent. It makes shared planning feel calm, credible, and human.

**Probability:** 0.041

### Theme Name: Signal Room
**Very Brief Intro:** A precise operations-console aesthetic for human–agent collaboration, with a quiet graphite canvas, electric chartreuse signal color, and instrument-like data panels. It emphasizes observability and tool receipts.

**Probability:** 0.083

### Theme Name: Sunlit Transit
**Very Brief Intro:** A bright, optimistic wayfinding system inspired by station signage and modern Mediterranean travel posters. It uses generous white space, cobalt wayfinding lines, and citrus highlights to make planning feel energetic.

**Probability:** 0.067

## Chosen approach: Field Notes / Coastal Ledger

### Design Movement
Contemporary editorial modernism with references to field journals, Swiss information design, and coastal cartography.

### Core Principles
1. Human-readable first: every state, price, and action is legible before it is decorative.
2. Shared state is visible: agent activity, itinerary mutations, and totals read like a live notebook margin rather than hidden system behavior.
3. Evidence travels with the idea: source URLs appear beside catalog items and tool receipts.
4. Tactile restraint: paper warmth, hairline rules, irregular card offsets, and small ink marks create character without visual noise.

### Color Philosophy
The base is oyster paper and deep kelp ink, chosen to feel trustworthy and screen-comfortable rather than corporate. The ownable accent is sea-glass teal, used only for active collaboration, selected items, and tool confirmations. A muted saffron marks human actions and a rust-red marks removal or blocked transactions. Color should encode state, not merely decorate it.

### Layout Paradigm
A split editorial workspace: a narrow fixed rail for the shared itinerary and agent log, a wide working canvas for search and option cards, and a vertical “coastline” rule tying the two together. The page should feel arranged like an open desk, not a centered marketing grid.

### Signature Elements
1. A sea-glass vertical rule that pulses when a tool mutates shared state.
2. Small stamped labels such as LIVE, HUMAN, AGENT, and VERIFIED.
3. A route-line motif connecting destinations and itinerary items.

### Interaction Philosophy
Human and agent actions use the same visual language and mutation functions. Every click produces a visible receipt in the activity log; every tool action changes the same itinerary immediately. The interface should acknowledge actions with a small, physical-feeling shift rather than a large modal interruption.

### Animation
Use short 160–220ms ease-out transitions for selection, chips, and button feedback. When an item enters the itinerary, animate only opacity and translateY with a subtle stagger. The sea-glass rule briefly brightens on tool mutation. Never animate the entire layout or use looping motion except a restrained live-status dot. Respect reduced-motion preferences.

### Typography System
Use Fraunces for display headlines and IBM Plex Sans for interface text. Headlines are compact, slightly expressive, and left-aligned; labels are uppercase with generous tracking; body copy uses 14–16px IBM Plex Sans with 1.5 line height. Numeric totals use IBM Plex Mono for ledger clarity.

### Brand Essence
TripBuilder is a shared trip-planning desk for people and AI agents who need to search, compare, and shape one itinerary together without losing visibility or control.

Personality: observant, warm, capable.

### Brand Voice
Headlines are concise and directional. CTAs sound like invitations to make a concrete move, never vague onboarding filler. Microcopy explains what just happened and who changed it.

Example lines: “Build the route together.” “Five tools. One living itinerary.”

### Wordmark & Logo
The wordmark is set in a high-contrast serif with the “T” crossbar extended into a route line that ends in a small waypoint dot. The mark is a simple open compass bracket around a sea-glass dot, designed to work at favicon scale without text.

### Signature Brand Color
Sea-glass teal: `#2F8F83`.

## Style Decisions

- Build the page as a product workspace, not a landing page.
- Keep the agent log visible in the primary viewport.
- Use static catalog data to demonstrate reliable grounding and avoid live provider dependencies.
- Make human and agent mutations literally share the same store functions.
- Keep the transaction boundary explicit: search and itinerary changes are allowed; booking and payment are not present.
