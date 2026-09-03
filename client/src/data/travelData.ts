export type TravelKind = "flight" | "hotel" | "park" | "tourist_spot" | "activity" | "offer";

export type CitySeed = {
  id: string;
  name: string;
  country: string;
  region: string;
  currency: string;
  climate: string;
  bestFor: string[];
  highlights: string[];
  dailyBudget: number;
  idealDays: string;
};

export type TravelOption = {
  id: string;
  destinationId: string;
  type: TravelKind;
  name: string;
  vendor: string;
  detail: string;
  price: number;
  duration: string;
  tags: string[];
  rating: number;
  cancellation: string;
  accessibility: string[];
  source: string;
  sourceLabel: string;
};

const cities: Array<[string, string, string, string, string, string, string[], string[], number, string]> = [
  ["goa", "Goa", "India", "South Asia · Konkan coast", "INR", "Tropical; warm year-round", ["beaches", "food", "slow travel"], ["South Goa beaches", "Portuguese heritage", "Konkan seafood"], 75, "3–5 days"],
  ["kyoto", "Kyoto", "Japan", "East Asia · Kansai", "JPY", "Four seasons; mild spring and autumn", ["culture", "food", "craft"], ["Temple gardens", "Tea culture", "Arashiyama"], 145, "3–4 days"],
  ["lisbon", "Lisbon", "Portugal", "Europe · Atlantic edge", "EUR", "Mediterranean; sunny and mild", ["architecture", "food", "city breaks"], ["Alfama", "Tile workshops", "Atlantic viewpoints"], 120, "3–5 days"],
  ["tokyo", "Tokyo", "Japan", "East Asia · Kanto", "JPY", "Humid subtropical; distinct seasons", ["food", "design", "nightlife"], ["Shibuya", "Asakusa", "Tsukiji"], 160, "4–6 days"],
  ["paris", "Paris", "France", "Europe · Île-de-France", "EUR", "Temperate; cool winters", ["art", "food", "architecture"], ["Louvre", "Seine", "Montmartre"], 180, "3–5 days"],
  ["rome", "Rome", "Italy", "Europe · Lazio", "EUR", "Mediterranean; hot summers", ["history", "food", "architecture"], ["Colosseum", "Trastevere", "Vatican Museums"], 150, "3–5 days"],
  ["barcelona", "Barcelona", "Spain", "Europe · Catalonia", "EUR", "Mediterranean; bright and coastal", ["architecture", "beaches", "food"], ["Sagrada Família", "Gothic Quarter", "Barceloneta"], 135, "3–5 days"],
  ["amsterdam", "Amsterdam", "Netherlands", "Europe · North Holland", "EUR", "Oceanic; mild and changeable", ["museums", "cycling", "canals"], ["Rijksmuseum", "Jordaan", "Canal ring"], 165, "3–4 days"],
  ["london", "London", "United Kingdom", "Europe · England", "GBP", "Oceanic; cool and rainy", ["museums", "theatre", "food"], ["British Museum", "South Bank", "Borough Market"], 190, "4–6 days"],
  ["istanbul", "Istanbul", "Türkiye", "Europe/Asia · Bosphorus", "TRY", "Mediterranean transition; mild winters", ["history", "food", "markets"], ["Hagia Sophia", "Grand Bazaar", "Bosphorus"], 95, "3–5 days"],
  ["marrakech", "Marrakech", "Morocco", "Africa · Marrakesh-Safi", "MAD", "Semi-arid; sunny days", ["markets", "design", "wellness"], ["Medina", "Majorelle Garden", "Atlas foothills"], 70, "3–4 days"],
  ["cairo", "Cairo", "Egypt", "Africa · Nile Valley", "EGP", "Hot desert; dry climate", ["history", "food", "markets"], ["Giza Plateau", "Khan el-Khalili", "Nile corniche"], 65, "3–4 days"],
  ["cape-town", "Cape Town", "South Africa", "Africa · Western Cape", "ZAR", "Mediterranean; dry summers", ["nature", "wine", "adventure"], ["Table Mountain", "Bo-Kaap", "Cape Peninsula"], 105, "4–6 days"],
  ["nairobi", "Nairobi", "Kenya", "Africa · Nairobi County", "KES", "Highland; mild year-round", ["wildlife", "food", "nature"], ["Nairobi National Park", "Karen", "Giraffe Centre"], 90, "3–5 days"],
  ["new-york", "New York City", "United States", "North America · New York", "USD", "Humid continental; four seasons", ["museums", "food", "nightlife"], ["Central Park", "Brooklyn", "Broadway"], 220, "4–6 days"],
  ["san-francisco", "San Francisco", "United States", "North America · California", "USD", "Cool-summer Mediterranean", ["design", "food", "nature"], ["Golden Gate", "Mission District", "Alcatraz"], 205, "3–5 days"],
  ["mexico-city", "Mexico City", "Mexico", "North America · Valley of Mexico", "MXN", "High-altitude subtropical", ["food", "art", "history"], ["Chapultepec", "Roma Norte", "Frida Kahlo Museum"], 85, "3–5 days"],
  ["vancouver", "Vancouver", "Canada", "North America · British Columbia", "CAD", "Oceanic; mild and wet", ["nature", "food", "cycling"], ["Stanley Park", "Granville Island", "North Shore"], 175, "3–5 days"],
  ["buenos-aires", "Buenos Aires", "Argentina", "South America · Río de la Plata", "ARS", "Humid subtropical; warm summers", ["tango", "food", "architecture"], ["Recoleta", "San Telmo", "Palermo"], 80, "3–5 days"],
  ["rio", "Rio de Janeiro", "Brazil", "South America · Atlantic coast", "BRL", "Tropical; coastal and humid", ["beaches", "music", "nature"], ["Copacabana", "Sugarloaf", "Santa Teresa"], 90, "4–6 days"],
  ["sao-paulo", "São Paulo", "Brazil", "South America · Southeast", "BRL", "Subtropical; rainy summer", ["food", "art", "design"], ["Paulista Avenue", "Liberdade", "Pinacoteca"], 85, "3–4 days"],
  ["lima", "Lima", "Peru", "South America · Pacific coast", "PEN", "Desert coast; cloudy winters", ["food", "history", "design"], ["Miraflores", "Barranco", "Historic Centre"], 75, "3–4 days"],
  ["santiago", "Santiago", "Chile", "South America · Central Valley", "CLP", "Mediterranean; mountain backdrop", ["wine", "nature", "food"], ["Lastarria", "Cerro San Cristóbal", "Maipo Valley"], 95, "3–5 days"],
  ["cusco", "Cusco", "Peru", "South America · Andes", "PEN", "Highland; dry and cool", ["history", "hiking", "culture"], ["Sacsayhuamán", "San Blas", "Sacred Valley"], 70, "3–5 days"],
  ["bali", "Bali", "Indonesia", "Southeast Asia · Lesser Sundas", "IDR", "Tropical; wet and dry seasons", ["beaches", "wellness", "nature"], ["Ubud", "Uluwatu", "Rice terraces"], 70, "5–8 days"],
  ["singapore", "Singapore", "Singapore", "Southeast Asia · island city", "SGD", "Equatorial; hot and humid", ["food", "design", "family"], ["Gardens by the Bay", "Tiong Bahru", "Sentosa"], 190, "3–5 days"],
  ["bangkok", "Bangkok", "Thailand", "Southeast Asia · Chao Phraya", "THB", "Tropical; hot and humid", ["food", "markets", "nightlife"], ["Grand Palace", "Chinatown", "Chatuchak"], 75, "3–5 days"],
  ["hanoi", "Hanoi", "Vietnam", "Southeast Asia · Red River Delta", "VND", "Humid subtropical; seasonal", ["food", "history", "culture"], ["Old Quarter", "West Lake", "Temple of Literature"], 55, "3–4 days"],
  ["seoul", "Seoul", "South Korea", "East Asia · Han River", "KRW", "Humid continental; four seasons", ["design", "food", "shopping"], ["Bukchon", "Hongdae", "Gyeongbokgung"], 135, "4–6 days"],
  ["beijing", "Beijing", "China", "East Asia · North China Plain", "CNY", "Monsoon-influenced; cold winters", ["history", "food", "culture"], ["Forbidden City", "Great Wall", "hutongs"], 120, "4–6 days"],
  ["shanghai", "Shanghai", "China", "East Asia · Yangtze Delta", "CNY", "Humid subtropical; rainy summers", ["design", "food", "architecture"], ["The Bund", "French Concession", "Yu Garden"], 135, "3–5 days"],
  ["hong-kong", "Hong Kong", "Hong Kong", "East Asia · Pearl River Delta", "HKD", "Subtropical; humid summers", ["food", "hiking", "shopping"], ["Victoria Peak", "Kowloon", "Lantau"], 175, "3–5 days"],
  ["sydney", "Sydney", "Australia", "Oceania · New South Wales", "AUD", "Temperate; sunny coastal", ["beaches", "food", "nature"], ["Harbour Bridge", "Bondi", "The Rocks"], 185, "4–6 days"],
  ["melbourne", "Melbourne", "Australia", "Oceania · Victoria", "AUD", "Temperate oceanic; changeable", ["coffee", "art", "design"], ["Laneways", "NGV", "Great Ocean Road"], 175, "4–6 days"],
  ["auckland", "Auckland", "New Zealand", "Oceania · North Island", "NZD", "Mild oceanic; coastal", ["nature", "food", "adventure"], ["Waiheke", "Harbour", "Volcanic cones"], 160, "3–5 days"],
  ["honolulu", "Honolulu", "United States", "Pacific · Oahu", "USD", "Tropical; trade winds", ["beaches", "surf", "nature"], ["Waikiki", "Diamond Head", "North Shore"], 230, "4–6 days"],
  ["reykjavik", "Reykjavik", "Iceland", "Europe · Capital Region", "ISK", "Subarctic oceanic; cool", ["nature", "wellness", "design"], ["Blue Lagoon", "Golden Circle", "Harpa"], 210, "3–5 days"],
  ["zurich", "Zurich", "Switzerland", "Europe · Swiss Plateau", "CHF", "Temperate; snowy winters", ["lakes", "design", "food"], ["Lake Zurich", "Old Town", "Uetliberg"], 230, "3–4 days"],
  ["vienna", "Vienna", "Austria", "Europe · Danube", "EUR", "Oceanic/continental transition", ["music", "cafes", "architecture"], ["MuseumsQuartier", "Schönbrunn", "Ringstrasse"], 155, "3–5 days"],
  ["prague", "Prague", "Czechia", "Europe · Bohemia", "CZK", "Temperate; cold winters", ["architecture", "beer", "history"], ["Charles Bridge", "Old Town", "Letná"], 105, "3–4 days"],
  ["budapest", "Budapest", "Hungary", "Europe · Danube", "HUF", "Temperate continental", ["baths", "architecture", "food"], ["Thermal baths", "Buda Castle", "Ruin bars"], 95, "3–4 days"],
  ["athens", "Athens", "Greece", "Europe · Attica", "EUR", "Mediterranean; dry summers", ["history", "food", "islands"], ["Acropolis", "Plaka", "Riviera"], 110, "3–5 days"],
  ["dubrovnik", "Dubrovnik", "Croatia", "Europe · Dalmatian coast", "EUR", "Mediterranean; sunny coast", ["history", "beaches", "views"], ["Old Town", "City Walls", "Lokrum"], 145, "3–4 days"],
  ["edinburgh", "Edinburgh", "United Kingdom", "Europe · Scotland", "GBP", "Cool oceanic; windy", ["history", "walks", "whisky"], ["Edinburgh Castle", "Arthur's Seat", "Old Town"], 155, "3–4 days"],
  ["berlin", "Berlin", "Germany", "Europe · Brandenburg", "EUR", "Temperate; four seasons", ["history", "art", "nightlife"], ["Museum Island", "Kreuzberg", "East Side Gallery"], 140, "3–5 days"],
  ["copenhagen", "Copenhagen", "Denmark", "Europe · Zealand", "DKK", "Oceanic; cool summers", ["cycling", "design", "food"], ["Nyhavn", "Tivoli", "Nørrebro"], 205, "3–4 days"],
  ["stockholm", "Stockholm", "Sweden", "Europe · Baltic archipelago", "SEK", "Cold winters; bright summers", ["design", "islands", "museums"], ["Gamla Stan", "Vasa Museum", "Djurgården"], 210, "3–4 days"],
  ["oslo", "Oslo", "Norway", "Europe · Oslofjord", "NOK", "Cool oceanic; snowy winters", ["nature", "design", "saunas"], ["Fjord", "Vigeland Park", "Bygdøy"], 225, "3–4 days"],
  ["helsinki", "Helsinki", "Finland", "Europe · Gulf of Finland", "EUR", "Cold temperate; snowy winters", ["design", "saunas", "islands"], ["Suomenlinna", "Design District", "Market Square"], 190, "3–4 days"],
  ["tallinn", "Tallinn", "Estonia", "Europe · Baltic", "EUR", "Cool temperate; snowy winters", ["history", "design", "walks"], ["Medieval Old Town", "Telliskivi", "Kadriorg"], 105, "2–4 days"],
  ["riga", "Riga", "Latvia", "Europe · Baltic", "EUR", "Cool temperate; snowy winters", ["architecture", "markets", "culture"], ["Art Nouveau", "Central Market", "Old Town"], 90, "2–4 days"],
  ["vilnius", "Vilnius", "Lithuania", "Europe · Baltic", "EUR", "Humid continental", ["history", "parks", "cafes"], ["Old Town", "Užupis", "Gediminas Tower"], 85, "2–4 days"],
  ["porto", "Porto", "Portugal", "Europe · Douro", "EUR", "Mediterranean oceanic", ["wine", "food", "architecture"], ["Ribeira", "Port cellars", "Foz"], 105, "3–4 days"],
  ["seville", "Seville", "Spain", "Europe · Andalusia", "EUR", "Hot-summer Mediterranean", ["history", "flamenco", "food"], ["Alcázar", "Triana", "Plaza de España"], 100, "3–4 days"],
  ["valencia", "Valencia", "Spain", "Europe · Mediterranean coast", "EUR", "Mediterranean; mild winters", ["beaches", "food", "design"], ["City of Arts", "Turia Gardens", "Central Market"], 105, "3–5 days"],
  ["nice", "Nice", "France", "Europe · French Riviera", "EUR", "Mediterranean; sunny coast", ["beaches", "art", "food"], ["Promenade", "Old Nice", "Castle Hill"], 165, "3–4 days"],
  ["florence", "Florence", "Italy", "Europe · Tuscany", "EUR", "Mediterranean; warm summers", ["art", "history", "food"], ["Uffizi", "Duomo", "Oltrarno"], 145, "2–4 days"],
  ["venice", "Venice", "Italy", "Europe · Venetian Lagoon", "EUR", "Humid subtropical", ["art", "architecture", "canals"], ["Grand Canal", "Dorsoduro", "Burano"], 180, "2–4 days"],
  ["munich", "Munich", "Germany", "Europe · Bavaria", "EUR", "Oceanic/continental", ["beer", "museums", "parks"], ["English Garden", "Residenz", "Alps day trip"], 165, "3–4 days"],
  ["brussels", "Brussels", "Belgium", "Europe · Brussels-Capital", "EUR", "Oceanic; changeable", ["chocolate", "art", "architecture"], ["Grand Place", "Sablon", "Comic murals"], 145, "2–4 days"],
  ["geneva", "Geneva", "Switzerland", "Europe · Lake Geneva", "CHF", "Temperate; alpine influence", ["lakes", "food", "museums"], ["Jet d'Eau", "Old Town", "Lake promenade"], 230, "2–4 days"],
  ["tel-aviv", "Tel Aviv", "Israel", "Middle East · Mediterranean", "ILS", "Mediterranean; hot summers", ["beaches", "food", "nightlife"], ["Jaffa", "Rothschild", "Beach promenade"], 190, "3–5 days"],
  ["amman", "Amman", "Jordan", "Middle East · Levant", "JOD", "Mediterranean semi-arid", ["history", "food", "desert"], ["Citadel", "Rainbow Street", "Roman Theatre"], 90, "2–4 days"],
  ["muscat", "Muscat", "Oman", "Middle East · Gulf of Oman", "OMR", "Hot desert; coastal", ["beaches", "desert", "culture"], ["Mutrah Souq", "Wadis", "Sultan Qaboos Mosque"], 120, "3–5 days"],
  ["doha", "Doha", "Qatar", "Middle East · Arabian Gulf", "QAR", "Hot desert; sunny", ["design", "museums", "food"], ["Museum of Islamic Art", "Souq Waqif", "Corniche"], 155, "2–4 days"],
  ["riyadh", "Riyadh", "Saudi Arabia", "Middle East · Najd", "SAR", "Hot desert; dry", ["food", "design", "history"], ["Diriyah", "Edge of the World", "Kingdom Centre"], 130, "2–4 days"],
  ["mumbai", "Mumbai", "India", "South Asia · Maharashtra", "INR", "Tropical wet and dry", ["food", "cinema", "architecture"], ["Colaba", "Marine Drive", "Kala Ghoda"], 70, "3–5 days"],
  ["delhi", "New Delhi", "India", "South Asia · National Capital", "INR", "Semi-arid; hot summers", ["history", "food", "markets"], ["Lodhi Garden", "Humayun's Tomb", "Chandni Chowk"], 65, "3–5 days"],
  ["jaipur", "Jaipur", "India", "South Asia · Rajasthan", "INR", "Semi-arid; hot and dry", ["heritage", "craft", "food"], ["Amber Fort", "Pink City", "Hawa Mahal"], 60, "2–4 days"],
  ["varanasi", "Varanasi", "India", "South Asia · Ganges", "INR", "Humid subtropical", ["spirituality", "history", "food"], ["Ghats", "Sarnath", "Old City"], 45, "2–4 days"],
  ["kolkata", "Kolkata", "India", "South Asia · West Bengal", "INR", "Tropical wet and dry", ["food", "literature", "heritage"], ["Victoria Memorial", "Kumartuli", "Park Street"], 50, "3–4 days"],
  ["kathmandu", "Kathmandu", "Nepal", "South Asia · Kathmandu Valley", "NPR", "Subtropical highland", ["hiking", "culture", "temples"], ["Durbar Square", "Boudhanath", "Patan"], 55, "3–5 days"],
  ["colombo", "Colombo", "Sri Lanka", "South Asia · western coast", "LKR", "Tropical; humid coast", ["food", "beaches", "heritage"], ["Galle Face", "Fort", "Pettah"], 60, "2–4 days"],
  ["male", "Malé", "Maldives", "South Asia · Indian Ocean", "MVR", "Tropical; warm and humid", ["beaches", "diving", "wellness"], ["Atolls", "Coral reefs", "Hulhumalé"], 210, "3–6 days"],
  ["perth", "Perth", "Australia", "Oceania · Western Australia", "AUD", "Mediterranean; sunny", ["beaches", "wine", "nature"], ["Swan River", "Fremantle", "Rottnest"], 170, "3–5 days"],
  ["queenstown", "Queenstown", "New Zealand", "Oceania · South Island", "NZD", "Alpine; cool and crisp", ["adventure", "lakes", "wine"], ["Lake Wakatipu", "Remarkables", "Milford Sound"], 185, "3–5 days"],
  ["cairns", "Cairns", "Australia", "Oceania · Queensland", "AUD", "Tropical; wet and dry", ["reef", "rainforest", "adventure"], ["Great Barrier Reef", "Daintree", "Esplanade"], 165, "3–5 days"],
  ["los-angeles", "Los Angeles", "United States", "North America · California", "USD", "Mediterranean; dry summers", ["film", "beaches", "food"], ["Griffith Observatory", "Santa Monica", "Arts District"], 210, "4–6 days"],
  ["chicago", "Chicago", "United States", "North America · Illinois", "USD", "Humid continental", ["architecture", "food", "music"], ["Millennium Park", "Riverwalk", "Museum Campus"], 175, "3–5 days"],
  ["boston", "Boston", "United States", "North America · Massachusetts", "USD", "Humid continental", ["history", "universities", "food"], ["Freedom Trail", "Back Bay", "Harborwalk"], 195, "3–4 days"],
  ["seattle", "Seattle", "United States", "North America · Pacific Northwest", "USD", "Oceanic; mild and wet", ["coffee", "nature", "design"], ["Pike Place", "Lake Union", "Discovery Park"], 190, "3–5 days"],
  ["montreal", "Montreal", "Canada", "North America · Quebec", "CAD", "Humid continental; snowy winters", ["food", "culture", "design"], ["Old Montreal", "Mount Royal", "Mile End"], 155, "3–5 days"],
  ["cartagena", "Cartagena", "Colombia", "South America · Caribbean coast", "COP", "Tropical; hot and humid", ["beaches", "history", "food"], ["Walled City", "Getsemaní", "Rosario Islands"], 75, "3–5 days"],
  ["quito", "Quito", "Ecuador", "South America · Andes", "USD", "Equatorial highland", ["history", "hiking", "food"], ["Old Town", "Teleférico", "Mitad del Mundo"], 65, "3–4 days"],
  ["uyuni", "Uyuni", "Bolivia", "South America · Altiplano", "BOB", "High-altitude desert", ["nature", "adventure", "photography"], ["Salt Flats", "Train Cemetery", "Lagunas"], 55, "2–4 days"],
  ["panama-city", "Panama City", "Panama", "Central America · Pacific coast", "USD", "Tropical; wet and dry", ["canal", "food", "nature"], ["Casco Viejo", "Panama Canal", "Amador"], 90, "3–4 days"],
  ["havana", "Havana", "Cuba", "Caribbean · northwest coast", "CUP", "Tropical savanna", ["music", "history", "architecture"], ["Old Havana", "Malecón", "Vedado"], 65, "3–5 days"],
  ["kingston", "Kingston", "Jamaica", "Caribbean · southeast coast", "JMD", "Tropical; warm", ["music", "food", "nature"], ["Blue Mountains", "Trench Town", "Devon House"], 85, "3–5 days"],
  ["santo-domingo", "Santo Domingo", "Dominican Republic", "Caribbean · Hispaniola", "DOP", "Tropical; coastal", ["history", "beaches", "food"], ["Zona Colonial", "Malecón", "Los Tres Ojos"], 80, "3–5 days"],
  ["casablanca", "Casablanca", "Morocco", "Africa · Atlantic coast", "MAD", "Mediterranean; coastal", ["architecture", "food", "markets"], ["Hassan II Mosque", "Corniche", "Habous"], 75, "2–4 days"],
  ["addis-ababa", "Addis Ababa", "Ethiopia", "Africa · Ethiopian Highlands", "ETB", "Highland; mild", ["coffee", "history", "food"], ["Entoto", "Mercato", "National Museum"], 60, "2–4 days"],
  ["zanzibar", "Zanzibar City", "Tanzania", "Africa · Indian Ocean", "TZS", "Tropical; humid", ["beaches", "history", "diving"], ["Stone Town", "Spice farms", "Nungwi"], 75, "3–5 days"],
  ["mombasa", "Mombasa", "Kenya", "Africa · Swahili coast", "KES", "Tropical; coastal", ["beaches", "history", "food"], ["Old Town", "Fort Jesus", "Nyali"], 70, "3–5 days"],
  ["lagos", "Lagos", "Nigeria", "Africa · Gulf of Guinea", "NGN", "Tropical; humid", ["food", "music", "art"], ["Lekki", "Nike Art Gallery", "Victoria Island"], 80, "2–4 days"],
  ["accra", "Accra", "Ghana", "Africa · Gulf of Guinea", "GHS", "Tropical; coastal", ["food", "history", "beaches"], ["Jamestown", "Osu", "Labadi"], 70, "2–4 days"],
  ["luang-prabang", "Luang Prabang", "Laos", "Southeast Asia · Mekong", "LAK", "Tropical monsoon", ["temples", "nature", "slow travel"], ["Kuang Si Falls", "Old Town", "Mekong"], 55, "2–4 days"],
  ["phuket", "Phuket", "Thailand", "Southeast Asia · Andaman", "THB", "Tropical monsoon", ["beaches", "diving", "food"], ["Old Town", "Island bays", "Big Buddha"], 85, "4–6 days"],
  ["chiang-mai", "Chiang Mai", "Thailand", "Southeast Asia · Northern Thailand", "THB", "Tropical savanna", ["temples", "food", "nature"], ["Old City", "Doi Suthep", "Night Bazaar"], 60, "3–5 days"],
  ["penang", "George Town", "Malaysia", "Southeast Asia · Penang", "MYR", "Tropical; humid", ["food", "heritage", "art"], ["Street art", "Clan Jetties", "Hill"], 65, "3–4 days"],
  ["kuala-lumpur", "Kuala Lumpur", "Malaysia", "Southeast Asia · Klang Valley", "MYR", "Tropical; humid", ["food", "shopping", "architecture"], ["Petronas Towers", "Batu Caves", "Bukit Bintang"], 85, "3–5 days"],
  ["manila", "Manila", "Philippines", "Southeast Asia · Luzon", "PHP", "Tropical; humid", ["food", "history", "islands"], ["Intramuros", "Rizal Park", "Binondo"], 70, "3–5 days"],
  ["cebu", "Cebu City", "Philippines", "Southeast Asia · Visayas", "PHP", "Tropical; coastal", ["diving", "food", "beaches"], ["Kawasan Falls", "Magellan's Cross", "Moalboal"], 75, "3–5 days"],
  ["taipei", "Taipei", "Taiwan", "East Asia · northern Taiwan", "TWD", "Humid subtropical", ["food", "hiking", "night markets"], ["Taipei 101", "Beitou", "Shilin"], 105, "3–5 days"],
  ["osaka", "Osaka", "Japan", "East Asia · Kansai", "JPY", "Humid subtropical", ["food", "nightlife", "shopping"], ["Dotonbori", "Osaka Castle", "Umeda"], 130, "3–5 days"],
  ["nagoya", "Nagoya", "Japan", "East Asia · Chubu", "JPY", "Humid subtropical", ["industry", "food", "history"], ["Atsuta Shrine", "Toyota Museum", "Nagoya Castle"], 120, "2–4 days"],
  ["fukuoka", "Fukuoka", "Japan", "East Asia · Kyushu", "JPY", "Humid subtropical", ["food", "beaches", "culture"], ["Hakata", "Canal City", "Dazaifu"], 115, "2–4 days"],
  ["sapporo", "Sapporo", "Japan", "East Asia · Hokkaido", "JPY", "Humid continental; snowy", ["skiing", "food", "nature"], ["Odori Park", "Beer Museum", "Otaru"], 125, "3–5 days"],
  ["melaka", "Melaka", "Malaysia", "Southeast Asia · Malacca Strait", "MYR", "Tropical; humid", ["heritage", "food", "river walks"], ["Jonker Street", "A Famosa", "Riverside"], 60, "2–3 days"],
  ["phnom-penh", "Phnom Penh", "Cambodia", "Southeast Asia · Mekong", "USD", "Tropical monsoon", ["history", "food", "riverside"], ["Royal Palace", "Wat Phnom", "Mekong"], 55, "2–4 days"],
  ["siem-reap", "Siem Reap", "Cambodia", "Southeast Asia · Angkor", "USD", "Tropical monsoon", ["temples", "culture", "food"], ["Angkor Wat", "Old Market", "Tonlé Sap"], 60, "3–5 days"],
  ["yangon", "Yangon", "Myanmar", "Southeast Asia · Yangon River", "MMK", "Tropical monsoon", ["temples", "food", "history"], ["Shwedagon", "Colonial quarter", "Bogyoke Market"], 55, "2–4 days"],
];

