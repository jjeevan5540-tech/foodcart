# FoodKart 🍕

FoodKart is a full-featured, production-ready frontend-only food delivery application built with React.js and Vite. It offers a premium UI/UX inspired by leading platforms like Zomato, featuring seamless navigation, cart management, and order tracking.

![Frontend Preview](https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600)

## ✨ Features

- **🛍️ Complete Shopping Flow**: Search for restaurants, browse menus, add items to cart, and checkout.
- **🔐 Secure Authentication**: Integrated Signup and Login with localStorage persistence.
- **🛒 Dynamic Cart**: Real-time cart updates, quantity controls, and detailed bill summaries.
- **📱 Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.
- **✨ Premium UI**: Modern aesthetics with glassmorphism, Framer Motion animations, and custom Tailwind styling.
- **📊 Order Tracking**: View past orders and monitor order status.
- **🔍 Advanced Search & Filters**: Efficiently find food by restaurant name or cuisine type.

## 🛠️ Tech Stack

- **Framework**: React.js (Vite)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS Keyframes
- **State Management**: React Context API
- **Storage**: Browser LocalStorage

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <your-repo-link>
   cd foodkart
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI components
├── context/        # Auth and Cart state management
├── data/           # Dummy restaurant and menu data
├── pages/          # Full page components
└── styles/         # Global styles and tailwind config
```

## 📝 Important Notes

- This is a **frontend-only** project. No backend or real payments are integrated.
- Uses **localStorage** to maintain user sessions, cart items, and order history.
- Built with scalability in mind, ready for Firebase or a custom Node.js backend integration.

---

Made with ❤️ by Antigravity
