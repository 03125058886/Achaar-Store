/* =========================================================
   STORE SETTINGS — yahan apni details badlein
   (Baad mein ye sab database/API se aa jayega)
   ========================================================= */
const STORE = {
  name: "Achaar Ghar",
  tagline: "Achaar, Chutney, Murabba aur bohat kuch.",
  whatsapp: "923289780399",          // orders isi number par jayenge
  phoneDisplay: "+92 328 9780399",
  email: "orders@achaarghar.pk",
  address: "Pakistan",
  freeDeliveryAbove: 3000,
  deliveryCharge: 250,
  prepaidDiscount: 5,                // % off on prepaid
  instagram: "#",
  facebook: "#",
};

const CATEGORIES = [
  { id: "achaar",  name: "Achaars",          img: "images/p9164642.jpg" },
  { id: "chutney", name: "Chutneys",         img: "images/p9011297.jpg" },
  { id: "murabba", name: "Murabba",          img: "images/p6588431.jpg" },
  { id: "masala",  name: "Masala & Spices",  img: "images/p32281630.jpg" },
  { id: "combo",   name: "Combos",           img: "images/p7586251.jpg" },
];

/* tags: best = Bestsellers of the week, popular = top strip, top = Top selling Achaars
   stock: false = "Out of Stock"
   img / img2: apni photos ka path (hover par img2 dikhti hai) */
