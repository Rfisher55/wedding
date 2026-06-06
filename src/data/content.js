// ============================================================
//  WEDDING SITE CONTENT
//  Edit everything here in one place. Anything marked TODO is a
//  blank for you to fill in. Components read from these exports —
//  don't rename the keys, just change the values.
// ============================================================

// ---- The couple ----
export const couple = {
  partnerOne: "Robert Fisher",
  partnerTwo: "Madison Muschik",
  // Shown on the hero crest
  monogramInitials: "R & M",
  hashtag: "#TODO",                // optional, used in footer
  contactEmail: "TODO@example.com" // for guest questions
};

// ---- Hero (opening screen) ----
export const hero = {
  // Big date line under the names
  dateLine: "Sunday, November 7, 2027",
  location: "Charleston, South Carolina",
  heroImage: "public/images/hero.jpg",   // drop your photo here in /public/images/
  scrollCue: "Scroll to begin"
};

// ---- Our Story timeline ----
// Add/remove milestones freely. Each gets a scroll-reveal block.
export const story = {
  heading: "Our Story",
  intro: "TODO: a sentence or two setting up your story.",
  milestones: [
    { year: "TODO", title: "How we met", text: "TODO", image: "public/images/story/met.jpg" },
    { year: "TODO", title: "The proposal", text: "TODO", image: "public/images/story/proposal.jpg" },
    { year: "2027", title: "The wedding", text: "We can't wait to celebrate with you in Charleston.", image: "public/images/story/today.jpg" }
  ]
};

// ---- Event details ----
export const event = {
  heading: "The Details",
  date: "Sunday, November 7, 2027",
  venueName: "The William Aiken House",
  address: "456 King Street, Charleston, SC 29403",
  // Used for the embedded map
  mapCoords: { lat: 32.789252, lng: -79.938345 },
  ceremonyTime: "TODO: e.g. 4:00 PM",
  receptionTime: "TODO: e.g. 5:30 PM",
  dressCode: "TODO: e.g. Black tie optional / Garden formal",
  note: "Ceremony under the garden pergola, with cocktails on the piazzas to follow." // edit freely
};

// ---- Schedule / timeline of the day ----
export const schedule = [
  { time: "TODO", label: "Ceremony" },
  { time: "TODO", label: "Cocktail hour" },
  { time: "TODO", label: "Reception & dinner" },
  { time: "TODO", label: "Dancing" },
  { time: "TODO", label: "Farewell" }
];

// ---- Travel & lodging ----
// The venue is on Upper King St with no on-site parking; there's
// metered street parking and the Visitor's Center Parking Garage nearby.
export const travel = {
  heading: "Travel & Stay",
  airport: "Charleston International Airport (CHS), ~20–30 min from downtown",
  parking: "No on-site parking. Metered street parking and the Charleston Visitor Center Garage are nearby. A guest shuttle is recommended.",
  // TODO: confirm hotels + add your room-block link/code if you set one up.
  hotels: [
    { name: "TODO: Hotel name", distance: "TODO", link: "https://", note: "TODO: room block code?" },
    { name: "TODO: Hotel name", distance: "TODO", link: "https://", note: "" }
  ]
};

// ---- Registry (external links — opens in new tab) ----
export const registry = {
  heading: "Registry",
  intro: "Your presence is the greatest gift. For those who've asked, we've registered here:",
  links: [
    { name: "TODO: e.g. Amazon", url: "https://", label: "View Registry" },
    { name: "TODO: e.g. Zola",   url: "https://", label: "View Registry" }
  ]
};

// ---- Gallery ----
// Just drop images in /public/images/gallery/ and list them here.
export const gallery = {
  heading: "Moments",
  images: [
    "public/images/gallery/01.jpg",
    "public/images/gallery/02.jpg",
    "public/images/gallery/03.jpg"
    // TODO: add the rest
  ],
  // Index(es) of photos that get the playful rotate-on-scroll treatment
  featured: [0]
};

// ---- RSVP ----
export const rsvp = {
  heading: "RSVP",
  intro: "Kindly respond by TODO: date.",
  mealOptions: ["TODO: Entrée 1", "TODO: Entrée 2", "Vegetarian"],
  successMessage: "Thank you — we can't wait to celebrate with you!"
};

// ---- Guestbook ----
export const guestbook = {
  heading: "Leave Us a Note",
  intro: "Share a memory, a wish, or a bit of advice. We'd love to read it.",
  placeholder: "Write your note here…"
};

// ---- Footer ----
export const footer = {
  tagline: "With love and gratitude",
  date: "11 · 07 · 2027",
  location: "Charleston, South Carolina"
};
