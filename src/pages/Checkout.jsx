import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { ordersAPI } from '../api/axios'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { items, total, fetchCart } = useCartStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: '', email: '', address: '', city: '', postal_code: '', country: '',
  })

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await ordersAPI.create({ shipping_address: form })
      toast.success('Order placed successfully!')
      await fetchCart()
      navigate(`/orders`)
    } catch {
      toast.error('Failed to place order')
    } finally { setLoading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-xs font-mono text-accent tracking-widest uppercase mb-2">Checkout</p>
        <h1 className="font-display text-5xl text-white tracking-wider">Complete Order</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          <h2 className="font-display text-2xl text-white tracking-wider mb-6">Shipping</h2>
          {[
            { key: 'full_name', label: 'Full Name', placeholder: 'John Doe' },
            { key: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
            { key: 'address', label: 'Address', placeholder: '123 Main St' },
            { key: 'city', label: 'City', placeholder: 'New York' },
            { key: 'postal_code', label: 'Postal Code', placeholder: '10001' },
            { key: 'country', label: 'Country', placeholder: 'United States' },
          ].map(({ key, label, placeholder, type = 'text' }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input className="input" type={type} placeholder={placeholder}
                value={form[key]} onChange={e => update(key, e.target.value)} required />
            </div>
          ))}
          <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full mt-4">
            {loading ? 'Placing Order...' : `Place Order — $${total().toFixed(2)}`}
          </button>
        </form>

        {/* Summary */}
        <div>
          <h2 className="font-display text-2xl text-white tracking-wider mb-6">Summary</h2>
          <div className="space-y-3 mb-6">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b border-border">
                <div>
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="text-xs text-muted font-mono">×{item.quantity}</p>
                </div>
                <span className="font-mono text-sm text-accent">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted uppercase tracking-widest font-mono">Total</span>
            <span className="font-display text-3xl text-accent">${total().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}