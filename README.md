# amarjaleel.me

Personal portfolio site. Built with Next.js because it's fast and I didn't want to mess with routing.

**Live site:** [amarjaleel.me](https://amarjaleel.me)

## Setup

```bash
git clone https://github.com/amarjaleelbanbhan/portfolio.git
cd portfolio
npm install
npm run dev
```

Opens on `localhost:3000`. Standard Next.js stuff.

## Tech

- Next.js 13+ (React 18)
- Tailwind for styling
- No backend, just static + SSG
- Hosted on Vercel

## Customizing it

All content lives in `data/portfolio.js`. Change that file and you're done.

```javascript
// Add your info
export const personalInfo = {
  name: 'Your Name',
  title: 'Software Engineer',
  email: 'you@example.com',
};

// Add projects
export const projects = [
  {
    title: 'Something you built',
    description: 'What it does',
    tags: ['Python', 'Flask'],
    github: 'https://github.com/...',
    featured: true, // shows on homepage
  },
];
```

Replace these files:
- `/public/images/hero-portrait.jpg` - your photo
- `/public/resume.pdf` - your resume
- `/public/projects/*` - project screenshots if you want them

## Deployment

Push to GitHub, then connect to Vercel. Takes 5 minutes and it's free:

1. Sign in to [vercel.com](https://vercel.com) with GitHub
2. New Project → Import your repo
3. Deploy (leave defaults)

Auto-deploys on every push to main. Add a custom domain in settings if you have one.

## Project structure

```
├── components/          # UI components
│   ├── LoadingScreen.js
│   ├── SecretProject.js # wave puzzle thing
│   └── TerminalGame.js
├── data/
│   └── portfolio.js     # all your content here
├── pages/               # next.js pages/routes
├── public/              # static assets
└── styles/
```

## Notes

There's a wave-matching puzzle on the projects page and a terminal game on contact. Built them while procrastinating on actual features.

Colors are configurable in `tailwind.config.js` if you want different neon shades.

## Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # serve production build
npm run lint     # check for issues
```

## License

MIT

## Contact

Amar Jaleel  
banbhanamarjalil@gmail.com  
[LinkedIn](https://www.linkedin.com/in/amar-jaleel/) · [GitHub](https://github.com/amarjaleelbanbhan)
>>>>>>> 55e4f2f (docs: update README.md with concise personal version)

**Live site:** [amarjaleel.me](https://amarjaleel.me)

<<<<<<< HEAD
## Setup
=======
Star it if you use it.

## 🛠️ Tech Stack

- Next.js, React, Tailwind CSS
- Node.js, JavaScript, Python
- Git, GitHub Actions, Vercel

## 📂 Features

- Interactive project gallery
- Skills visualization
- Downloadable resume
- Contact form

## 🌐 Live Demo

Check out the live site: [amarjaleel.me](https://amarjaleel.me)

## 📫 Contact

Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/amar-jaleel/)
or email: banbhanamarjalil@gmail.com
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
>>>>>>> 55e4f2f (docs: update README.md with concise personal version)

```bash
git clone https://github.com/amarjaleelbanbhan/portfolio.git
cd portfolio
npm install
npm run dev
```

Opens on `localhost:3000`. Standard Next.js stuff.

## Tech

- Next.js 13+ (React 18)
- Tailwind for styling
- No backend, just static + SSG
- Hosted on Vercel

## Customizing it

All content lives in `data/portfolio.js`. Change that file and you're done.

```javascript
// Add your info
export const personalInfo = {
  name: 'Your Name',
  title: 'Software Engineer',
  email: 'you@example.com',
};

// Add projects
export const projects = [
  {
    title: 'Something you built',
    description: 'What it does',
    tags: ['Python', 'Flask'],
    github: 'https://github.com/...',
    featured: true, // shows on homepage
  },
];
```

Replace these files:
- `/public/images/hero-portrait.jpg` - your photo
- `/public/resume.pdf` - your resume
- `/public/projects/*` - project screenshots if you want them

## Deployment

Push to GitHub, then connect to Vercel. Takes 5 minutes and it's free:

1. Sign in to [vercel.com](https://vercel.com) with GitHub
2. New Project → Import your repo
3. Deploy (leave defaults)

Auto-deploys on every push to main. Add a custom domain in settings if you have one.

## Project structure

```
├── components/          # UI components
│   ├── LoadingScreen.js
│   ├── SecretProject.js # wave puzzle thing
│   └── TerminalGame.js
├── data/
│   └── portfolio.js     # all your content here
├── pages/               # next.js pages/routes
├── public/              # static assets
└── styles/
```

## Notes

There's a wave-matching puzzle on the projects page and a terminal game on contact. Built them while procrastinating on actual features.

Colors are configurable in `tailwind.config.js` if you want different neon shades.

## Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # serve production build
npm run lint     # check for issues
```

## License

MIT

## Contact

Amar Jaleel  
banbhanamarjalil@gmail.com  
[LinkedIn](https://www.linkedin.com/in/amarjaleel/) · [GitHub](https://github.com/amarjaleelbanbhan)

---

Star it if you use it.
