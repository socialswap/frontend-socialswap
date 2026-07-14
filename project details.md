# Frontend Project Details – SocialSwap

This is the frontend single page web application (SPA) for **SocialSwap**, built using React, Ant Design, and Tailwind CSS.

---

## 🛠️ Technology Stack
- **Core Library:** React 18
- **UI Component Library:** Ant Design (antd)
- **Styling:** Tailwind CSS (utility-first) & Vanilla CSS overrides (in `index.css`)
- **Routing:** React Router DOM (version 6)
- **Animations:** Framer Motion
- **Icons:** Lucide React, Ant Design Icons (@ant-design/icons), React Icons
- **HTTP Client:** Axios (configured with intercepts in `src/API/api.js` for automatic token forwarding)
- **Auth Integrations:** `@react-oauth/google` (for Google sign-in support)
- **Canvas / Dynamic Effects:** `react-tsparticles` (particle background on auth pages)

---

## 📂 Project Structure

```text
frontend-socialswap/
├── public/                    # Static assets
└── src/
    ├── API/
    │   └── api.js             # Base URL config and Axios interceptor for JWT authorization
    ├── Component/
    │   ├── Cart/              # Cart layout page
    │   ├── Channel/           # Channel detail viewer component
    │   ├── Feature/           # Feature listings component
    │   ├── Header/            # Responsive Header & MobileFooter
    │   ├── Hero/              # Landing page Hero section (refactored to Tailwind CSS)
    │   ├── Orders/            # Orders tracker component
    │   ├── PageNotFound/      # 404 page layout
    │   ├── Profile/           # Profile page, MyChannels, and Transactions
    │   ├── Stats/             # Landing page Stats component (refactored to Tailwind CSS)
    │   └── Steps/             # Process steps visualization
    ├── ExternalPages/         # Policies and contact forms
    ├── Pages/
    │   ├── About/             # About page
    │   ├── Admin/             # Admin Dashboard, Banners, and Blogs management
    │   ├── Blogs/             # Blogs grid and details
    │   ├── Channels/          # Main channels directory listing
    │   ├── GrowYourChannel/   # Marketing promotion layouts
    │   ├── LandingPage/       # Home landing page assembly
    │   ├── Payment/           # Gateway payment page
    │   ├── Seller/            # Login and SignUp forms (refactored to Tailwind CSS)
    │   └── SellerPanel/       # Seller upload channel panel
    ├── Routing/
    │   └── Routes.jsx         # App router layout with route security checks
    ├── App.js                 # App layout configuration
    ├── index.css              # Custom global CSS (Tailwind directives + AntD custom overrides)
    ├── index.js               # Web app mounting and context configuration
    └── tailwind.config.js     # Tailwind CSS animation keyframes and extended styles
```

---

## 🎨 Theme Customizations
The styling of the application is a combination of utility-first Tailwind classes and global style rules inside `index.css`.
- **Animations:** Customized animations (`orb-float`, `gradient-shift`, `meter-sweep`, `card-border-glow`, and `pulse-ring`) are configured directly in `tailwind.config.js` to support interactive, high-fidelity UI aesthetics.
- **Theme Modes:** Components (e.g., `MyChannels.jsx`) adapt automatically to system/browser light and dark modes by utilizing Tailwind's utility modifiers (e.g. `bg-white dark:bg-white/[0.04]`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed locally.
- Backend server running (usually on port `8090`).

### Setup Environment
Create a `.env` file in the root directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8090/api
REACT_APP_BACKEND=http://localhost:8090
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Run Client
```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Compile production bundle
npm run build
```
The app will open by default on `http://localhost:3000`.
