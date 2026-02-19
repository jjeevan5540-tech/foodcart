export const cuisines = [
    "All",
    "North Indian",
    "South Indian",
    "Chinese",
    "Italian",
    "Bakery",
    "Burgers",
    "Pizza",
    "Desserts",
    "Street Food"
];

export const restaurants = [
    {
        id: 1,
        name: "The Royal Kitchen",
        rating: 4.5,
        deliveryTime: "30-40 min",
        cuisines: ["North Indian", "Street Food"],
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹500 for two",
        offer: { type: 'percentage', value: 20, label: '20% OFF', minOrder: 300, code: 'ROYAL20' },
        menu: [
            { id: 101, name: "Paneer Butter Masala", price: 280, description: "Creamy paneer in rich tomato gravy", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 102, name: "Dal Makhani", price: 240, description: "Black lentils cooked overnight with cream", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 103, name: "Butter Naan", price: 60, description: "Refined flour bread cooked in tandoor", image: "https://images.unsplash.com/photo-1585937421612-70a0f2455f75?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 104, name: "Chicken Tikka Masala", price: 350, description: "Grilled chicken in spicy gravy", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 105, name: "Shahi Paneer", price: 290, description: "Paneer cubes in rich almond and nut gravy", image: "https://images.unsplash.com/photo-1567184109121-6d43594892c9?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 106, name: "Veg Pulao", price: 180, description: "Fragrant basmati rice with seasonal veggies", image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400", isVeg: true }
        ]
    },
    {
        id: 2,
        name: "Pizza Paradise",
        rating: 4.2,
        deliveryTime: "25-35 min",
        cuisines: ["Italian", "Pizza"],
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹800 for two",
        offer: { type: 'flat', value: 100, label: '₹100 OFF', minOrder: 600, code: 'PIZZA100' },
        menu: [
            { id: 201, name: "Margherita Pizza", price: 399, description: "Classic tomato and mozzarella", image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 202, name: "Pepperoni Feast", price: 549, description: "Double pepperoni with extra cheese", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 203, name: "Garlic Bread", price: 149, description: "Toasted bread with garlic butter", image: "https://images.unsplash.com/photo-1573140247632-f8fd7499709a?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 204, name: "Pasta Arrabbiata", price: 320, description: "Spicy tomato sauce pasta", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 205, name: "BBQ Chicken Pizza", price: 499, description: "Smoky BBQ sauce and grilled chicken", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 206, name: "Cheese Garlic Bread", price: 189, description: "Toasted bread with melted mozzarella", image: "https://images.unsplash.com/photo-1573140247632-f8fd7499709a?auto=format&fit=crop&q=80&w=400", isVeg: true }
        ]
    },
    {
        id: 3,
        name: "Southern Spice",
        rating: 4.6,
        deliveryTime: "20-30 min",
        cuisines: ["South Indian"],
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹300 for two",
        offer: { type: 'percentage', value: 50, label: '50% OFF', minOrder: 200, maxDiscount: 100, code: 'SOUTH50' },
        menu: [
            { id: 301, name: "Masala Dosa", price: 120, description: "Crispy crepe with potato filling", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 302, name: "Idli Sambar", price: 80, description: "Steamed rice cakes with lentil soup", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 303, name: "Medu Vada", price: 90, description: "Fried lentil donuts", image: "https://images.unsplash.com/photo-1626132646529-5006375ae007?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 304, name: "Filter Coffee", price: 45, description: "Traditional South Indian coffee", image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 305, name: "Onion Rava Dosa", price: 140, description: "Thin crispy semolina crepe with onions", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 306, name: "Ven Pongal", price: 110, description: "Steamed rice and dal with pepper and ghee", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=400", isVeg: true }
        ]
    },
    {
        id: 4,
        name: "Burger King",
        rating: 4.1,
        deliveryTime: "15-25 min",
        cuisines: ["Burgers", "Street Food"],
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹400 for two",
        offer: { type: 'percentage', value: 15, label: '15% OFF', minOrder: 300, code: 'BURGER15' },
        menu: [
            { id: 401, name: "Whopper", price: 199, description: "Flame-grilled beef patty burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 402, name: "Veggie Burger", price: 149, description: "Crispy veg patty burger", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 403, name: "French Fries", price: 99, description: "Golden crispy fries", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 404, name: "Onion Rings", price: 120, description: "Crispy fried onion rings", image: "https://images.unsplash.com/photo-1639146504234-470fe6fdec4c?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 405, name: "Double Whopper", price: 299, description: "Two flame-grilled beef patties with cheese", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 406, name: "Cheese Fries", price: 149, description: "Golden fries topped with melted cheese", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400", isVeg: true }
        ]
    },
    {
        id: 5,
        name: "Sweet Delights",
        rating: 4.8,
        deliveryTime: "30-50 min",
        cuisines: ["Bakery", "Desserts"],
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹600 for two",
        offer: { type: 'percentage', value: 10, label: '10% OFF', minOrder: 500, code: 'SWEET10' },
        menu: [
            { id: 501, name: "Chocolate Truffle Cake", price: 549, description: "Rich dark chocolate cake", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 502, name: "Red Velvet Pastry", price: 129, description: "Classic red velvet cake slice", image: "https://images.unsplash.com/photo-1543508282-5c1f427f023f?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 503, name: "Macarons (Box of 6)", price: 449, description: "Assorted French macarons", image: "https://images.unsplash.com/photo-1569864358642-9d1619702663?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 504, name: "Cupcake Set (Box of 4)", price: 299, description: "Freshly baked assorted cupcakes", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 505, name: "Fruit Cake", price: 149, description: "Classic sponge cake with fresh tropical fruits", image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=400", isVeg: true }
        ]
    },
    {
        id: 6,
        name: "Dragon Wok",
        rating: 4.3,
        deliveryTime: "35-45 min",
        cuisines: ["Chinese"],
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹450 for two",
        offer: { type: 'percentage', value: 25, label: '25% OFF', minOrder: 400, code: 'DRAGON25' },
        menu: [
            { id: 601, name: "Hakka Noodles", price: 210, description: "Wok-tossed noodles with veggies", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 602, name: "Manchurian Gravy", price: 190, description: "Fried veg balls in spicy gravy", image: "https://images.unsplash.com/photo-1637806930600-34863060fc1e?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 603, name: "Spring Rolls", price: 160, description: "Crispy fried veg rolls", image: "https://images.unsplash.com/photo-1544333346-64e4303b3680?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 604, name: "Dim Sums (6 pcs)", price: 250, description: "Steamed vegetable dumplings", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 605, name: "Chicken Fried Rice", price: 240, description: "Classic fried rice with scrambled eggs and chicken", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 606, name: "Veg Momos", price: 150, description: "Steamed momos with spicy chutney", image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b?auto=format&fit=crop&q=80&w=400", isVeg: true }
        ]
    },
    {
        id: 7,
        name: "Green Garden",
        rating: 4.7,
        deliveryTime: "25-35 min",
        cuisines: ["Street Food", "Street Food"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹350 for two",
        offer: { type: 'percentage', value: 30, label: '30% OFF', minOrder: 300, code: 'GREEN30' },
        menu: [
            { id: 701, name: "Garden Fresh Salad", price: 180, description: "Mixed greens with lemon dressing", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 702, name: "Quinoa Bowl", price: 320, description: "Healthy quinoa with roasted veggies", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 703, name: "Fruit Platter", price: 150, description: "Seasonal fresh cut fruits", image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 704, name: "Caesar Salad", price: 240, description: "Romaine lettuce, croutons, and parmesan", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 705, name: "Green Smoothie", price: 160, description: "Healthy blend of spinach, apple and avocado", image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&q=80&w=400", isVeg: true }
        ]
    },
    {
        id: 8,
        name: "Tandoori Nights",
        rating: 4.4,
        deliveryTime: "40-50 min",
        cuisines: ["North Indian"],
        image: "https://images.unsplash.com/photo-1585937421612-70a0f2455f75?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹700 for two",
        offer: { type: 'flat', value: 150, label: '₹150 OFF', minOrder: 1000, code: 'TANDOOR150' },
        menu: [
            { id: 801, name: "Chicken Biryani", price: 380, description: "Fragrant rice with spiced chicken", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 802, name: "Mutton Seekh Kebab", price: 450, description: "Minced mutton grilled on skewers", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 803, name: "Raita", price: 80, description: "Chilled yogurt with spices", image: "https://images.unsplash.com/photo-1589113103503-49f149ee9173?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 804, name: "Paneer Tikka", price: 260, description: "Char-grilled marinated paneer cubes", image: "https://images.unsplash.com/photo-1567184109121-6d43594892c9?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 805, name: "Mutton Seekh Kebab", price: 399, description: "Finely minced mutton with aromatic spices", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400", isVeg: false }
        ]
    },
    {
        id: 9,
        name: "Cafe Coffee Day",
        rating: 4.0,
        deliveryTime: "15-20 min",
        cuisines: ["Bakery", "Desserts"],
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹400 for two",
        offer: { type: 'percentage', value: 20, label: '20% OFF', minOrder: 0, code: 'CAFE20' },
        menu: [
            { id: 901, name: "Cappuccino", price: 160, description: "Classic espresso with steamed milk", image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 902, name: "Cafe Latte", price: 180, description: "Espresso with lots of steamed milk", image: "https://images.unsplash.com/photo-1570968982331-99557760920a?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 903, name: "Blueberry Muffin", price: 120, description: "Freshly baked blueberry muffin", image: "https://images.unsplash.com/photo-1607958996333-cd1a2cf954e5?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 904, name: "Hot Chocolate", price: 150, description: "Rich and creamy Belgian hot chocolate", image: "https://images.unsplash.com/photo-1544787210-2213d240ad4c?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 905, name: "Veg Sandwich", price: 130, description: "Classic grilled sandwich with fresh veggies", image: "https://images.unsplash.com/photo-1521390188846-e2a3a97458a0?auto=format&fit=crop&q=80&w=400", isVeg: true }
        ]
    },
    {
        id: 10,
        name: "Sushi House",
        rating: 4.9,
        deliveryTime: "45-55 min",
        cuisines: ["Chinese"],
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹1200 for two",
        offer: { type: 'percentage', value: 15, label: '15% OFF', minOrder: 800, code: 'SUSHI15' },
        menu: [
            { id: 1001, name: "Salmon Nigiri", price: 450, description: "Fresh salmon on vinegared rice", image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 1002, name: "California Roll", price: 550, description: "Crab, avocado and cucumber roll", image: "https://images.unsplash.com/photo-1559461671-33236e761611?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 1003, name: "Veg Tempura Roll", price: 400, description: "Crispy fried vegetable roll", image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1004, name: "Miso Soup", price: 180, description: "Traditional Japanese soup with tofu and seaweed", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1005, name: "Ebi Fry", price: 499, description: "Crispy deep-fried prawns", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=400", isVeg: false }
        ]
    },
    {
        id: 11,
        name: "Taco Fiesta",
        rating: 4.6,
        deliveryTime: "25-35 min",
        cuisines: ["Mexican", "Street Food"],
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹500 for two",
        offer: { type: 'percentage', value: 20, label: '20% OFF', minOrder: 400, code: 'TACO20' },
        menu: [
            { id: 1101, name: "Chicken Tacos (3 pcs)", price: 299, description: "Soft shell tacos with grilled chicken", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 1102, name: "Veg Burrito Bowl", price: 249, description: "Rice, beans, salsa, and guacamole", image: "https://images.unsplash.com/photo-1584269663898-1f3132639415?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1103, name: "Nachos Supreme", price: 199, description: "Loaded nachos with cheese and jalapeños", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1104, name: "Churros", price: 149, description: "Cinnamon sugar fried dough pastry", image: "https://images.unsplash.com/photo-1624371414361-e670edf4898d?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1105, name: "Chicken Quesadilla", price: 279, description: "Grilled tortilla filled with chicken and cheese", image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 1106, name: "Beef Fajitas", price: 349, description: "Sizzling beef with bell peppers and onions", image: "https://images.unsplash.com/photo-1534352956272-465f248aef95?auto=format&fit=crop&q=80&w=400", isVeg: false }
        ]
    },
    {
        id: 12,
        name: "Healthy Bites",
        rating: 4.7,
        deliveryTime: "30-40 min",
        cuisines: ["Healthy Food", "Salads"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹600 for two",
        offer: { type: 'flat', value: 100, label: '₹100 OFF', minOrder: 500, code: 'HEALTHY100' },
        menu: [
            { id: 1201, name: "Greek Salad", price: 320, description: "Fresh veggies with feta cheese and olives", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1202, name: "Grilled Chicken Bowl", price: 380, description: "High protein chicken with quinoa", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 1203, name: "Avocado Toast", price: 250, description: "Sourdough toast with smashed avocado", image: "https://images.unsplash.com/photo-1588137372308-15f75323ca8f?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1204, name: "Berry Smoothie Bowl", price: 290, description: "Mixed berries blended with yogurt", image: "https://images.unsplash.com/photo-1626078299034-75cd776510fa?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1205, name: "Tofu Protein Salad", price: 310, description: "Grilled tofu with kale and chickpea", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1206, name: "Red Lentil Soup", price: 199, description: "Warm and comforting spiced lentil soup", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400", isVeg: true }
        ]
    },
    {
        id: 13,
        name: "Waffle Wonderland",
        rating: 4.8,
        deliveryTime: "20-30 min",
        cuisines: ["Desserts", "Bakery"],
        image: "https://images.unsplash.com/photo-1562088365-5c1a17277259?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹400 for two",
        offer: { type: 'percentage', value: 15, label: '15% OFF', minOrder: 300, code: 'WAFFLE15' },
        menu: [
            { id: 1301, name: "Belgian Chocolate Waffle", price: 220, description: "Classic waffle with dark chocolate sauce", image: "https://images.unsplash.com/photo-1562088365-5c1a17277259?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1302, name: "Red Velvet Waffle", price: 240, description: "Red velvet base with cream cheese", image: "https://images.unsplash.com/photo-1562088365-5c1a17277259?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1303, name: "Nutella Waffle Sandwich", price: 260, description: "Two waffle slices filled with Nutella", image: "https://images.unsplash.com/photo-1558584724-0e4d32caee3a?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1304, name: "Blueberry Waffle", price: 230, description: "Waffle topped with fresh blueberries and syrup", image: "https://images.unsplash.com/photo-1562088365-5c1a17277259?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1305, name: "Ice Cream Waffle", price: 280, description: "Deep-dish waffle with vanilla bean ice cream", image: "https://images.unsplash.com/photo-1558584724-0e4d32caee3a?auto=format&fit=crop&q=80&w=400", isVeg: true }
        ]
    },
    {
        id: 14,
        name: "Biryani Mahal",
        rating: 4.3,
        deliveryTime: "40-50 min",
        cuisines: ["North Indian", "Mughlai"],
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹700 for two",
        offer: { type: 'flat', value: 120, label: '₹120 OFF', minOrder: 800, code: 'BIRYANI120' },
        menu: [
            { id: 1401, name: "Hyderabadi Chicken Biryani", price: 350, description: "Authentic spicy dum biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 1402, name: "Mutton Biryani", price: 480, description: "Rich and flavorful mutton biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 1403, name: "Paneer Biryani", price: 290, description: "Aromatic biryani with marinated paneer", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1404, name: "Mirchi Ka Salan", price: 120, description: "Traditional spicy curry for biryani", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1405, name: "Egg Biryani", price: 260, description: "Fragrant rice with boiled eggs and spices", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1406, name: "Chicken 65", price: 299, description: "Spicy deep-fried chicken bites", image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&q=80&w=400", isVeg: false }
        ]
    },
    {
        id: 15,
        name: "Pasta Point",
        rating: 4.4,
        deliveryTime: "30-40 min",
        cuisines: ["Italian", "Continental"],
        image: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=800",
        costForTwo: "₹550 for two",
        offer: { type: 'percentage', value: 25, label: '25% OFF', minOrder: 400, code: 'PASTA25' },
        menu: [
            { id: 1501, name: "White Sauce Pasta", price: 280, description: "Creamy alfredo pasta with corn", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1502, name: "Chicken Lasagna", price: 350, description: "Layered pasta with minced chicken", image: "https://images.unsplash.com/photo-1574868309219-036e5c702662?auto=format&fit=crop&q=80&w=400", isVeg: false },
            { id: 1503, name: "Spaghetti Aglio e Olio", price: 260, description: "Classic olive oil and garlic pasta", image: "https://images.unsplash.com/photo-1546549010-63b539e9f9f6?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1504, name: "Pesto Pasta", price: 310, description: "Pasta in fresh basil pesto sauce", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&q=80&w=400", isVeg: true },
            { id: 1505, name: "Cheesy Sticks", price: 180, description: "Ooey-gooey melted cheese sticks", image: "https://images.unsplash.com/photo-1574868309219-036e5c702662?auto=format&fit=crop&q=80&w=400", isVeg: true }
        ]
    }
];
