# Sthir Labs - Land Succession Terminal

An advanced land verification and forensic analysis platform built with Next.js 16, React 19, Framer Motion, and Tailwind CSS v4.

## Features

### 🎯 Core Components

1. **Header & Navigation** (`components/header.jsx`)
   - Sticky navigation with system status badge
   - Animated theme toggle (dark/light mode)
   - Gradient logo with neon glow effects

2. **Verification Command Center** (`components/command-center.jsx`)
   - Drag-and-drop file upload interface
   - Laser scan animation during file processing
   - Support for up to 3 files (PDF, JPG, PNG)
   - Interactive file list with removal capability

3. **Forensic Process Feed** (`components/process-feed.jsx`)
   - Real-time verification stage tracking
   - Timeline visualization with status indicators
   - Progress bar showing overall analysis completion
   - 5-stage verification pipeline:
     - Document Ingestion
     - OCR Processing
     - Forensic Verification
     - Chain of Title Analysis
     - Verdict Generation

4. **Intelligent Verdict Display** (`components/verdict.jsx`)
   - Animated fraud probability gauge (circular SVG)
   - AI-powered risk assessment (0-100%)
   - 48-hour countdown timer
   - Detailed analysis summary with terminal-style output
   - Status tracking for each verification step

5. **Digital Vault** (`components/vault.jsx`)
   - Character-by-character typewriter animation
   - Blockchain hash display (Ethereum)
   - Timestamp verification record
   - Immutable record status
   - Integrity verification badge
   - One-click copy functionality

### 🎨 Design System

**Colors:**
- **Primary**: Electric Violet (#8B5CF6)
- **Secondary**: Deep Emerald (#10B981)
- **Background**: Obsidian Dark (#0A0A0A) / Slate Light (#F8FAFC)
- **Accents**: Cyan, Amber, Red for analytics

**Typography:**
- Headings: Geist Sans (with weight variations)
- Body: Geist Sans
- Code/Data: Geist Mono (14px minimum)

**Effects:**
- Neon glow effects on borders and elements
- Gradient mesh backgrounds (Violet → Emerald)
- Smooth spring physics animations
- Laser scan line animations
- Pulsing status indicators

### ⚙️ Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with custom theme
- **Animations**: Framer Motion 11.x
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **Language**: JavaScript (no TypeScript)

### 🎬 Animation Features

**Reusable Motion Variants** (`lib/animations.js`):
- Container animations with staggered children
- Spring physics for smooth transitions
- Pulse and scan line effects
- Typewriter animations
- Glitch effects

**Interactive Elements:**
- Hover and tap animations on buttons
- Staggered item reveals on scroll
- Real-time progress bar updates
- Animated gauge fills
- Character-by-character typewriter effect

## File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.jsx              # Root layout with theme provider
│   ├── page.jsx                # Main page with hero and all sections
│   ├── globals.css             # Custom theme tokens and utilities
├── components/
│   ├── header.jsx              # Navigation header
│   ├── command-center.jsx       # File upload interface
│   ├── process-feed.jsx         # Verification timeline
│   ├── verdict.jsx              # Fraud assessment display
│   └── vault.jsx                # Blockchain vault record
├── lib/
│   ├── animations.js            # Framer Motion variants
│   └── utils.ts                 # Utility functions (included in starter)
└── package.json                 # Dependencies
```

## Getting Started

### Installation

```bash
# Clone or download the project
cd vercel/share/v0-project

# Install dependencies (automatic with v0)
pnpm install

# Or manually
pnpm install framer-motion next-themes
```

### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

### Build for Production

```bash
pnpm build
pnpm start
```

## Customization

### Theme Colors

Edit `app/globals.css`:
```css
:root {
  --neon-violet: #8B5CF6;
  --neon-emerald: #10B981;
  --obsidian: #0A0A0A;
  /* ... other tokens */
}

.dark {
  /* Dark mode overrides */
}
```

### Animation Timing

Adjust animation speeds in `lib/animations.js`:
```javascript
export const itemVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,  // Increase for faster animation
      damping: 12,      // Adjust for bounciness
    },
  },
};
```

### Mock Data

Update verification data directly in component state:
```javascript
const [fraudScore, setFraudScore] = useState(23.5);
const vaultData = {
  hash: 'your-ethereum-hash',
  timestamp: new Date().toISOString(),
};
```

## Performance Optimization

- Framer Motion uses hardware acceleration for smooth 60fps animations
- Components use `whileInView` for viewport-triggered animations
- Images are optimized with Next.js Image component (ready to implement)
- CSS utilities are minimal and leverage Tailwind's purging

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Accessibility

- Semantic HTML structure with `<main>`, `<section>`, `<footer>`
- ARIA labels on interactive elements
- Keyboard navigation support for all buttons
- High contrast text for readability
- Responsive design for all screen sizes

## Future Enhancements

- [ ] Backend API integration for real file processing
- [ ] WebSocket for live verification updates
- [ ] User authentication and role management
- [ ] Database integration for document storage
- [ ] Blockchain transaction verification
- [ ] Export/download verification reports
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

## License

Built with Vercel AI Gateway integration ready for production deployment.
