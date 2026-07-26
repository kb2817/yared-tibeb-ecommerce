import { Product, Review, InstagramPost } from '../types';

const imgRoyalKemis = '/images/habesha_royal_kemis_1784988585842.jpg';
const imgMenSuit = '/images/ethiopian_men_suit_1784988598365.jpg';
const imgEnkutatash = '/images/enkutatash_gold_dress_1784988610001.jpg';
const imgTibebBlazer = '/images/tibeb_blazer_modern_1784988621121.jpg';
const imgFamilySet = '/images/family_heritage_set_1784988636375.jpg';
const imgBridalKemis = '/images/lalibela_bridal_kemis_1784988649913.jpg';
const imgGabiShawl = '/images/gondar_gabi_shawl_1784988661479.jpg';
const imgEveningGown = '/images/semien_evening_gown_1784988673878.jpg';
const imgBabySet = '/images/little_heritage_baby_1784988685993.jpg';
const imgHeroHabesha = '/images/ethiopian_habesha_kemis_1784988107480.jpg';
const imgPortraitCraft = '/images/ethiopian_portrait_craft_1784988380745.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'yt-001',
    name: 'Royal Axumite Zuria Kemis',
    description: 'Handwoven 100% fine Shemma cotton dress adorned with intricate gold and deep espresso Tibeb borders. Mastercrafted over 28 days by master weavers in Addis Ababa.',
    category: 'Wedding',
    price: 680,
    originalPrice: 780,
    stock: 8,
    image: imgRoyalKemis,
    additionalImages: [
      imgHeroHabesha,
      imgPortraitCraft
    ],
    materials: 'Pure Handspun Cotton (Shemma), Pure Metallic Gold Threads',
    weavingTimeDays: 28,
    artisanName: 'Ato Worku & Team',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 24,
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-002',
    name: "Emperor's Tibeb Suit & Netela",
    description: "Refined 2-piece traditional suit featuring tailored ivory Shemma linen with hand-embroidered Tilf neck and cuff detailing, complete with a matching royal Netela shawl.",
    category: "Men's",
    price: 520,
    originalPrice: 620,
    stock: 12,
    image: imgMenSuit,
    additionalImages: [
      imgGabiShawl
    ],
    materials: 'Organic Ethiopian Cotton, Silk Embroidery Threads',
    weavingTimeDays: 18,
    artisanName: 'Gashaw Weaving Studio',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 19,
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-003',
    name: 'Enkutatash Gold Heritage Dress',
    description: 'Vibrant celebration dress featuring triple-woven gold geometric motifs along the hem and sleeves. Designed for New Year & Meskel celebrations.',
    category: 'Holiday',
    price: 450,
    originalPrice: 550,
    stock: 15,
    image: imgEnkutatash,
    additionalImages: [
      imgPortraitCraft
    ],
    materials: 'Lightweight Handspun Cotton, Gold Lurex',
    weavingTimeDays: 14,
    artisanName: 'Meskerem Artisans',
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 31,
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-004',
    name: 'Contemporary Tibeb Blazer',
    description: 'Modern tailored blazer infused with traditional Ethiopian handwoven border trim along the lapel and pockets. Seamlessly bridges heritage and high fashion.',
    category: 'Formal',
    price: 390,
    originalPrice: 460,
    stock: 10,
    image: imgTibebBlazer,
    materials: 'Wool Blend, Handwoven Tibeb Cotton Accents',
    weavingTimeDays: 10,
    artisanName: 'Yared Studio',
    isFeatured: false,
    rating: 4.7,
    reviewsCount: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-005',
    name: 'Family Heritage Matching Set',
    description: 'Exquisite matching family ensemble handwoven with coordinated gold Tilf embroidery and gold Tibeb borders for parents and children.',
    category: 'Family',
    price: 620,
    originalPrice: 750,
    stock: 12,
    image: imgFamilySet,
    materials: '100% Unbleached Ethiopian Cotton & Gold Silk Thread',
    weavingTimeDays: 14,
    artisanName: 'Dorze Highland Weavers',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 42,
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-006',
    name: 'Lalibela Bridal Majesty Kemis',
    description: 'Unrivaled luxury wedding ensemble featuring full-skirt multi-layered Shemma with intricate cross-motif gold weaving and matching embroidered veil.',
    category: 'Wedding',
    price: 1250,
    originalPrice: 1500,
    stock: 4,
    image: imgBridalKemis,
    additionalImages: [
      imgHeroHabesha
    ],
    materials: 'Fine Shemma Cotton, Royal Gold Thread, Silk Satin Lining',
    weavingTimeDays: 45,
    artisanName: 'Master Weaver Tadesse',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 11,
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-007',
    name: "Gondar Noble Men's Gabi Shawl Set",
    description: 'Heavyweight double-layer handwoven cotton Gabi shawl with deep espresso and gold geometric Tibeb borders, paired with a matching tunic.',
    category: "Men's",
    price: 340,
    originalPrice: 400,
    stock: 14,
    image: imgGabiShawl,
    materials: 'Thick Handspun Soft Cotton Gabi',
    weavingTimeDays: 12,
    artisanName: 'Chencha Valley Collective',
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 16,
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-008',
    name: 'Semien Evening Silk-Blend Tibeb Gown',
    description: 'Sophisticated evening floor-length dress combining rich deep espresso silk satin with handcrafted gold Tibeb waist panels.',
    category: 'Formal',
    price: 580,
    originalPrice: 700,
    stock: 6,
    image: imgEveningGown,
    materials: 'Silk Satin, Gold Thread Loom Panel',
    weavingTimeDays: 20,
    artisanName: 'Yared Studio',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 22,
    createdAt: new Date().toISOString()
  },
  {
    id: 'yt-009',
    name: 'Little Heritage Baby Habesha Set',
    description: 'Ultra-soft unbleached organic Shemma cotton baby outfit with delicate gold thread embroidery, created for baptisms, first birthdays, and special family gatherings.',
    category: 'Baby',
    price: 180,
    originalPrice: 220,
    stock: 15,
    image: imgBabySet,
    materials: '100% Gentle Handspun Baby Shemma Cotton',
    weavingTimeDays: 6,
    artisanName: 'Dorze Highland Weavers',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 18,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Bethlehem Tassew',
    rating: 5,
    comment: 'The Royal Axumite Zuria Kemis surpassed all my expectations for my sister’s wedding in Washington DC. The weight of the Shemma and the sparkle of the gold Tibeb threads are breathtaking. Truly heirloom quality!',
    productTitle: 'Royal Axumite Zuria Kemis',
    date: '2 weeks ago'
  },
  {
    id: 'rev-2',
    customerName: 'Dr. Yosef Alemu',
    rating: 5,
    comment: 'Ordering from Yared Tibeb was seamless. The Emperor’s Tibeb Suit fit perfectly out of the box. You can feel the decades of artisan craftsmanship in every stitch of the Tilf embroidery.',
    productTitle: "Emperor's Tibeb Suit & Netela",
    date: '1 month ago'
  },
  {
    id: 'rev-3',
    customerName: 'Saba Hailu',
    rating: 5,
    comment: 'YARED TIBEB brings authentic Habesha luxury to the global stage. The Enkutatash dress felt comfortable yet extremely elegant. Highly recommend!',
    productTitle: 'Enkutatash Gold Heritage Dress',
    date: '3 weeks ago'
  }
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    imageUrl: imgRoyalKemis,
    caption: 'Centuries of Ethiopian weaving artistry reimagined for the modern connoisseur. #YaredTibeb #HabeshaFashion #HandmadeLuxury',
    likes: 1420,
    comments: 88
  },
  {
    id: 'ig-2',
    imageUrl: imgPortraitCraft,
    caption: 'Gold thread Tibeb detailing under the morning light in Addis Ababa. 🇪🇹✨ #HighCraftsmanship #EthicalFashion',
    likes: 2150,
    comments: 134
  },
  {
    id: 'ig-3',
    imageUrl: imgMenSuit,
    caption: 'The Emperor’s Suit — classic Ethiopian menswear tailoring for formal celebrations.',
    likes: 980,
    comments: 42
  },
  {
    id: 'ig-4',
    imageUrl: imgEnkutatash,
    caption: 'Enkutatash vibes in warm gold and parchment textures. Celebrate heritage in luxury.',
    likes: 1840,
    comments: 92
  },
  {
    id: 'ig-5',
    imageUrl: imgHeroHabesha,
    caption: 'Master weaver Tadesse inspecting the density of 100% organic Shemma cotton thread.',
    likes: 3100,
    comments: 176
  },
  {
    id: 'ig-6',
    imageUrl: imgBridalKemis,
    caption: 'The Lalibela Bridal Ensemble. 45 days of pure devotion by our master artisans.',
    likes: 4200,
    comments: 215
  },
  {
    id: 'ig-7',
    imageUrl: imgTibebBlazer,
    caption: 'Modern silhouette meets heritage loom weave. The Contemporary Tibeb Blazer.',
    likes: 1120,
    comments: 63
  },
  {
    id: 'ig-8',
    imageUrl: imgFamilySet,
    caption: 'Coordinated family heritage Habesha attire for special occasions.',
    likes: 1540,
    comments: 71
  },
  {
    id: 'ig-9',
    imageUrl: imgEveningGown,
    caption: 'Semien Gold Gown for high-profile galas and evening affairs.',
    likes: 2790,
    comments: 118
  }
];
