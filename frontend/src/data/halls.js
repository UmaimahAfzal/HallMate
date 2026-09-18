// src/data/halls.js

const locations = [
  "Hyderabad",
  "Nizamabad",
  "Nagpur",
  "Bengaluru",
  "Chennai",
  "Mumbai",
  "Pune",
  "Delhi",
];

const hallNames = [
  "Royal Convention Hall",
  "Pearl Grand Hall",
  "Green Valley Hall",
  "Grand Palace Banquet",
  "Crystal Crown Hall",
  "Golden Leaf Convention",
  "Imperial Celebration Hall",
  "Blue Orchid Banquet",
  "Lakeview Convention Hall",
  "Majestic Grand Hall",
  "Royal Orchid Hall",
  "Sapphire Banquet Hall",
  "The Grand Pavilion",
  "Emerald Celebration Hall",
  "Regal Convention Centre",
];

const eventTypes = [
  ["Wedding", "Engagement", "Party"],
  ["Wedding", "Birthday", "Engagement"],
  ["Corporate", "Exhibition", "Other"],
  ["Wedding", "Corporate", "Party"],
  ["Birthday", "Party", "Engagement"],
  ["Corporate", "Exhibition"],
];


// ============================================================
// VENUE IMAGES
// ============================================================
//
// Each group contains 5 images for ONE hall.
// We keep the images together so HallDetails can display
// only the images assigned to that particular hall.
//
// 1. Main hall / interior
// 2. Seating / tables
// 3. Dining / catering
// 4. Exterior / entrance
// 5. Event setup / decoration
//
// ============================================================

const hallImageSets = [
  [
    "https://images.pexels.com/photos/16120249/pexels-photo-16120249.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/17315423/pexels-photo-17315423.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/17206068/pexels-photo-17206068.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/12688993/pexels-photo-12688993.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/16120243/pexels-photo-16120243.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],

  [
    "https://images.pexels.com/photos/17315446/pexels-photo-17315446.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/17056962/pexels-photo-17056962.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/17056993/pexels-photo-17056993.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/17056990/pexels-photo-17056990.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/16120257/pexels-photo-16120257.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],

  [
    "https://images.pexels.com/photos/17206162/pexels-photo-17206162.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/20499528/pexels-photo-20499528.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/17206102/pexels-photo-17206102.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/27078975/pexels-photo-27078975.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/4717550/pexels-photo-4717550.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],

  [
    "https://images.pexels.com/photos/16985136/pexels-photo-16985136.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/16105890/pexels-photo-16105890.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/36151390/pexels-photo-36151390.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/35042459/pexels-photo-35042459.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/17315406/pexels-photo-17315406.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],

  [
    "https://images.pexels.com/photos/17056964/pexels-photo-17056964.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/16985201/pexels-photo-16985201.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/16985184/pexels-photo-16985184.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/19986462/pexels-photo-19986462.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/3835638/pexels-photo-3835638.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],

  [
    "https://images.pexels.com/photos/7605172/pexels-photo-7605172.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/24781754/pexels-photo-24781754.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/16985131/pexels-photo-16985131.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/12954022/pexels-photo-12954022.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/17206048/pexels-photo-17206048.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],
];


// ============================================================
// DIFFERENT AMENITY COMBINATIONS
// ============================================================

const amenityPatterns = [
  {
    AC: true,
    parking: true,
    catering: true,
    stage: true,
  },

  {
    AC: true,
    parking: true,
    catering: false,
    stage: true,
  },

  {
    AC: true,
    parking: false,
    catering: true,
    stage: false,
  },

  {
    AC: false,
    parking: true,
    catering: false,
    stage: true,
  },

  {
    AC: false,
    parking: false,
    catering: true,
    stage: false,
  },

  {
    AC: true,
    parking: false,
    catering: false,
    stage: true,
  },
];


// ============================================================
// CREATE HALL DATABASE
// ============================================================

const halls = [];

locations.forEach((location, locationIndex) => {
  hallNames.forEach((baseName, hallIndex) => {

    const pattern =
      amenityPatterns[
        (locationIndex + hallIndex) %
        amenityPatterns.length
      ];


    // ========================================================
    // CAPACITY
    // ========================================================

    const capacity =
      250 +
      ((locationIndex * 137 + hallIndex * 83) % 8) * 100;


    // ========================================================
    // PRICE
    // ========================================================

    const price =
      20000 +
      ((locationIndex * 3 + hallIndex) % 10) * 5000;


    // ========================================================
    // RATING
    // ========================================================

    const rating =
      4.1 +
      ((locationIndex + hallIndex) % 9) / 10;


    // ========================================================
    // REVIEWS
    // ========================================================

    const reviews =
      18 +
      ((locationIndex * 31 + hallIndex * 17) % 180);


    // ========================================================
    // HALL-SPECIFIC IMAGE SET
    // ========================================================
    //
    // Each hall receives ONE complete image set.
    //
    // We use the hall's position to select the image set,
    // while keeping all 5 images together.
    //
    // HallDetails will later use:
    //
    // hall.images
    //
    // so the images never get mixed inside one gallery.
    //
    // ========================================================

    const imageSetIndex =
      (locationIndex * hallNames.length + hallIndex) %
      hallImageSets.length;

    const images = hallImageSets[imageSetIndex];


    halls.push({

      // ======================================================
      // BASIC INFORMATION
      // ======================================================

      id: `${location.toLowerCase()}-${hallIndex + 1}`,

      name: baseName,

      location,


      // ======================================================
      // MAIN IMAGE
      // ======================================================

      image: images[0],


      // ======================================================
      // HALL GALLERY
      // ======================================================

      images,


      // ======================================================
      // CAPACITY / PRICE
      // ======================================================

      capacity,

      price,


      // ======================================================
      // RATING
      // ======================================================

      rating: Number(rating.toFixed(1)),

      reviews,


      // ======================================================
      // EVENT TYPES
      // ======================================================

      eventTypes:
        eventTypes[
          (locationIndex + hallIndex) %
          eventTypes.length
        ],


      // ======================================================
      // AMENITIES
      // ======================================================

      amenities: {
        AC: pattern.AC,
        parking: pattern.parking,
        catering: pattern.catering,

        // Kept in the data for now.
        // We are NOT displaying Stage on the Hall Details page.
        stage: pattern.stage,
      },


      // ======================================================
      // AVAILABILITY
      // ======================================================

      available: true,
    });
  });
});

export default halls;