/* ============================================================
   src/data.js  —  ALL editable content lives here.
   Replace every TODO with real text; swap image paths in
   public/images/ to match. Do not touch component files.
   ============================================================ */

window.WEDDING = {

  /* ── Couple ─────────────────────────────────────────────── */
  names: {
    partner1: 'Robert Fisher',
    partner2: 'Madison Muschik',
    monogram: 'R & M',
    short1: 'Robert',
    short2: 'Madison',
  },

  /* ── Date & Venue ────────────────────────────────────────── */
  date: {
    display:    'Sunday, November 7, 2027',
    formal:     'Sunday, the Seventh of November, Two Thousand Twenty-Seven',
    short:      'November 7, 2027',
    rsvpBy:     'TODO: e.g. October 1, 2027',
  },
  venue: {
    name:    'The William Aiken House',
    address: '456 King Street',
    city:    'Charleston, SC 29403',
    full:    '456 King Street, Charleston, SC 29403',
    lat:     32.789252,
    lng:     -79.938345,
    note:    'An 1810 National Historic Landmark on Upper King Street — ballrooms, open-air piazzas, a garden pergola, and a magnolia courtyard.',
  },

  /* ── Hero ────────────────────────────────────────────────── */
  hero: {
    tagline: 'Together with their families',
    heroImg: 'public/images/hero.jpg',
  },

  /* ── Our Story timeline ──────────────────────────────────── */
  story: [
    {
      year:    'TODO',
      heading: 'How We Met',
      body:    'TODO: Share the story of how you two first crossed paths.',
      img:     'public/images/story/01.jpg',
      alt:     'Robert and Madison — how we met',
    },
    {
      year:    'TODO',
      heading: 'The First Adventure',
      body:    'TODO: A trip, a moment, or a milestone that brought you closer.',
      img:     'public/images/story/02.jpg',
      alt:     'Robert and Madison — first adventure',
    },
    {
      year:    'TODO',
      heading: 'He Proposed',
      body:    'TODO: Tell the engagement story.',
      img:     'public/images/story/03.jpg',
      alt:     'The proposal',
    },
    {
      year:    '2027',
      heading: 'Forever Begins',
      body:    'And now we invite you to celebrate with us in Charleston.',
      img:     'public/images/story/04.jpg',
      alt:     'Robert and Madison — Charleston',
    },
  ],

  /* ── Schedule (day-of) ───────────────────────────────────── */
  schedule: [
    { time: 'TODO pm', label: 'Guest Arrival',       note: 'The William Aiken House' },
    { time: 'TODO pm', label: 'Ceremony',             note: 'Garden Pergola / Piazza' },
    { time: 'TODO pm', label: 'Cocktail Hour',        note: 'Magnolia Courtyard' },
    { time: 'TODO pm', label: 'Dinner & Reception',   note: 'Grand Ballroom' },
    { time: 'TODO pm', label: 'Dancing & Celebration', note: '' },
  ],

  /* ── Event detail cards ──────────────────────────────────── */
  events: {
    ceremony: {
      time:     'TODO pm',
      dressCode: 'TODO: Black Tie / Black Tie Optional / Cocktail',
      note:     'Ceremony will take place in the garden pergola. Please arrive 15 minutes early.',
    },
    reception: {
      time: 'TODO pm',
      note: 'Dinner and dancing in the Grand Ballroom through the evening.',
    },
  },

  /* ── Travel & Lodging ────────────────────────────────────── */
  travel: {
    airport: {
      name:     'Charleston International Airport (CHS)',
      distance: 'Approximately 12 miles from the venue',
    },
    parking: {
      note: 'The William Aiken House has no on-site parking. Metered street parking is available on King Street and surrounding blocks. The Charleston Visitor Center Garage (375 Meeting St) is a convenient option — a short rideshare away. We recommend Uber or Lyft for the evening.',
    },
    hotels: [
      {
        name:     'TODO Hotel Name',
        distance: 'X-minute walk to venue',
        link:     '#',
        note:     'TODO: Brief description or block rate info.',
      },
      {
        name:     'TODO Hotel Name',
        distance: 'X-minute walk to venue',
        link:     '#',
        note:     'TODO: Brief description or block rate info.',
      },
      {
        name:     'TODO Hotel Name',
        distance: 'X-minute rideshare to venue',
        link:     '#',
        note:     'TODO: Brief description or block rate info.',
      },
    ],
  },

  /* ── Gallery ─────────────────────────────────────────────── */
  gallery: [
    { src: 'public/images/gallery/01.jpg', alt: 'Robert & Madison', featured: true  },
    { src: 'public/images/gallery/02.jpg', alt: 'Robert & Madison', featured: false },
    { src: 'public/images/gallery/03.jpg', alt: 'Robert & Madison', featured: false },
    { src: 'public/images/gallery/04.jpg', alt: 'Robert & Madison', featured: false },
    { src: 'public/images/gallery/05.jpg', alt: 'Robert & Madison', featured: true  },
    { src: 'public/images/gallery/06.jpg', alt: 'Robert & Madison', featured: false },
    { src: 'public/images/gallery/07.jpg', alt: 'Robert & Madison', featured: false },
    { src: 'public/images/gallery/08.jpg', alt: 'Robert & Madison', featured: false },
    { src: 'public/images/gallery/09.jpg', alt: 'Robert & Madison', featured: false },
    { src: 'public/images/gallery/10.jpg', alt: 'Robert & Madison', featured: false },
    { src: 'public/images/gallery/11.jpg', alt: 'Robert & Madison', featured: false },
    { src: 'public/images/gallery/12.jpg', alt: 'Robert & Madison', featured: false },
  ],

  /* ── Registry ────────────────────────────────────────────── */
  registry: [
    {
      name:  'Zola',
      label: 'Home & Experiences',
      url:   'https://www.zola.com',
      logo:  'Zola',
    },
    {
      name:  'Amazon',
      label: 'Kitchen & Beyond',
      url:   'https://www.amazon.com/wedding',
      logo:  'Amazon',
    },
    // Add more registries here
  ],

  /* ── RSVP ────────────────────────────────────────────────── */
  rsvp: {
    deadline: 'TODO: October 1, 2027',
    mealOptions: [
      'Chicken',
      'Fish',
      'Vegetarian',
      // Add real meal options once confirmed
    ],
  },

  /* ── Guestbook / Contact ─────────────────────────────────── */
  contact: {
    email:   'TODO@email.com',
    hashtag: 'TODO: #FisherMuschik2027',
  },

  /* ── Google Sheets endpoint ──────────────────────────────── */
  sheetsEndpoint: 'PASTE_WEB_APP_URL_HERE',
};
