import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Package } from 'lucide-react'
import { ordersAPI } from '../api/axios'

const STATUS_COLORS = {
  pending: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  processing: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  shipped: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  delivered: 'text-accent border-accent/30 bg-accent/5',
  cancelled: 'text-red-400 border-red-400/30 bg-red-400/5',
}

function OrderCard({ order, index }) {
  const [open, setOpen] = useState(false)
  const status = order.status?.toLowerCase() || 'pending'

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="border border-border hover:border-white/20 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-5 text-left">
        <div className="flex items-center gap-4">
          <Package size={16} className="text-muted" />
          <div>
            <p className="text-sm text-white font-medium font-mono">#{order.id?.toString().slice(0, 8).toUpperCase()}</p>
            <p className="text-xs text-muted mt-0.5">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`tag text-xs border px-2 py-1 ${STATUS_COLORS[status] || STATUS_COLORS.pending}`}>
            {order.status}
          </span>
          <span className="font-mono text-accent">${parseFloat(order.total_amount || 0).toFixed(2)}</span>
          {open ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
        </div>
      </button>

      {open && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
          className="border-t border-border overflow-hidden">
          <div className="p-5 space-y-3">
            {(order.items || []).map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-white/70">{item.product_name} <span className="text-muted font-mono">×{item.quantity}</span></span>
                <span className="font-mono text-white">${parseFloat(item.subtotal || 0).toFixed(2)}</span>
              </div>
            ))}
            {order.shipping_address && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted font-mono">Ship to: {order.shipping_address.address}, {order.shipping_address.city}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersAPI.list()
      .then(r => setOrders(r.data.results || r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-xs font-mono text-accent tracking-widest uppercase mb-2">Account</p>
        <h1 className="font-display text-5xl text-white tracking-wider">Your Orders</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-surface animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24">
          <Package size={40} className="text-muted mx-auto mb-4" />
          <p className="text-muted font-mono">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o, i) => <OrderCard key={o.id} order={o} index={i} />)}
        </div>
      )}
    </motion.div>
  )
}