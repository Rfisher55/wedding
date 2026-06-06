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
  heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&h=1000&q=85",
  scrollCue: "Scroll to begin"
};

// ---- Our Story timeline ----
// Add/remove milestones freely. Each gets a scroll-reveal block.
export const story = {
  heading: "Our Story",
  intro: "Some things are planned. The best things never are.",
  milestones: [
    {
      year: "2021",
      title: "How We Met",
      text: "Robert spotted Madison at a rooftop gathering in Chicago and spent the better part of an hour working up the nerve to say hello. When he finally did, she already knew his name — and had been waiting. That first conversation lasted until sunrise, and neither of them has stopped talking since.",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&h=900&q=80"
    },
    {
      year: "2024",
      title: "The Proposal",
      text: "On a warm October evening in Charleston — the city that would later host their wedding — Robert got down on one knee at the edge of the Battery with the harbor glowing behind him. Madison said yes before he finished the question. They celebrated with champagne, oysters, and a long walk through the gaslit streets of the French Quarter.",
      image: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=700&h=900&q=80"
    },
    {
      year: "2027",
      title: "The Wedding",
      text: "We are overjoyed to celebrate with the people who mean most to us at The William Aiken House — one of Charleston's most storied landmarks. November 7th has been circled on the calendar for a long time. We cannot wait.",
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&h=900&q=80"
    }
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
  dressCode: "Black attire required. Guests are kindly asked to wear a black dress or black suit. All other colors will not be permitted.",
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
export const travel = {
  heading: "Travel & Stay",
  airport: "Charleston International Airport (CHS), ~20–30 min from downtown",
  parking: "No on-site parking at the venue. Uber and Lyft are the easiest options — drop-off is right on King Street. Metered street parking and the Charleston Visitor Center Garage are also nearby if you prefer to drive.",
  hotels: [
    { name: "Hotel Bennett",           distance: "0.2 mi · 5 min walk",  link: "https://www.hotelbennett.com",          note: "" },
    { name: "Francis Marion Hotel",    distance: "0.4 mi · 8 min walk",  link: "https://www.francismarionhotel.com",    note: "" },
    { name: "The Restoration Hotel",   distance: "0.7 mi",               link: "https://www.therestorationhotel.com",   note: "" },
    { name: "The Dewberry Charleston", distance: "0.8 mi",               link: "https://www.thedewberry.com",           note: "" }
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
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&h=1100&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&h=1100&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&h=1100&q=80",
    "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=800&h=1100&q=80",
    "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&fit=crop&w=800&h=1100&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&h=1100&q=80",
    "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=800&h=1100&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&h=1100&q=80",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&h=1100&q=80"
  ],
  // B&W arches (0) and B&W embrace (4) get the playful rotate-on-scroll treatment
  featured: [0, 4]
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
