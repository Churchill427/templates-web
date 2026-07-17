/* ============================================
   CRUM BAKERY — DATA JS
   Mock data for all pages
   ============================================ */

'use strict';

const CrumData = {

  /* ============================================
     PRODUCTS — Daily Fresh Bakes
     ============================================ */
  dailyBakes: [
    {
      id: 'db-1',
      name: 'Rustic Sourdough Loaf',
      price: 8.50,
      description: 'Traditional 48-hour fermented sourdough with a crispy crust and airy crumb.',
      image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=600&q=80',
      badge: 'Bestseller'
    },
    {
      id: 'db-2',
      name: 'French Butter Croissant',
      price: 4.25,
      description: 'Flaky, buttery layers crafted with imported French butter, baked to golden perfection.',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=600&q=80',
      badge: 'Fresh Daily'
    },
    {
      id: 'db-3',
      name: 'Cinnamon Roll Supreme',
      price: 5.75,
      description: 'Soft, pillowy dough swirled with Ceylon cinnamon and topped with cream cheese glaze.',
      image: 'https://images.unsplash.com/photo-1609126979532-3a8e9e0e2085?w=600&q=80',
      badge: 'Popular'
    },
    {
      id: 'db-4',
      name: 'Seasonal Fruit Danish',
      price: 5.50,
      description: 'Puff pastry nest filled with vanilla custard and fresh seasonal fruits.',
      image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&q=80',
      badge: 'Seasonal'
    }
  ],

  /* ============================================
     CAKE CATEGORIES
     ============================================ */
  cakeCategories: [
    {
      id: 'cat-1',
      name: 'Birthday Cakes',
      description: 'Custom creations to make birthdays unforgettable.',
      image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&q=80'
    },
    {
      id: 'cat-2',
      name: 'Wedding Cakes',
      description: 'Elegant tiered cakes for your perfect day.',
      image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80'
    },
    {
      id: 'cat-3',
      name: 'Anniversary',
      description: 'Celebrate milestones with something sweet.',
      image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80'
    },
    {
      id: 'cat-4',
      name: 'Celebrations',
      description: 'Party-ready cakes for every occasion.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80'
    },
    {
      id: 'cat-5',
      name: 'Corporate',
      description: 'Professional branded cakes for business events.',
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&q=80'
    },
    {
      id: 'cat-6',
      name: 'Festive',
      description: 'Holiday specials with seasonal flavors.',
      image: 'https://images.unsplash.com/photo-1607478900766-efe13248b125?w=600&q=80'
    }
  ],

  /* ============================================
     SIGNATURE CAKES
     ============================================ */
  signatureCakes: [
    {
      id: 'sig-1',
      name: 'Midnight Velvet',
      price: 65.00,
      description: 'Dark chocolate ganache layers with blackberry compote and edible gold leaf.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
      flavors: ['Dark Chocolate', 'Blackberry', 'Vanilla']
    },
    {
      id: 'sig-2',
      name: 'Rose Garden',
      price: 72.00,
      description: 'Delicate rosewater sponge with Persian pistachio cream and crystallized petals.',
      image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80',
      flavors: ['Rosewater', 'Pistachio', 'White Chocolate']
    },
    {
      id: 'sig-3',
      name: 'Tropical Sunrise',
      price: 58.00,
      description: 'Mango mousse layers with passion fruit curd and toasted coconut flakes.',
      image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80',
      flavors: ['Mango', 'Passion Fruit', 'Coconut']
    },
    {
      id: 'sig-4',
      name: 'Caramel Royale',
      price: 68.00,
      description: 'Salted caramel drizzle over hazelnut praline layers with Belgian chocolate.',
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&q=80',
      flavors: ['Caramel', 'Hazelnut', 'Belgian Chocolate']
    }
  ],

  /* ============================================
     TEAM MEMBERS
     ============================================ */
  team: [
    {
      id: 'team-1',
      name: 'Marie Laurent',
      role: 'Head Pastry Chef',
      bio: 'Trained at Le Cordon Bleu, Marie brings 15 years of artisan baking expertise.',
      image: 'assets/images/team-marie.jpg'
    },
    {
      id: 'team-2',
      name: 'James Chen',
      role: 'Cake Designer',
      bio: 'Award-winning sugar artist specializing in sculptural and 3D cake designs.',
      image: 'assets/images/team-james.jpg'
    },
    {
      id: 'team-3',
      name: 'Stefano Rossi',
      role: 'Bread Artisan',
      bio: 'Sourdough specialist who sources heritage grains from local organic farms.',
      image: 'assets/images/team-sofia.jpg'
    },
    {
      id: 'team-4',
      name: 'David Chen',
      role: 'Operations Manager',
      bio: 'Keeps the ovens running and the team inspired with a passion for quality.',
      image: 'assets/images/team-david.jpg'
    }
  ],

  /* ============================================
     TESTIMONIALS
     ============================================ */
  testimonials: [
    {
      id: 'test-1',
      name: 'Emma & Liam',
      role: 'Wedding Couple',
      quote: 'CRUM created the most stunning five-tier cake for our wedding. Every guest asked about it. Truly a masterpiece!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200&q=80',
      cakeImage: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&q=80'
    },
    {
      id: 'test-2',
      name: 'Sarah Mitchell',
      role: 'Regular Customer',
      quote: 'The sourdough here has ruined me for all other bread. I\'m here every Saturday morning without fail.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      cakeImage: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&q=80'
    },
    {
      id: 'test-3',
      name: 'Michael Torres',
      role: 'Corporate Client',
      quote: 'We order from CRUM for every company event. Professional, reliable, and the quality is unmatched.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      cakeImage: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&q=80'
    },
    {
      id: 'test-4',
      name: 'Aisha Patel',
      role: 'Birthday Client',
      quote: 'My daughter\'s unicorn cake was absolute perfection. The attention to detail is incredible.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      cakeImage: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&q=80'
    }
  ],

  /* ============================================
     BLOG POSTS
     ============================================ */
  blogPosts: [
    {
      id: 'blog-1',
      title: 'The Secret to Perfect Sourdough Starter',
      category: 'Recipes',
      date: '2025-01-15',
      excerpt: 'Learn the time-honored techniques for creating and maintaining a vibrant sourdough starter that will transform your home baking.',
      image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&q=80',
      readTime: '8 min',
      featured: true
    },
    {
      id: 'blog-2',
      title: '5 Cake Decorating Trends for 2025',
      category: 'Trends',
      date: '2025-01-08',
      excerpt: 'From hand-painted fondant to edible flowers, discover the decoration styles that are taking the cake world by storm.',
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80',
      readTime: '5 min'
    },
    {
      id: 'blog-3',
      title: 'How to Choose the Perfect Wedding Cake',
      category: 'Guide',
      date: '2024-12-20',
      excerpt: 'A comprehensive guide to selecting flavors, tiers, and designs that complement your special day.',
      image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=600&q=80',
      readTime: '10 min'
    },
    {
      id: 'blog-4',
      title: 'Behind the Scenes: A Day at CRUM',
      category: 'Behind the Scenes',
      date: '2024-12-15',
      excerpt: 'Take a peek behind the counter and see what it takes to produce 200+ items before sunrise.',
      image: 'assets/images/bts-chocolate-drip.jpg',
      readTime: '6 min'
    }
  ],

  /* ============================================
     RECIPES
     ============================================ */
  recipes: [
    {
      id: 'recipe-1',
      title: 'Classic Chocolate Lava Cake',
      difficulty: 'Intermediate',
      time: '45 min',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
      ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour']
    },
    {
      id: 'recipe-2',
      title: 'No-Knead Artisan Bread',
      difficulty: 'Beginner',
      time: '24 hrs',
      rating: 4.9,
      image: 'assets/images/recipe-artisan-bread.jpg',
      ingredients: ['Flour', 'Water', 'Salt', 'Yeast']
    },
    {
      id: 'recipe-3',
      title: 'French Macarons',
      difficulty: 'Advanced',
      time: '3 hrs',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&q=80',
      ingredients: ['Almond Flour', 'Egg Whites', 'Sugar', 'Cream']
    },
    {
      id: 'recipe-4',
      title: 'Blueberry Scones',
      difficulty: 'Beginner',
      time: '35 min',
      rating: 4.7,
      image: 'assets/images/recipe-blueberry-scones.jpg',
      ingredients: ['Flour', 'Butter', 'Cream', 'Blueberries', 'Sugar']
    }
  ],

  /* ============================================
     BAKING TIPS
     ============================================ */
  bakingTips: [
    {
      id: 'tip-1',
      title: 'Room Temperature Ingredients',
      description: 'Always bring butter, eggs, and dairy to room temperature before mixing for smoother batters.'
    },
    {
      id: 'tip-2',
      title: 'Measure by Weight',
      description: 'Use a kitchen scale for precise measurements. Baking is chemistry — accuracy matters.'
    },
    {
      id: 'tip-3',
      title: 'Don\'t Overmix',
      description: 'Mix until just combined. Overworking gluten makes cakes tough and breads dense.'
    },
    {
      id: 'tip-4',
      title: 'Preheat Your Oven',
      description: 'Always preheat for at least 15 minutes. Use an oven thermometer for accuracy.'
    },
    {
      id: 'tip-5',
      title: 'The Toothpick Test',
      description: 'Insert a toothpick in the center — it should come out with moist crumbs, not batter.'
    },
    {
      id: 'tip-6',
      title: 'Cool Before Frosting',
      description: 'Let cakes cool completely before decorating. Warm cakes melt frosting and cause sliding.'
    }
  ],

  /* ============================================
     FAQ
     ============================================ */
  faqs: [
    {
      id: 'faq-1',
      question: 'How far in advance should I order a custom cake?',
      answer: 'We recommend placing custom cake orders at least 2 weeks in advance. For wedding cakes, 4-6 weeks is ideal. Rush orders may be available — please call us to check availability.'
    },
    {
      id: 'faq-2',
      question: 'Do you offer tastings for wedding cakes?',
      answer: 'Yes! We offer complimentary tasting sessions for wedding orders. You can sample up to 6 flavors. Please book your tasting at least 1 week in advance.'
    },
    {
      id: 'faq-3',
      question: 'Can you accommodate dietary restrictions?',
      answer: 'Absolutely! We offer gluten-free, vegan, nut-free, and sugar-free options. Please let us know your requirements when placing your order.'
    },
    {
      id: 'faq-4',
      question: 'What is your cancellation policy?',
      answer: 'Full refund for cancellations made 72+ hours before the order date. 50% refund for 24-72 hours. No refund for cancellations within 24 hours.'
    },
    {
      id: 'faq-5',
      question: 'Do you deliver?',
      answer: 'Yes! We deliver within a 20-mile radius. Delivery fees start at $15 depending on distance. For wedding cakes, delivery and setup are included.'
    },
    {
      id: 'faq-6',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, Apple Pay, Google Pay, and bank transfers. A 50% deposit is required for custom orders.'
    }
  ],

  /* ============================================
     DAILY MENU
     ============================================ */
  dailyMenu: {
    breads: [
      { name: 'Sourdough Boule', price: 8.50, available: true },
      { name: 'Whole Wheat Batard', price: 7.00, available: true },
      { name: 'Olive Focaccia', price: 9.00, available: true },
      { name: 'Rye & Caraway', price: 8.00, available: false }
    ],
    pastries: [
      { name: 'Butter Croissant', price: 4.25, available: true },
      { name: 'Pain au Chocolat', price: 4.75, available: true },
      { name: 'Almond Danish', price: 5.00, available: true },
      { name: 'Apple Turnover', price: 4.50, available: true }
    ],
    savories: [
      { name: 'Spinach & Feta Quiche', price: 6.50, available: true },
      { name: 'Sausage Roll', price: 5.00, available: true },
      { name: 'Ham & Cheese Croissant', price: 5.75, available: false },
      { name: 'Mushroom Vol-au-vent', price: 6.00, available: true }
    ]
  },

  /* ============================================
     PRICING TIERS
     ============================================ */
  pricingTiers: [
    {
      name: 'Simple',
      priceRange: '$35–$60',
      features: [
        'Single tier design',
        'Classic flavors',
        'Buttercream finish',
        'Standard decorations',
        'Serves up to 20'
      ],
      highlighted: false
    },
    {
      name: 'Signature',
      priceRange: '$65–$120',
      features: [
        'Up to 3 tiers',
        'Premium flavors',
        'Fondant or ganache finish',
        'Custom decorations',
        'Serves up to 50',
        'Free delivery'
      ],
      highlighted: true
    },
    {
      name: 'Elite',
      priceRange: '$150+',
      features: [
        'Unlimited tiers',
        'Exotic flavors',
        'Sculpted designs',
        '3D cake art',
        'Serves 50+',
        'Free delivery & setup',
        'Tasting session included'
      ],
      highlighted: false
    }
  ],

  /* ============================================
     PROCESS STEPS
     ============================================ */
  processSteps: [
    {
      step: 1,
      title: 'Select',
      description: 'Browse our collection or describe your dream cake. We\'ll help you find the perfect match.',
      icon: 'ph-magnifying-glass'
    },
    {
      step: 2,
      title: 'Customize',
      description: 'Choose flavors, sizes, decorations, and personal touches to make it uniquely yours.',
      icon: 'ph-palette'
    },
    {
      step: 3,
      title: 'Bake',
      description: 'Our artisans handcraft your creation using premium ingredients and traditional techniques.',
      icon: 'ph-fire'
    },
    {
      step: 4,
      title: 'Deliver',
      description: 'We carefully package and deliver your masterpiece right to your door, ready to celebrate.',
      icon: 'ph-truck'
    }
  ],

  /* ============================================
     STORE INFO
     ============================================ */
  storeInfo: {
    name: 'CRUM Bakery',
    address: '128 Flour Lane, Baker\'s Quarter',
    city: 'Portland, OR 97201',
    phone: '+1 (503) 555-CRUM',
    email: 'hello@crumbakery.com',
    hours: {
      weekdays: '6:00 AM – 7:00 PM',
      saturday: '7:00 AM – 8:00 PM',
      sunday: '8:00 AM – 5:00 PM'
    },
    social: {
      instagram: '#',
      facebook: '#',
      pinterest: '#',
      tiktok: '#'
    }
  }
};

// Export
window.CrumData = CrumData;
