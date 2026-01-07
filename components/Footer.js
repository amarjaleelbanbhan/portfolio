const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/amarjaleel/' },
  { label: 'Twitter', href: 'https://twitter.com/ajbanbhan' },
  { label: 'Instagram', href: 'https://instagram.com/amarjaleel_' },
  { label: 'Email', href: 'mailto:banbhanamarjalil@gmail.com' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-midnight/80">
      <div className="section-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
        <p className="text-sm text-slate-400">© {new Date().getFullYear()} Portfolio. Crafted with Next.js.</p>
        <div className="flex gap-4 text-sm">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-slate-200 hover:text-accent"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
