import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer() {
  const { isOpen, items, toggleCart, removeItem, updateItem, total } = useCartStore()
  const navigate = useNavigate()

  const handleCheckout = () => {
    toggleCart()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="font-display text-2xl tracking-wider text-white">Cart</h2>
                <p className="text-xs text-muted font-mono mt-0.5">{items.length} items</p>
              </div>
              <button onClick={toggleCart} className="text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted font-mono text-sm">Your cart is empty</p>
                </div>
              ) : items.map(item => (
                <motion.div key={item.id} layout
                  className="flex gap-4 p-4 border border-border hover:border-white/20 transition-colors">
                  <div className="w-16 h-16 bg-subtle flex-shrink-0 overflow-hidden">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-subtle" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{item.name}</p>
                    <p className="text-xs text-accent font-mono mt-1">${parseFloat(item.price).toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateItem(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="text-muted hover:text-white transition-colors disabled:opacity-30">
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-mono text-white">{item.quantity}</span>
                      <button onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="text-muted hover:text-white transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    className="text-muted hover:text-red-400 transition-colors self-start mt-1">
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted uppercase tracking-widest font-mono">Total</span>
                  <span className="font-display text-2xl text-accent">${total().toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full text-center">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}