const I = id => `images/p${id}.jpg`;
const PRODUCTS = [
  { id: 1,  cat: "achaar",  name: "Mango Pickle | Aam ka Achaar", img: I(9164642), img2: I(11584813), rating: 4.9, reviews: 312, tags: ["best","popular","top"], stock: true,
    desc: "Kachay aam, kachi ghani sarson ka tail aur khandani masalay. Dhoop mein pakaya hua asli desi achaar.",
    sizes: [{ w: "500g", price: 650, old: 1100 }, { w: "1kg", price: 1200, old: 2000 }] },
  { id: 2,  cat: "achaar",  name: "Mix Achaar | Aam, Gajar, Mirch, Lehsan", img: I(13707355), img2: I(38857376), rating: 4.8, reviews: 241, tags: ["best","top"], stock: true,
    desc: "Aam, gajar, hari mirch, lehsan aur nimbu, sab ek hi jar mein. Har nivalay mein naya swaad.",
    sizes: [{ w: "500g", price: 700, old: 1100 }, { w: "1kg", price: 1300, old: 2000 }] },
  { id: 3,  cat: "achaar",  name: "Garlic Pickle | Lehsan ka Achaar", img: I(33984956), img2: I(14363801), rating: 4.9, reviews: 188, tags: ["top","popular","best"], stock: true,
    desc: "Saboot lehsan ke turiyan, tez masala aur sarson ka tail. Garam roti ke saath lajawab.",
    sizes: [{ w: "500g", price: 850, old: 1050 }, { w: "1kg", price: 1600, old: 1990 }] },
  { id: 4,  cat: "achaar",  name: "Hari Mirch ka Achaar without Oil", img: I(3646), img2: I(13724203), rating: 4.7, reviews: 97, tags: ["top"], stock: true,
    desc: "Bina tail ke hari mirch ka achaar, nimbu aur rai ke saath. Halka, teekha aur sehat mand.",
    sizes: [{ w: "500g", price: 600, old: 1100 }, { w: "1kg", price: 1100, old: 2000 }] },
  { id: 5,  cat: "achaar",  name: "Red Chilli Pickle | Bharwan Lal Mirch", img: I(38521741), img2: I(5410417), rating: 4.9, reviews: 154, tags: ["best","top"], stock: true,
    desc: "Mooti lal mirchon mein bhara hua saunf, rai aur amchur ka masala. Multani tareeqa.",
    sizes: [{ w: "500g", price: 900, old: 1100 }, { w: "1kg", price: 1700, old: 2000 }] },
  { id: 6,  cat: "achaar",  name: "Khatta Meetha Nimboo ka Achaar", img: I(7812134), img2: I(30666808), rating: 4.8, reviews: 120, tags: ["top"], stock: true,
    desc: "Gur aur masalon mein gala hua nimbu. Hazme ke liye behtareen, bachon ki pasand.",
    sizes: [{ w: "500g", price: 600, old: 1100 }, { w: "1kg", price: 1100, old: 2000 }] },
  { id: 7,  cat: "achaar",  name: "Gajar Shaljam ka Achaar (Punjabi)", img: I(5855239), img2: I(20085554), rating: 4.7, reviews: 76, tags: ["best"], stock: true,
    desc: "Sardiyon ka khaas Punjabi achaar, gur aur sirkay wala. Mausami, limited batch.",
    sizes: [{ w: "500g", price: 550, old: 650 }, { w: "1kg", price: 1000, old: 1200 }] },
  { id: 8,  cat: "achaar",  name: "Karela ka Achaar", img: I(5855875), img2: I(14363801), rating: 4.6, reviews: 41, tags: [], stock: true,
    desc: "Karelay ka chatpata achaar, kadwahat nahi sirf masala.",
    sizes: [{ w: "500g", price: 700, old: 0 }, { w: "1kg", price: 1300, old: 0 }] },
  { id: 9,  cat: "achaar",  name: "Adrak ka Achaar | Ginger Pickle", img: I(10660384), img2: I(8978861), rating: 4.6, reviews: 38, tags: [], stock: true,
    desc: "Taaza adrak ke lachhay, nimbu ke ras aur kaala namak.",
    sizes: [{ w: "500g", price: 750, old: 850 }] },
  { id: 10, cat: "achaar",  name: "Chicken Achaar (Boneless)", img: I(13724203), img2: I(38521741), rating: 4.8, reviews: 63, tags: ["popular","best"], stock: true,
    desc: "Boneless chicken desi masalon aur sarson ke tail mein pakaya hua. Safar ka sathi.",
    sizes: [{ w: "500g", price: 1600, old: 1800 }] },
  { id: 11, cat: "achaar",  name: "Fish Achaar (Boneless)", img: I(17424800), img2: I(5410417), rating: 4.7, reviews: 29, tags: [], stock: false,
    desc: "Boneless machli ka achaar, Karachi style.",
    sizes: [{ w: "500g", price: 1800, old: 2000 }] },

  { id: 12, cat: "chutney", name: "Imli Aloo Bukhara Chutney", img: I(16073913), img2: I(16073917), rating: 4.9, reviews: 205, tags: ["popular","best"], stock: true,
    desc: "Khatti meethi imli aur aloo bukhara. Samosay, pakoray aur chaat ki jaan.",
    sizes: [{ w: "400g", price: 450, old: 550 }, { w: "800g", price: 850, old: 1000 }] },
  { id: 13, cat: "chutney", name: "Garlic Chutney | Lehsan ki Chutney", img: I(27434928), img2: I(17424800), rating: 4.8, reviews: 110, tags: ["top"], stock: true,
    desc: "Tez lehsan aur lal mirch ki chutney. Paratha, roll aur BBQ ke saath zabardast.",
    sizes: [{ w: "250g", price: 400, old: 500 }] },
  { id: 14, cat: "chutney", name: "Aam ki Meethi Chutney", img: I(9011297), img2: I(16073917), rating: 4.7, reviews: 58, tags: [], stock: true,
    desc: "Kachay aam, cheeni aur kalonji. Halki meethi, halki khatti.",
    sizes: [{ w: "400g", price: 500, old: 0 }] },

  { id: 15, cat: "murabba", name: "Aam ka Murabba", img: I(6588431), img2: I(30666808), rating: 4.8, reviews: 72, tags: ["best"], stock: true,
    desc: "Meethay aam ke tukray, khalis sheeray mein.",
    sizes: [{ w: "500g", price: 700, old: 800 }, { w: "1kg", price: 1300, old: 1500 }] },
  { id: 16, cat: "murabba", name: "Gajar ka Murabba", img: I(10660384), img2: I(7586251), rating: 4.8, reviews: 66, tags: [], stock: true,
    desc: "Taaqat bhara gajar murabba, sardiyon ka tohfa.",
    sizes: [{ w: "500g", price: 650, old: 0 }, { w: "1kg", price: 1200, old: 0 }] },
  { id: 17, cat: "murabba", name: "Amla ka Murabba | Healthy", img: I(30666808), img2: I(6588431), rating: 4.9, reviews: 91, tags: ["popular"], stock: true,
    desc: "Vitamin C se bhara amla murabba, subah nehar munh ke liye.",
    sizes: [{ w: "500g", price: 750, old: 900 }, { w: "1kg", price: 1400, old: 1700 }] },
  { id: 18, cat: "murabba", name: "Saib ka Murabba", img: I(7586251), img2: I(10660384), rating: 4.6, reviews: 22, tags: [], stock: false,
    desc: "Pahari saib ka naram murabba.",
    sizes: [{ w: "500g", price: 700, old: 0 }] },

  { id: 19, cat: "masala",  name: "Achaar Masala | Ghar ka Achaar Banayein", img: I(36870366), img2: I(32281706), rating: 4.7, reviews: 48, tags: [], stock: true,
    desc: "Hamara khandani achaar masala. Ghar mein achaar daalein, wohi swaad.",
    sizes: [{ w: "200g", price: 350, old: 400 }] },
  { id: 20, cat: "masala",  name: "Chaat Masala", img: I(10966836), img2: I(11911870), rating: 4.7, reviews: 35, tags: [], stock: true,
    desc: "Phal, dahi baray, chaat aur salad ke liye.",
    sizes: [{ w: "200g", price: 300, old: 0 }] },
  { id: 21, cat: "masala",  name: "Chai Masala", img: I(458796), img2: I(32281630), rating: 4.8, reviews: 54, tags: ["popular"], stock: true,
    desc: "Elaichi, saunth, darcheeni aur laung. Ek chutki, aur chai tayyar.",
    sizes: [{ w: "100g", price: 350, old: 450 }] },

  { id: 22, cat: "combo",   name: "The Hall of Fame Box | 4 Bestselling Achaars", img: I(33984956), img2: I(13707355), rating: 4.9, reviews: 87, tags: [], stock: true,
    desc: "Aam, Mix, Lehsan aur Bharwan Lal Mirch achaar (500g x 4).",
    sizes: [{ w: "4 Jars", price: 2800, old: 3200 }] },
  { id: 23, cat: "combo",   name: "Chai Pe Charcha Box | Murabba + Chai Masala", img: I(7586251), img2: I(458796), rating: 4.8, reviews: 40, tags: [], stock: true,
    desc: "Aam murabba, Amla murabba aur Chai masala.",
    sizes: [{ w: "3 Items", price: 1650, old: 1800 }] },
  { id: 24, cat: "combo",   name: "Teekha Lovers Box", img: I(14363801), img2: I(3646), rating: 4.8, reviews: 33, tags: [], stock: true,
    desc: "Hari mirch, Bharwan lal mirch achaar aur Lehsan chutney.",
    sizes: [{ w: "3 Jars", price: 1700, old: 1900 }] },
  { id: 25, cat: "combo",   name: "ALL IN ONE | Ultimate 7 Jar Box", img: I(30666808), img2: I(33984956), rating: 4.9, reviews: 52, tags: [], stock: false,
    desc: "7 bestselling achaar, chutney aur murabba ek box mein. Behtareen tohfa.",
    sizes: [{ w: "7 Jars", price: 4500, old: 5600 }] },
];
