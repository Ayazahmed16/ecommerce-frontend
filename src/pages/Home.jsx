import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
})

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Accent blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

        <div className="relative text-center max-w-4xl">
          <motion.p {...fadeUp(0.1)} className="text-xs font-mono text-accent tracking-[0.4em] uppercase mb-6">
            Premium Collection 2024
          </motion.p>
          <motion.h1 {...fadeUp(0.25)} className="font-display text-[clamp(72px,15vw,160px)] leading-none text-white tracking-wider mb-6">
            COMMERCECORE
          </motion.h1>
          <motion.p {...fadeUp(0.4)} className="text-lg text-white/40 font-light max-w-md mx-auto mb-10 leading-relaxed">
            Curated products for those who demand excellence in every detail.
          </motion.p>
          <motion.div {...fadeUp(0.55)} className="flex gap-4 justify-center flex-wrap">
            <Link to="/products" className="btn-primary flex items-center gap-2">
              Shop Now <ArrowRight size={14} />
            </Link>
            <Link to="/products?category=new" className="btn-ghost">
              New Arrivals
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 flex flex-col items-center gap-2">
          <span className="text-[10px] text-muted font-mono tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted to-transparent" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {[
            { label: 'Free Shipping', desc: 'On all orders over $100', icon: '→' },
            { label: 'Premium Quality', desc: 'Handpicked by experts', icon: '◆' },
            { label: '24/7 Support', desc: 'Always here for you', icon: '○' },
          ].map((f, i) => (
            <motion.div key={f.label} {...fadeUp(0.1 * i)}
              className="bg-bg p-8 flex flex-col gap-3">
              <span className="font-mono text-accent text-lg">{f.icon}</span>
              <h3 className="font-display text-xl text-white tracking-wider">{f.label}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-border py-24 text-center px-6">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-display text-5xl md:text-7xl text-white tracking-wider mb-6">
          Explore The Collection
        </motion.h2>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          View All Products <ArrowRight size={14} />
        </Link>
      </section>
    </motion.div>
  )
}