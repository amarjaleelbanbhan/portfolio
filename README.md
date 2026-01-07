# 🚀 Amar Jaleel Portfolio

A modern, cyberpunk-themed portfolio website built with Next.js, featuring interactive elements, animated statistics, and a unique wave-matching Easter egg game.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.13-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🎨 **Cyberpunk Theme** - Neon colors, glitch effects, and futuristic UI
- 📊 **Animated Statistics** - Count-up animations for achievements
- 🎮 **Interactive Elements**:
  - Gravity-based skills visualization (Matter.js)
  - Terminal-style navigation game
  - Secret wave-matching puzzle to unlock hidden content
- 📱 **Fully Responsive** - Works on all device sizes
- ⚡ **Fast Loading** - Optimized with dynamic imports
- 🔍 **SEO Optimized** - Meta tags, sitemap, and robots.txt included
- 🎯 **Easy to Customize** - All content managed through a single data file

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Physics**: Matter.js
- **Effects**: React Confetti, Custom CSS animations

## 📁 Project Structure

```
portfolio/
├── components/          # React components
│   ├── Achievements.js  # Certifications display
│   ├── AnimatedStats.js # Counting statistics
│   ├── Education.js     # Education timeline
│   ├── GravitySkills.js # Interactive skill bubbles
│   ├── Hero.js          # Landing section
│   ├── LoadingScreen.js # Initial loading animation
│   ├── SecretProject.js # Wave-matching Easter egg
│   └── TerminalGame.js  # Terminal navigation game
├── data/
│   └── portfolio.js     # ⭐ ALL YOUR CONTENT HERE
├── pages/
│   ├── index.js         # Homepage
│   ├── projects.js      # Projects gallery
│   ├── skills.js        # Skills page
│   ├── contact.js       # Contact form
│   └── certifications.js
├── public/
│   ├── images/          # Your images
│   ├── resume.pdf       # Your resume
│   ├── robots.txt       # SEO
│   └── sitemap.xml      # SEO
└── styles/
    └── globals.css      # Global styles
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/amarjaleelbanbhan/portfolio.git

# Navigate to project
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✏️ Customization

All content is managed in **one file**: `data/portfolio.js`

### Edit Your Info

```javascript
// data/portfolio.js
export const personalInfo = {
  name: 'Your Name',
  title: 'Your Title',
  email: 'your@email.com',
  // ... more fields
};
```

### Add Projects

```javascript
export const projects = [
  {
    title: 'Project Name',
    description: 'What it does',
    tags: ['React', 'Node.js'],
    link: 'https://github.com/...',
    github: 'https://github.com/...',
    featured: true, // Shows on homepage
  },
];
```

### Add Certifications

```javascript
export const achievements = [
  {
    title: 'Certification Name',
    organization: 'Google',
    date: '2025',
    type: 'certification',
    verifyLink: 'https://...',
    icon: '🏆',
  },
];
```

## 🌐 Deploy to Vercel (Free)

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/amarjaleelbanbhan/portfolio)

### Option 2: Manual Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account (FREE)
   - Click **"Add New Project"**
   - Import your repository
   - Click **"Deploy"**

3. **Done!** 🎉
   - Your site will be live at `your-project.vercel.app`
   - Custom domain can be added for free in settings

### Environment Variables (Optional)

If you add any API keys later, add them in Vercel:
- Project Settings → Environment Variables

## 🔧 Build Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎮 Easter Eggs

- 🌊 **Wave Puzzle**: On the Projects page, find the "TOP SECRET" card and match the waves to unlock hidden content!
- 🖥️ **Terminal Game**: On the Contact page, try the terminal navigation game

## 📝 Adding Images

1. Add your profile photo to `/public/images/hero-portrait.jpg`
2. Add project images to `/public/projects/`
3. Add your resume PDF to `/public/resume.pdf`

## 🎨 Customizing Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'neon-cyan': '#00ffff',
  'neon-green': '#00ff88',
  'neon-magenta': '#ff00ff',
  'midnight': '#0a0a0f',
}
```

## 📄 License

MIT License - Feel free to use this template for your own portfolio!

## 🤝 Contact

**Amar Jaleel**
- 📧 Email: banbhanamarjalil@gmail.com
- 💼 LinkedIn: [/in/amarjaleel](https://linkedin.com/in/amarjaleel)
- 🐙 GitHub: [@amarjaleelbanbhan](https://github.com/amarjaleelbanbhan)
- 📱 WhatsApp: +92 344 443 2197

---

⭐ **Star this repo if you found it helpful!**
