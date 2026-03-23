import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

export default function Cart() {
  const { items, total, toggleCart } = useCartStore()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-6 py-12 text-center">
      <ShoppingBag size={48} className="text-muted mx-auto mb-6" />
      <h1 className="font-display text-4xl text-white tracking-wider mb-4">Your Cart</h1>
      <p className="text-muted font-mono text-sm mb-8">
        {items.length === 0 ? 'Your cart is empty' : `${items.length} item(s) — $${total().toFixed(2)}`}
      </p>
      <div className="flex gap-4 justify-center">
        {items.length > 0 && (
          <Link to="/checkout" className="btn-primary">Checkout</Link>
        )}
        <Link to="/products" className="btn-ghost">Continue Shopping</Link>
      </div>
    </motion.div>
  )
}