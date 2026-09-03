# TripBuilder Checkpoint 2 Checklist

- [x] Add `pendingChange` to the shared store with id, description, costDelta, and newTotal.
- [x] Add `preview_trip_change` as a read-only WebMCP tool that does not mutate itinerary items.
- [x] Add `apply_trip_change` as an approval-gated WebMCP tool requiring the active change id.
- [x] Make human Apply use the exact same `applyTripChange` mutation function as the agent tool.
- [x] Add Reject behavior that clears only the pending proposal.
- [x] Upgrade event logging to human-readable action descriptions.
- [x] Add the Agent Proposal card with impact, Apply, and Reject controls.
- [ ] Run the full human flow and programmatic tool-flow checks.
- [x] Run TypeScript checks, production build, desktop screenshot, and mobile screenshot.
- [ ] Save the Checkpoint 2 state before delivery; live WebMCP discovery remains a user-Chrome verification item.
