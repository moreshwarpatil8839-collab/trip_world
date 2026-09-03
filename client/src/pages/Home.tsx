/* Field Notes / Coastal Ledger: warm editorial workspace, shared state visible, source receipts beside action. */
import { useEffect, useMemo, useState } from "react";
import { catalog as travelCatalog, destinations as travelDestinations, options as travelOptions, filterCatalog, findDestination, type TravelOption, type TravelKind } from "@/data/travelData";
import { Compass, Search, Plus, Minus, Sparkles, Clock3, Plane, BedDouble, Utensils, MapPin, ArrowUpRight, Check, SlidersHorizontal, Bot, UserRound, CircleAlert } from "lucide-react";

const COMPASS_MARK = "/images/your-compass-file.png";
const COASTAL_IMAGE = "/images/tripbuilder-coastal-route.png";
const NOTEBOOK_IMAGE = "/images/your-notebook-file.png";

const catalog = travelCatalog;

type Item = TravelOption;
type Destination = typeof travelDestinations[number];
type AgentEvent = { id: number; actor: "agent" | "human"; action: string; time: string };
type PendingChange = { id: string; description: string; impact: { costDelta: number; newTotal: number } } | null;
type RazorpayCheckout = { open: () => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayCheckout;
declare global { interface Window { Razorpay?: RazorpayConstructor } }
const formatINR = (value: number) => `₹${value.toLocaleString("en-IN")}`;

type TripStore = {
  selectedDestination: string;
  itinerary: Item[];
  events: AgentEvent[];
  query: string;
  budget: string;
  results: Item[];
  resultsActive: boolean;
  pendingChange: PendingChange;
};

const initialStore: TripStore = { selectedDestination: "goa", itinerary: [], events: [], query: "", budget: "", results: [], resultsActive: false, pendingChange: null };
let store: TripStore = structuredClone(initialStore);
let listeners: Array<() => void> = [];
const notify = () => listeners.forEach((listener) => listener());
const snapshot = () => store;
const stamp = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const logEvent = (actor: AgentEvent["actor"], action: string) => {
  store.events = [{ id: Date.now() + Math.random(), actor, action, time: stamp() }, ...store.events].slice(0, 10);
};
const setStore = (patch: Partial<TripStore>) => { store = { ...store, ...patch }; notify(); };

function searchDestinations(query: string, actor: AgentEvent["actor"] = "human") {
  const normalized = query.trim().toLowerCase();
  const matches = travelDestinations.filter((destination) => !normalized || `${destination.name} ${destination.region} ${destination.country} ${destination.bestFor.join(" ")} ${destination.highlights.join(" ")}`.toLowerCase().includes(normalized));
  logEvent(actor, `${actor === "human" ? "Searched" : "Agent searched"} destinations for “${query.trim() || "all places"}”`);
  setStore({ results: [], resultsActive: false, query });
  return { matches, count: matches.length };
}
function selectDestination(destinationId: string, actor: AgentEvent["actor"] = "human") {
  const destination = findDestination(destinationId);
  if (!destination) return { ok: false, error: `No destination found for ${destinationId}` };
  setStore({ selectedDestination: destinationId, results: [], resultsActive: false });
  logEvent(actor, `${actor === "human" ? "Selected" : "Agent selected"} ${destination.name}; cleared stale option filters`);
  notify();
  return { ok: true, destination, options: travelOptions.filter((item) => item.destinationId === destinationId), optionCount: travelOptions.filter((item) => item.destinationId === destinationId).length, itinerary: getItinerary() };
}
function searchOptions(destinationId: string, budget?: number, type?: Item["type"], tag?: string, actor: AgentEvent["actor"] = "human") {
  const normalizedTag = tag?.trim().toLowerCase();
  const results = filterCatalog({ destinationId, maxPrice: budget, type, tag });
  const place = findDestination(destinationId)?.name ?? destinationId;
  logEvent(actor, `${actor === "human" ? "Searched" : "Agent searched"} ${place} options${budget === undefined ? "" : ` under ${formatINR(budget)}`}${type ? ` · ${type}` : ""}${tag ? ` · ${tag}` : ""}`);
  setStore({ selectedDestination: destinationId, results, resultsActive: true });
  return { destinationId, filters: { budget, type, tag }, results, count: results.length };
}
function getDestinationDetails(destinationId: string) {
  const destination = findDestination(destinationId);
  if (!destination) return { ok: false, error: `No destination found for ${destinationId}` };
  return { ok: true, destination, availableOptionTypes: Array.from(new Set(travelOptions.filter((item) => item.destinationId === destinationId).map((item) => item.type))) };
}
function compareOptions(itemIds: string[]) {
  const items = itemIds.map((id) => travelOptions.find((item) => item.id === id)).filter((item): item is Item => Boolean(item));
  return { requestedIds: itemIds, items, missingIds: itemIds.filter((id) => !items.some((item) => item.id === id)), count: items.length };
}
function addToItinerary(itemId: string, actor: AgentEvent["actor"] = "agent") {
  const item = travelOptions.find((candidate) => candidate.id === itemId);
  if (!item) return { ok: false, error: `No catalog item found for ${itemId}`, itinerary: store.itinerary };
  if (!store.itinerary.some((candidate) => candidate.id === itemId)) store.itinerary = [...store.itinerary, item];
  logEvent(actor, `${actor === "human" ? "Added" : "Agent added"} “${item.name}” to the shared itinerary`);
  notify();
  return getItinerary();
}
function removeFromItinerary(itemId: string, actor: AgentEvent["actor"] = "agent") {
  const exists = store.itinerary.some((item) => item.id === itemId);
  if (!exists) return { ok: false, error: `No itinerary item found for ${itemId}`, itinerary: getItinerary() };
  store.itinerary = store.itinerary.filter((item) => item.id !== itemId);
  logEvent(actor, `${actor === "human" ? "Removed" : "Agent removed"} “${travelOptions.find((item) => item.id === itemId)?.name ?? itemId}” from the shared itinerary`);
  notify();
  return getItinerary();
}
function getItinerary() {
  return { items: store.itinerary, total: store.itinerary.reduce((sum, item) => sum + item.price, 0), count: store.itinerary.length };
}
function previewTripChange(change: string) {
  const normalized = change.toLowerCase();
  const target = store.itinerary.find((item) => item.name.toLowerCase().split(/\W+/).filter((word) => word.length > 3).some((word) => normalized.includes(word)));
  if (!target || !/remove|drop|delete|skip/i.test(normalized)) return { ok: false, error: "I can preview a removal only when the requested item is already in the itinerary.", pendingChange: null };
  const newTotal = getItinerary().total - target.price;
  const pendingChange: PendingChange = { id: `change-${Date.now()}`, description: `Remove “${target.name}” from the shared itinerary`, impact: { costDelta: -target.price, newTotal } };
  store.pendingChange = pendingChange;
  logEvent("agent", `Proposed removing “${target.name}” to reduce the total by ${formatINR(target.price)}`);
  notify();
  return { ok: true, pendingChange, itinerary: getItinerary() };
}
function applyTripChange(changeId: string, actor: AgentEvent["actor"] = "agent") {
  if (!store.pendingChange || store.pendingChange.id !== changeId) return { ok: false, error: "That proposal is stale or no longer available.", itinerary: getItinerary() };
  const proposal = store.pendingChange;
  const target = store.itinerary.find((item) => proposal.description.toLowerCase().includes(item.name.toLowerCase()));
  if (!target) return { ok: false, error: "The proposed item is no longer in the itinerary.", itinerary: getItinerary() };
  store.itinerary = store.itinerary.filter((item) => item.id !== target.id);
  store.pendingChange = null;
  logEvent(actor, `${actor === "human" ? "Approved" : "Agent applied"} proposal: removed “${target.name}”`);
  notify();
  return { ok: true, itinerary: getItinerary() };
}
function rejectTripChange() {
  if (!store.pendingChange) return;
  logEvent("human", `Rejected proposal: ${store.pendingChange.description.replace("Remove ", "remove ")}`);
  store.pendingChange = null;
  notify();
}

function getOptionDetails(itemId: string) {
  const item = travelOptions.find(candidate => candidate.id === itemId);
  return item ? { ok: true, item, destination: findDestination(item.destinationId), detailsUrl: item.source } : { ok: false, error: `No catalog option found for ${itemId}` };
}
function listDatasetStats() {
  return { locations: travelDestinations.length, options: travelOptions.length, optionTypes: Array.from(new Set(travelOptions.map(item => item.type))), countries: new Set(travelDestinations.map(item => item.country)).size };
}
function datasetSearch(query: string, type?: TravelKind) { return filterCatalog({ query, type }).slice(0, 50); }
function optionsForTag(tag: string) { return filterCatalog({ tag }).slice(0, 50); }
function cheapestOptions(destinationId?: string, type?: TravelKind) { return [...filterCatalog({ destinationId, type })].sort((a,b) => a.price-b.price).slice(0, 20); }
function highestRatedOptions(destinationId?: string, type?: TravelKind) { return [...filterCatalog({ destinationId, type })].sort((a,b) => b.rating-a.rating).slice(0, 20); }
function getOffers(destinationId?: string) { return filterCatalog({ destinationId, type: "offer" }); }
function getParks(destinationId?: string) { return filterCatalog({ destinationId, type: "park" }); }
function getTouristSpots(destinationId?: string) { return filterCatalog({ destinationId, type: "tourist_spot" }); }
function getActivities(destinationId?: string) { return filterCatalog({ destinationId, type: "activity" }); }
function getHotels(destinationId?: string) { return filterCatalog({ destinationId, type: "hotel" }); }
function getFlights(destinationId?: string) { return filterCatalog({ destinationId, type: "flight" }); }
function getBudgetOptions(destinationId: string, maxPrice: number) { return filterCatalog({ destinationId, maxPrice }).slice(0, 50); }
function getAccessibleOptions(destinationId?: string) { return filterCatalog({ destinationId }).filter(item => item.accessibility.length > 0).slice(0, 50); }
function getCityHighlights(destinationId: string) { const city = findDestination(destinationId); return city ? { city, relatedOptions: travelOptions.filter(item => item.destinationId === destinationId).slice(0, 20) } : { error: `No destination found for ${destinationId}` }; }
function getItineraryByType(type: TravelKind) { return store.itinerary.filter(item => item.type === type); }
function estimateTripCost(destinationId: string, days: number) { const city = findDestination(destinationId); return city ? { destinationId, days, estimatedDailyBudget: city.avgDailyBudget, estimatedTotal: city.avgDailyBudget * days } : { error: `No destination found for ${destinationId}` }; }
function getSourceLinks(ids: string[]) { return ids.map(id => travelOptions.find(item => item.id === id)).filter(Boolean).map(item => ({ id: item!.id, name: item!.name, source: item!.source, sourceLabel: item!.sourceLabel })); }
function getFilterFacets(destinationId?: string) { const items = filterCatalog({ destinationId }); return { types: Array.from(new Set(items.map(item => item.type))), tags: Array.from(new Set(items.flatMap(item => item.tags))).sort(), priceRange: items.length ? { min: Math.min(...items.map(item => item.price)), max: Math.max(...items.map(item => item.price)) } : null }; }
function getRecommendationReason(itemId: string) { const item = travelOptions.find(candidate => candidate.id === itemId); if (!item) return { ok: false, error: `No option found for ${itemId}` }; return { ok: true, itemId, reasons: [`Rated ${item.rating}/5`, `Tagged ${item.tags.slice(0, 3).join(", ")}`, item.cancellation] }; }
function getRelatedOptions(itemId: string) { const item = travelOptions.find(candidate => candidate.id === itemId); return item ? travelOptions.filter(candidate => candidate.destinationId === item.destinationId && candidate.type === item.type && candidate.id !== item.id).slice(0, 20) : []; }
function getDatasetStatus() { return { status: "ready", sourcePolicy: "curated reference links", ...listDatasetStats(), generatedAt: "static build dataset" }; }
function getDestinationsByStyle(style: string) { const query = style.toLowerCase(); return travelDestinations.filter(city => city.bestFor.some(item => item.toLowerCase().includes(query)) || city.highlights.some(item => item.toLowerCase().includes(query))).slice(0, 50); }
function getDestinationsByClimate(climate: string) { return travelDestinations.filter(city => city.climate.toLowerCase().includes(climate.toLowerCase())).slice(0, 50); }
function getCountries() { return Array.from(new Set(travelDestinations.map(city => city.country))).sort(); }
function getPriceRange(destinationId?: string) { const items = filterCatalog({ destinationId }); return items.length ? { min: Math.min(...items.map(item => item.price)), max: Math.max(...items.map(item => item.price)), average: Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length) } : null; }
function getTravelStyles() { return Array.from(new Set(travelDestinations.flatMap(city => city.bestFor))).sort(); }

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  return new Promise<RazorpayConstructor>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    const script = existing ?? document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => window.Razorpay ? resolve(window.Razorpay) : reject(new Error("Razorpay Checkout failed to load."));
    script.onerror = () => reject(new Error("Razorpay Checkout failed to load."));
    if (!existing) document.body.appendChild(script);
  });
}

