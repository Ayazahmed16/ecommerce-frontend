import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, ShoppingBag, Users, TrendingUp, RefreshCw } from 'lucide-react'
import { adminAPI } from '../api/axios'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const STATUS_COLORS = {
  pending: 'text-yellow-400', processing: 'text-blue-400',
  shipped: 'text-purple-400', delivered: 'text-accent', cancelled: 'text-red-400',
}

function StatCard({ label, value, icon: Icon, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card p-6 flex items-start justify-between">
      <div>
        <p className="text-xs text-muted font-mono uppercase tracking-widest mb-3">{label}</p>
        <p className="font-display text-4xl text-white tracking-wider">{value ?? '—'}</p>
      </div>
      <div className="w-10 h-10 border border-border flex items-center justify-center text-muted">
        <Icon size={16} />
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, ordersRes] = await Promise.all([
        adminAPI.stats().catch(() => ({ data: {} })),
        adminAPI.orders().catch(() => ({ data: [] })),
      ])
      setStats(statsRes.data)
      setOrders(ordersRes.data.results || ordersRes.data)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const updateStatus = async (id, status) => {
    try {
      await adminAPI.updateOrder(id, { status })
      setOrders(os => os.map(o => o.id === id ? { ...o, status } : o))
      toast.success('Status updated')
    } catch { toast.error('Failed to update') }
  }

  const statCards = [
    { label: 'Total Orders', value: stats?.total_orders, icon: Package },
    { label: 'Revenue', value: stats?.total_revenue ? `$${parseFloat(stats.total_revenue).toFixed(0)}` : null, icon: TrendingUp },
    { label: 'Products', value: stats?.total_products, icon: ShoppingBag },
    { label: 'Users', value: stats?.total_users, icon: Users },
  ]

  const tabs = ['orders', 'vendors']

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-mono text-accent tracking-widest uppercase mb-2">Admin</p>
          <h1 className="font-display text-5xl text-white tracking-wider">Dashboard</h1>
        </div>
        <button onClick={fetchData} className="btn-ghost flex items-center gap-2 text-xs">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {statCards.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      {/* Tabs */}
      <div className="flex gap-px mb-8 border-b border-border">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-6 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${activeTab === t ? 'text-accent border-b border-accent' : 'text-muted hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Orders table */}
      {activeTab === 'orders' && (
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-2">
              {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-surface animate-pulse" />)}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="text-left pb-3 text-xs text-muted font-mono uppercase tracking-widest pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-4 pr-6 font-mono text-xs text-white">#{order.id?.toString().slice(0, 8).toUpperCase()}</td>
                    <td className="py-4 pr-6 text-white/70 text-xs">{order.user_email || order.user || '—'}</td>
                    <td className="py-4 pr-6 font-mono text-accent text-xs">${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                    <td className="py-4 pr-6">
                      <span className={`text-xs font-mono ${STATUS_COLORS[order.status] || 'text-muted'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-xs text-muted font-mono">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                        className="bg-subtle border border-border text-white text-xs font-mono px-3 py-1.5 focus:outline-none focus:border-accent/50">
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Vendors tab */}
      {activeTab === 'vendors' && (
        <p className="text-muted font-mono text-sm">Vendor management coming soon...</p>
      )}
    </motion.div>
  )
}