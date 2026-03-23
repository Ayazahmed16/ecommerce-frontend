export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-xl text-white/30 tracking-widest">NOIR</span>
        <p className="text-xs text-muted font-mono">© 2024 NOIR. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" className="text-xs text-muted hover:text-white transition-colors font-mono uppercase tracking-wider">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}