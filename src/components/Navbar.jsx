import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const { count, toggleCart } = useCartStore()
  const location = useLocation()
  const navigate = useNavigate()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/orders', label: 'Orders' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl text-white tracking-widest hover:text-accent transition-colors">
            COMMERCECORE
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`text-xs tracking-widest uppercase font-mono transition-colors ${location.pathname === l.to ? 'text-accent' : 'text-muted hover:text-white'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user?.is_staff && (
              <Link to="/admin" className="text-muted hover:text-accent transition-colors">
                <LayoutDashboard size={18} />
              </Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-xs text-muted uppercase tracking-widest hover:text-white font-mono transition-colors hidden md:block">
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-xs text-muted uppercase tracking-widest hover:text-white font-mono transition-colors hidden md:block">
                Login
              </Link>
            )}
            <button onClick={toggleCart} className="relative text-white hover:text-accent transition-colors">
              <ShoppingBag size={20} />
              {count() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-bg text-xs font-mono w-4 h-4 flex items-center justify-center">
                  {count()}
                </span>
              )}
            </button>
            <button onClick={() => setMenuOpen(o => !o)} className="md:hidden text-white">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              className="md:hidden overflow-hidden border-t border-border bg-surface">
              <div className="px-6 py-4 flex flex-col gap-4">
                {links.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                    className="text-xs tracking-widest uppercase font-mono text-muted hover:text-white transition-colors">
                    {l.label}
                  </Link>
                ))}
                {isAuthenticated
                  ? <button onClick={handleLogout} className="text-xs tracking-widest uppercase font-mono text-muted hover:text-white transition-colors text-left">Logout</button>
                  : <Link to="/login" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase font-mono text-muted hover:text-white transition-colors">Login</Link>
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <CartDrawer />
    </>
  )
}