const USD_TO_INR_REFERENCE = 83;
const cityFields = cities.map(([id, name, country, region, currency, climate, bestFor, highlights, dailyBudget, idealDays]) => ({ id, name, country, region, currency, climate, bestFor, highlights, avgDailyBudget: Math.round(dailyBudget * USD_TO_INR_REFERENCE), dailyBudget: Math.round(dailyBudget * USD_TO_INR_REFERENCE), idealDays, blurb: `${bestFor.slice(0, 2).join(", ")} and local discoveries.` }));

const kindBlueprints: Array<{ type: TravelKind; label: string; price: (city: CitySeed) => number; tags: string[]; duration: string }> = [
  { type: "hotel", label: "local stay", price: city => Math.round(city.dailyBudget * 1.55), tags: ["walkable", "local", "comfortable"], duration: "per night" },
  { type: "park", label: "city park and nature route", price: city => Math.round(city.dailyBudget * .12), tags: ["nature", "outdoors", "slow travel"], duration: "2–3 hours" },
  { type: "tourist_spot", label: "signature landmark visit", price: city => Math.round(city.dailyBudget * .28), tags: ["iconic", "culture", "photo stop"], duration: "2 hours" },
  { type: "activity", label: "guided local experience", price: city => Math.round(city.dailyBudget * .42), tags: ["local", "guided", "experience"], duration: "half day" },
  { type: "offer", label: "seasonal city pass offer", price: city => Math.round(city.dailyBudget * .2), tags: ["offer", "flexible", "value"], duration: "valid 30 days" },
  { type: "flight", label: "arrival connection", price: city => Math.round(city.dailyBudget * 1.15), tags: ["transport", "arrival", "verified reference"], duration: "2–6 hours" },
];