type ModelContext = { registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => Promise<void> | void };
let webMcpRegistered = false;
let webMcpRegistering = false;
function getModelContext(): ModelContext | undefined {
  const documentContext = (document as Document & { modelContext?: ModelContext }).modelContext;
  const navigatorContext = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
  return documentContext ?? navigatorContext;
}
async function registerWebMcpTools() {
  if (webMcpRegistered) return true;
  if (webMcpRegistering) return false;
  const modelContext = getModelContext();
  if (!modelContext?.registerTool) return false;
  webMcpRegistering = true;
  const tools = [
    { name: "search_destinations", description: "Search available trip destinations by name, country, travel style, climate, or highlight.", inputSchema: { type: "object", properties: { query: { type: "string", description: "Destination name or keyword" } }, required: ["query"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ query }: { query: string }) => searchDestinations(query, "agent") },
    { name: "select_destination", description: "Select a destination for the shared workspace and clear any stale option results from another destination.", inputSchema: { type: "object", properties: { destinationId: { type: "string", description: "Destination catalog ID, for example goa, kyoto, or lisbon" } }, required: ["destinationId"], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: async ({ destinationId }: { destinationId: string }) => selectDestination(destinationId, "agent") },
    { name: "search_options", description: "Find destination options using a price, type, or tag filter.", inputSchema: { type: "object", properties: { destinationId: { type: "string", description: "Destination catalog ID, for example goa, kyoto, or lisbon" }, budget: { type: "number", minimum: 0, description: "Maximum price in catalog units" }, type: { type: "string", enum: ["flight", "hotel", "activity"] }, tag: { type: "string", description: "Tag such as quiet, direct, food, or free" } }, required: ["destinationId"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId, budget, type, tag }: { destinationId: string; budget?: number; type?: Item["type"]; tag?: string }) => searchOptions(destinationId, budget, type, tag, "agent") },
    { name: "get_destination_details", description: "Get structured climate, budget, highlights, and trip-length guidance for a destination.", inputSchema: { type: "object", properties: { destinationId: { type: "string", description: "Destination catalog ID" } }, required: ["destinationId"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId }: { destinationId: string }) => getDestinationDetails(destinationId) },
    { name: "compare_options", description: "Compare selected catalog options by price, rating, tags, cancellation, and accessibility.", inputSchema: { type: "object", properties: { itemIds: { type: "array", minItems: 2, items: { type: "string" }, description: "Two or more catalog item IDs" } }, required: ["itemIds"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ itemIds }: { itemIds: string[] }) => compareOptions(itemIds) },
    { name: "add_to_itinerary", description: "Add a specific catalog item to the current itinerary when the user explicitly asks.", inputSchema: { type: "object", properties: { itemId: { type: "string", description: "Exact catalog item ID" } }, required: ["itemId"], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: async ({ itemId }: { itemId: string }) => addToItinerary(itemId) },
    { name: "remove_from_itinerary", description: "Remove a specific item from the current itinerary when the user explicitly asks.", inputSchema: { type: "object", properties: { itemId: { type: "string", description: "Exact itinerary item ID" } }, required: ["itemId"], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: async ({ itemId }: { itemId: string }) => removeFromItinerary(itemId) },
    { name: "get_itinerary", description: "Get the current shared itinerary with all added items and the running total price.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async () => { logEvent("agent", "Read the shared itinerary and running total"); notify(); return getItinerary(); } },
    { name: "preview_trip_change", title: "Preview a Trip Change", description: "Preview how a requested removal would affect the itinerary total. Creates a reviewable proposal but does not remove an item.", inputSchema: { type: "object", properties: { change: { type: "string", description: "Plain description of the requested removal" } }, required: ["change"], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: async ({ change }: { change: string }) => previewTripChange(change) },
    { name: "apply_trip_change", title: "Apply an Approved Trip Change", description: "Apply a previously previewed change after the human has reviewed and approved it.", inputSchema: { type: "object", properties: { changeId: { type: "string", description: "ID returned by preview_trip_change" } }, required: ["changeId"], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: async ({ changeId }: { changeId: string }) => applyTripChange(changeId) },
    { name: "get_option_details", description: "Get full structured details and source link for one travel option.", inputSchema: { type: "object", properties: { itemId: { type: "string" } }, required: ["itemId"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ itemId }: { itemId: string }) => getOptionDetails(itemId) },
    { name: "dataset_stats", description: "Return counts of available locations, options, countries, and categories.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async () => listDatasetStats() },
    { name: "search_dataset", description: "Search the complete travel dataset by text and optional category.", inputSchema: { type: "object", properties: { query: { type: "string" }, type: { type: "string", enum: ["flight", "hotel", "park", "tourist_spot", "activity", "offer"] } }, required: ["query"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ query, type }: { query: string; type?: TravelKind }) => datasetSearch(query, type) },
    { name: "find_by_tag", description: "Find travel records matching a tag such as beaches, food, nature, offer, or walkable.", inputSchema: { type: "object", properties: { tag: { type: "string" } }, required: ["tag"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ tag }: { tag: string }) => optionsForTag(tag) },
    { name: "cheapest_options", description: "Return the least expensive options for a destination or category.", inputSchema: { type: "object", properties: { destinationId: { type: "string" }, type: { type: "string", enum: ["flight", "hotel", "park", "tourist_spot", "activity", "offer"] } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId, type }: { destinationId?: string; type?: TravelKind }) => cheapestOptions(destinationId, type) },
    { name: "highest_rated_options", description: "Return the highest-rated options for a destination or category.", inputSchema: { type: "object", properties: { destinationId: { type: "string" }, type: { type: "string", enum: ["flight", "hotel", "park", "tourist_spot", "activity", "offer"] } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId, type }: { destinationId?: string; type?: TravelKind }) => highestRatedOptions(destinationId, type) },
    { name: "get_offers", description: "Find current static offer records for a destination.", inputSchema: { type: "object", properties: { destinationId: { type: "string" } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId }: { destinationId?: string }) => getOffers(destinationId) },
    { name: "get_parks", description: "Find parks and nature routes for a destination.", inputSchema: { type: "object", properties: { destinationId: { type: "string" } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId }: { destinationId?: string }) => getParks(destinationId) },
    { name: "get_tourist_spots", description: "Find landmark and tourist spot records for a destination.", inputSchema: { type: "object", properties: { destinationId: { type: "string" } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId }: { destinationId?: string }) => getTouristSpots(destinationId) },
    { name: "get_activities", description: "Find activities and guided experiences for a destination.", inputSchema: { type: "object", properties: { destinationId: { type: "string" } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId }: { destinationId?: string }) => getActivities(destinationId) },
    { name: "get_hotels", description: "Find hotel and stay records for a destination.", inputSchema: { type: "object", properties: { destinationId: { type: "string" } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId }: { destinationId?: string }) => getHotels(destinationId) },
    { name: "get_flights", description: "Find arrival and transport records for a destination.", inputSchema: { type: "object", properties: { destinationId: { type: "string" } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId }: { destinationId?: string }) => getFlights(destinationId) },
    { name: "get_budget_options", description: "Find all options at or below a maximum price.", inputSchema: { type: "object", properties: { destinationId: { type: "string" }, maxPrice: { type: "number", minimum: 0 } }, required: ["destinationId", "maxPrice"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId, maxPrice }: { destinationId: string; maxPrice: number }) => getBudgetOptions(destinationId, maxPrice) },
    { name: "get_accessible_options", description: "Find records that include accessibility guidance.", inputSchema: { type: "object", properties: { destinationId: { type: "string" } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId }: { destinationId?: string }) => getAccessibleOptions(destinationId) },
    { name: "get_city_highlights", description: "Return city highlights and related catalog options.", inputSchema: { type: "object", properties: { destinationId: { type: "string" } }, required: ["destinationId"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId }: { destinationId: string }) => getCityHighlights(destinationId) },
    { name: "estimate_trip_cost", description: "Estimate a city stay using the dataset daily-budget guidance.", inputSchema: { type: "object", properties: { destinationId: { type: "string" }, days: { type: "integer", minimum: 1, maximum: 60 } }, required: ["destinationId", "days"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId, days }: { destinationId: string; days: number }) => estimateTripCost(destinationId, days) },
    { name: "get_itinerary_by_type", description: "Read current itinerary items filtered by category.", inputSchema: { type: "object", properties: { type: { type: "string", enum: ["flight", "hotel", "park", "tourist_spot", "activity", "offer"] } }, required: ["type"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ type }: { type: TravelKind }) => getItineraryByType(type) },
    { name: "get_source_links", description: "Return source and details links for selected catalog items.", inputSchema: { type: "object", properties: { itemIds: { type: "array", items: { type: "string" }, minItems: 1 } }, required: ["itemIds"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ itemIds }: { itemIds: string[] }) => getSourceLinks(itemIds) },
    { name: "get_filter_facets", description: "Return available categories, tags, and price range for filters.", inputSchema: { type: "object", properties: { destinationId: { type: "string" } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId }: { destinationId?: string }) => getFilterFacets(destinationId) },
    { name: "get_recommendation_reason", description: "Explain why a catalog option may fit using rating, tags, and cancellation metadata.", inputSchema: { type: "object", properties: { itemId: { type: "string" } }, required: ["itemId"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ itemId }: { itemId: string }) => getRecommendationReason(itemId) },
    { name: "get_related_options", description: "Find related options in the same destination and category.", inputSchema: { type: "object", properties: { itemId: { type: "string" } }, required: ["itemId"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ itemId }: { itemId: string }) => getRelatedOptions(itemId) },
    { name: "dataset_status", description: "Return the current dataset readiness and source policy.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async () => getDatasetStatus() },
    { name: "find_destinations_by_style", description: "Find cities matching a travel style such as food, beaches, culture, nature, or design.", inputSchema: { type: "object", properties: { style: { type: "string" } }, required: ["style"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ style }: { style: string }) => getDestinationsByStyle(style) },
    { name: "find_destinations_by_climate", description: "Find cities whose climate description matches a requested climate keyword.", inputSchema: { type: "object", properties: { climate: { type: "string" } }, required: ["climate"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ climate }: { climate: string }) => getDestinationsByClimate(climate) },
    { name: "list_countries", description: "List all countries represented in the travel dataset.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async () => getCountries() },
    { name: "get_price_range", description: "Return minimum, maximum, and average option price for a destination.", inputSchema: { type: "object", properties: { destinationId: { type: "string" } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ destinationId }: { destinationId?: string }) => getPriceRange(destinationId) },
    { name: "list_travel_styles", description: "List all travel styles available for destination discovery.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async () => getTravelStyles() },
  ];
  try {
    for (const tool of tools) await modelContext.registerTool(tool);
    webMcpRegistered = true;
    return true;
  } catch (error) {
    console.warn("WebMCP tool registration failed; will retry.", error);
    return false;
  } finally {
    webMcpRegistering = false;
  }
}

function startWebMcpRegistration() {
  let stopped = false;
  const attempt = async () => {
    if (stopped) return;
    if (await registerWebMcpTools()) window.clearInterval(timer);
  };
  const timer = window.setInterval(() => { void attempt(); }, 250);
  void attempt();
  const stop = window.setTimeout(() => window.clearInterval(timer), 15000);
  return () => { stopped = true; window.clearInterval(timer); window.clearTimeout(stop); };
}

function typeIcon(type: Item["type"]) { return type === "flight" ? <Plane size={15} /> : type === "hotel" ? <BedDouble size={15} /> : type === "park" || type === "tourist_spot" ? <MapPin size={15} /> : <Utensils size={15} />; }
function SourceLink({ item }: { item: Item }) { return <a className="source-link" href={item.source} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}><ArrowUpRight size={12} /> {item.sourceLabel}</a>; }

export default function Home() {
  const [, redraw] = useState(0);
  const [activeTab, setActiveTab] = useState<"destinations" | "options">("destinations");
  const [destinationPage, setDestinationPage] = useState(0);
  const [detailDestinationId, setDetailDestinationId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [paymentState, setPaymentState] = useState<"idle" | "loading" | "confirmed">("idle");
  useEffect(() => { const handler = () => redraw((value) => value + 1); listeners.push(handler); const stopWebMcpRetry = startWebMcpRegistration(); return () => { listeners = listeners.filter((listener) => listener !== handler); stopWebMcpRetry(); }; }, []);
  const current = snapshot();
  const destination = travelDestinations.find((item) => item.id === current.selectedDestination) ?? travelDestinations[0];
  const destinationMatches = current.query ? travelDestinations.filter((item) => `${item.name} ${item.region} ${item.country} ${item.bestFor.join(" ")} ${item.highlights.join(" ")}`.toLowerCase().includes(current.query.toLowerCase())) : travelDestinations;
  const destinationPageCount = Math.max(1, Math.ceil(destinationMatches.length / 3));
  const safeDestinationPage = Math.min(destinationPage, destinationPageCount - 1);
  const displayedDestinations = destinationMatches.slice(safeDestinationPage * 3, safeDestinationPage * 3 + 3);
  const detailDestination = detailDestinationId ? findDestination(detailDestinationId) : null;
  const visibleOptions = current.resultsActive ? current.results : travelOptions.filter((item) => item.destinationId === destination.id);
  const total = useMemo(() => getItinerary().total, [current.itinerary]);
  const humanAction = (fn: () => unknown, message: string) => { fn(); setToast(message); window.setTimeout(() => setToast(""), 2200); };
  useEffect(() => {
    void fetch("/api/itinerary-state", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemIds: current.itinerary.map((item) => item.id) }) });
  }, [current.itinerary]);
  const reserveItinerary = async () => {
    setPaymentState("loading");
    try {
      await fetch("/api/itinerary-state", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemIds: snapshot().itinerary.map((item) => item.id) }) });
      const orderResponse = await fetch("/api/create-order", { method: "POST" });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error ?? "Unable to create test order.");
      const Razorpay = await loadRazorpayCheckout();
      new Razorpay({ key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId, name: "trip_world", description: "Test-mode itinerary reservation", handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const verification = await fetch("/api/verify-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(response) });
        const result = await verification.json();
        if (!verification.ok || !result.ok) throw new Error(result.error ?? "Payment verification failed.");
        setPaymentState("confirmed");
        logEvent("human", "Reserved itinerary · Razorpay test payment verified");
        notify();
      }, modal: { ondismiss: () => setPaymentState("idle") } }).open();
    } catch (error) {
      setPaymentState("idle");
      setToast(error instanceof Error ? error.message : "Unable to start test payment.");
      window.setTimeout(() => setToast(""), 3200);
    }
  };

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><img src={COMPASS_MARK} alt="" /><div><span className="eyebrow">WEBMCP FIELD TEST · 01</span><strong className="wordmark">trip<span>_world</span><i /></strong></div></div>
      <div className="topbar-right"><span className="live-dot" /> <span>Shared workspace live</span><span className="topbar-divider" /><span className="kbd">⌘ K</span></div>
    </header>
    <main className="workspace">
      <section className="main-canvas">
        <div className="hero-grid">
        <div className="hero-copy"><span className="eyebrow teal">trip_world · a living route, built together</span><h1>You go.<br /><em>We go.</em></h1><p>trip_world gives people and agents one world-scale travel dataset, 35+ shared tools, and one itinerary that never needs refreshing.</p><div className="hero-proof"><span><Sparkles size={14} /> 35+ shared tools</span><span><Check size={14} /> Human payment boundary</span></div></div>
          <div className="hero-image"><img src={COASTAL_IMAGE} alt="Coastal map and compass on a travel desk" /><div className="image-stamp">GO<br /><small>where the day opens</small></div></div>
        </div>
        <div className="section-heading"><div><span className="eyebrow">01 · FIND A PLACE</span><h2>Start with a destination</h2></div><span className="section-note"><UserRound size={13} /> Human + agent · same search</span></div>
        <div className="search-row"><div className="search-input"><Search size={18} /><input aria-label="Search destinations" placeholder="Search Goa, Kyoto, Lisbon…" value={current.query} onChange={(event) => { setDestinationPage(0); setStore({ query: event.target.value, results: [], resultsActive: false }); }} onKeyDown={(event) => { if (event.key === "Enter") { setDestinationPage(0); searchDestinations(current.query); setActiveTab("destinations"); } }} /><kbd>↵</kbd>{current.query && <button className="search-clear" aria-label="Clear destination search" onClick={() => { setDestinationPage(0); setStore({ query: "", results: [], resultsActive: false }); }}>×</button>}</div><button className="button button-ink" onClick={() => { setDestinationPage(0); searchDestinations(current.query); setActiveTab("destinations"); }}>Search destinations</button></div>
        {destinationMatches.length > 0 ? <><div className="destination-carousel"><button className="carousel-arrow" aria-label="Show previous places" disabled={safeDestinationPage === 0} onClick={() => setDestinationPage((page) => Math.max(0, page - 1))}>↑</button><div className="destination-row">{displayedDestinations.map((item) => <button key={item.id} className={`destination-card ${item.id === destination.id ? "selected" : ""}`} onClick={() => { selectDestination(item.id); setActiveTab("options"); setDetailDestinationId(null); }}><span className="pin"><MapPin size={15} /></span><span><strong>{item.name}</strong><small>{item.region} · {item.idealDays} · from {formatINR(item.avgDailyBudget)}/day</small></span><ArrowUpRight className="destination-open" size={15} /></button>)}</div><button className="carousel-arrow" aria-label="Show next places" disabled={safeDestinationPage >= destinationPageCount - 1} onClick={() => setDestinationPage((page) => Math.min(destinationPageCount - 1, page + 1))}>↓</button></div><div className="destination-pager"><span>Showing {safeDestinationPage * 3 + 1}–{Math.min((safeDestinationPage + 1) * 3, destinationMatches.length)} of {destinationMatches.length} places</span><small>{current.query ? `Results for “${current.query}”` : "Choose a place to view its options"}</small></div></> : <div className="destination-empty"><Search size={20} /><strong>No destination found</strong><span>Try a city, country, region, or travel style such as “beach”, “food”, or “culture”.</span><button className="button button-ink" onClick={() => setStore({ query: "", results: [], resultsActive: false })}>Show popular places</button></div>}
        <div className="options-head"><div className="tabs"><button className={activeTab === "destinations" ? "active" : ""} onClick={() => setActiveTab("destinations")}>Destinations <b>{travelDestinations.length}</b></button><button className={activeTab === "options" ? "active" : ""} onClick={() => setActiveTab("options")}>Options for {destination.name} <b>{visibleOptions.length}</b></button></div><div className="budget-filter"><SlidersHorizontal size={15} /><label htmlFor="budget">Max budget</label><input id="budget" inputMode="numeric" placeholder="—" value={current.budget} onChange={(event) => setStore({ budget: event.target.value })} onKeyDown={(event) => { if (event.key === "Enter") searchOptions(destination.id, current.budget ? Number(current.budget) : undefined, undefined, undefined); }} /><span>INR</span></div></div>
        {activeTab === "destinations" ? <div className="destinations-panel">{displayedDestinations.map((item) => <button className="result-line" key={item.id} onClick={() => setDetailDestinationId(item.id)}><span className="result-icon"><Compass size={17} /></span><span><strong>{item.name}</strong><small>{item.blurb}</small></span><ArrowUpRight size={15} /></button>)}</div> : <div className="options-grid">{visibleOptions.map((item) => { const added = current.itinerary.some((candidate) => candidate.id === item.id); return <article className={`option-card ${added ? "in-itinerary" : ""}`} key={item.id}><div className="option-top"><span className="type-label">{typeIcon(item.type)} {item.type}</span><span className="verified">VERIFIED</span></div><h3>{item.name}</h3><p className="vendor">{item.vendor} · {item.detail}</p><div className="option-meta"><span>★ {item.rating}</span><span>{item.cancellation}</span></div><div className="tag-list">{item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div><div className="option-bottom"><div><strong className="price">{formatINR(item.price)}</strong><span className="per">{item.price ? " / person" : " free"}</span><SourceLink item={item} /></div><button className={`add-button ${added ? "added" : ""}`} onClick={() => humanAction(() => added ? removeFromItinerary(item.id, "human") : addToItinerary(item.id, "human"), added ? "Removed from shared itinerary" : "Added to shared itinerary")}>{added ? <><Check size={15} /> Added</> : <><Plus size={15} /> Add</>}</button></div></article>; })}</div>}
      </section>
      <aside className="side-rail">
        <section className="itinerary-panel"><div className="panel-kicker"><span className="eyebrow teal">THE SHARED NOTEBOOK</span><span className="state-pill"><span className="live-dot" /> SYNCED</span></div><div className="route-title"><div><h2>Your itinerary</h2><p>{current.itinerary.length ? `${current.itinerary.length} item${current.itinerary.length > 1 ? "s" : ""} · {destination.name}` : "Nothing pinned yet · start exploring"}</p></div><img src={NOTEBOOK_IMAGE} alt="" /></div><div className="route-line"><i /><i /><i /></div>{current.itinerary.length ? <div className="itinerary-list">{current.itinerary.map((item) => <div className="itinerary-item" key={item.id}><span className="item-type">{typeIcon(item.type)}</span><div><strong>{item.name}</strong><small>{item.vendor} · {item.duration} · ★ {item.rating}</small><div className="tag-list">{item.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div><SourceLink item={item} /></div><span className="item-price">{formatINR(item.price)}</span><button className="icon-button" aria-label={`Remove ${item.name}`} onClick={() => humanAction(() => removeFromItinerary(item.id, "human"), "Removed from shared itinerary")}><Minus size={14} /></button></div>)}</div> : <div className="empty-itinerary"><Compass size={25} /><p>Your first pin will appear here.</p><span>Human and agent actions land in the same notebook.</span></div>}<div className="total-row"><span>Running total</span><strong>{formatINR(total)}</strong></div>{current.itinerary.length > 0 && <><div className="reserve-area">{paymentState === "confirmed" ? <div className="payment-confirmed"><Check size={16} /> Reservation confirmed (test payment)</div> : <><button className="button button-reserve" onClick={reserveItinerary} disabled={paymentState === "loading"}>{paymentState === "loading" ? "Opening secure checkout…" : "Reserve (test payment)"}</button><span className="test-payment-note">TEST MODE — no real payment</span></>}</div><div className="source-strip"><span className="eyebrow">SOURCES IN THIS NOTE</span><div>{Array.from(new Set(current.itinerary.map((item) => item.source))).map((source) => <a key={source} href={source} target="_blank" rel="noreferrer">{new URL(source).hostname.replace("www.", "")} <ArrowUpRight size={11} /></a>)}</div></div></>}</section>
        {current.pendingChange && <section className="proposal-card"><div className="proposal-kicker"><span><Sparkles size={13} /> AGENT PROPOSAL</span><span>REVIEW REQUIRED</span></div><h3>{current.pendingChange.description}</h3><div className="proposal-impact"><span>{current.pendingChange.impact.costDelta < 0 ? "Save" : "Change"} <strong>{formatINR(Math.abs(current.pendingChange.impact.costDelta))}</strong></span><span className="proposal-arrow">→</span><span>new total <strong>{formatINR(current.pendingChange.impact.newTotal)}</strong></span></div><div className="proposal-actions"><button className="button button-ink" onClick={() => humanAction(() => applyTripChange(current.pendingChange!.id, "human"), "Proposal approved and applied")}>Apply change</button><button className="button button-reject" onClick={() => humanAction(() => rejectTripChange(), "Proposal rejected")}>Reject</button></div></section>}
        <section className="activity-panel"><div className="activity-head"><div><span className="eyebrow">RECEIPT · SHARED STATE</span><h3>Agent ledger</h3><p className="activity-subtitle">Every human + agent move, in order.</p></div><span className="activity-count">{current.events.length} events</span></div><div className="activity-list">{current.events.length ? current.events.map((event) => <div className="activity-item" key={event.id}><span className={`actor-icon ${event.actor}`}>{event.actor === "agent" ? <Bot size={13} /> : <UserRound size={13} />}</span><div><strong>{event.actor === "agent" ? "AGENT" : "HUMAN"}</strong><small>{event.action}</small></div><time>{event.time}</time></div>) : <div className="activity-empty"><Clock3 size={16} /> Tool calls will appear here live.</div>}</div></section>
        <div className="safety-note"><CircleAlert size={15} /><span>Search and itinerary building are shared. Booking and payment are intentionally outside the tool surface.</span></div>
      </aside>
    </main>
    {detailDestination && <div className="destination-modal-backdrop" role="presentation" onClick={() => setDetailDestinationId(null)}><section className="destination-modal" role="dialog" aria-modal="true" aria-labelledby="destination-details-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close destination details" onClick={() => setDetailDestinationId(null)}>×</button><span className="eyebrow teal">DESTINATION DETAILS</span><h2 id="destination-details-title">{detailDestination.name}</h2><p className="modal-region">{detailDestination.country} · {detailDestination.region}</p><p className="modal-blurb">{detailDestination.blurb}</p><div className="modal-stats"><span><b>{detailDestination.idealDays}</b><small>ideal stay</small></span><span><b>{formatINR(detailDestination.avgDailyBudget)}</b><small>average/day</small></span><span><b>{detailDestination.currency}</b><small>local currency</small></span></div><div className="modal-section"><span className="eyebrow">HIGHLIGHTS</span><div className="tag-list">{detailDestination.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}</div></div><div className="modal-section"><span className="eyebrow">BEST FOR</span><div className="tag-list">{detailDestination.bestFor.map((style) => <span key={style}>{style}</span>)}</div></div><div className="modal-actions"><button className="button button-ink" onClick={() => { selectDestination(detailDestination.id); setActiveTab("options"); setDetailDestinationId(null); }}>Explore {detailDestination.name} options</button><a className="button modal-source" href={`https://en.wikipedia.org/wiki/${encodeURIComponent(detailDestination.name.replace(/ /g, "_"))}`} target="_blank" rel="noreferrer">View reference <ArrowUpRight size={14} /></a></div></section></div>}
    <footer className="site-footer"><span>trip_world · You go. We go.</span><a href="https://www.linkedin.com/in/moreshwar-patil/" target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={13} /></a></footer>
    {toast && <div className="toast"><Sparkles size={15} /> {toast}</div>}
  </div>;
}