export const destinations = cityFields;
export const options: TravelOption[] = cityFields.flatMap(city => kindBlueprints.map((blueprint, index) => ({
  id: `${city.id}-${blueprint.type}-1`,
  destinationId: city.id,
  type: blueprint.type,
  name: `${city.name} · ${blueprint.label}`,
  vendor: `${city.name} local collection`,
  detail: `${blueprint.duration} · curated from ${city.highlights[0]}`,
  price: blueprint.price(city),
  duration: blueprint.duration,
  tags: Array.from(new Set([...blueprint.tags, ...city.bestFor.slice(0, 1)])),
  rating: Number((4.1 + ((city.name.length + index) % 9) / 10).toFixed(1)),
  cancellation: blueprint.type === "offer" ? "Terms vary; review before use" : "Reference listing; confirm availability",
  accessibility: ["Check venue details before booking", "Ask provider about assistance"],
  source: `https://en.wikipedia.org/wiki/${encodeURIComponent(city.name.replace(/ /g, "_"))}`,
  sourceLabel: `${city.name} reference`,
})));

export const catalog = { destinations, options };

export type CatalogFilter = { destinationId?: string; type?: TravelKind; maxPrice?: number; minRating?: number; tag?: string; query?: string };
export function filterCatalog(filter: CatalogFilter = {}) {
  const query = filter.query?.trim().toLowerCase();
  return options.filter(item =>
    (!filter.destinationId || item.destinationId === filter.destinationId) &&
    (!filter.type || item.type === filter.type) &&
    (filter.maxPrice === undefined || item.price <= filter.maxPrice) &&
    (filter.minRating === undefined || item.rating >= filter.minRating) &&
    (!filter.tag || item.tags.some(tag => tag.toLowerCase().includes(filter.tag!.toLowerCase()))) &&
    (!query || `${item.name} ${item.vendor} ${item.detail} ${item.tags.join(" ")}`.toLowerCase().includes(query))
  );
}

export function findDestination(destinationId: string) {
  return destinations.find(destination => destination.id === destinationId);
}

export function cityForOption(item: TravelOption) {
  return findDestination(item.destinationId);
}

export function detailsUrl(item: TravelOption | (typeof destinations)[number]) {
  return item && "destinationId" in item ? item.source : `https://en.wikipedia.org/wiki/${encodeURIComponent(item.name.replace(/ /g, "_"))}`;
}
