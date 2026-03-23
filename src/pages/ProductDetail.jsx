import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { productsAPI } from '../api/axios'
import { useCartStore } from '../store/cartStore'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const { addItem } = useCartStore()

  useEffect(() => {
    productsAPI.detail(id)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-surface" />
        <div className="space-y-4">
          <div className="h-8 bg-surface w-3/4" />
          <div className="h-6 bg-surface w-1/4" />
        </div>
      </div>
    </div>
  )

  if (!product) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-white text-xs font-mono uppercase tracking-widest transition-colors mb-10">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <div className="aspect-square bg-surface overflow-hidden">
          {product.image
            ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-muted font-mono text-sm">NO IMAGE</div>}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs text-accent font-mono uppercase tracking-widest mb-3">{product.category_name}</p>
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider mb-4">{product.name}</h1>
          <p className="font-mono text-3xl text-accent mb-6">${parseFloat(product.price).toFixed(2)}</p>

          <div className="h-px bg-border mb-6" />

          <p className="text-sm text-white/60 leading-relaxed mb-8">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-accent' : 'bg-red-500'}`} />
            <span className="text-xs font-mono text-muted">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <label className="label mb-0">Qty</label>
            <div className="flex items-center gap-3 border border-border px-4 py-2">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-muted hover:text-white transition-colors"><Minus size={12} /></button>
              <span className="font-mono text-sm text-white w-4 text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="text-muted hover:text-white transition-colors"><Plus size={12} /></button>
            </div>
          </div>

          <button onClick={() => addItem(product.id, qty)} disabled={product.stock === 0}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Meta */}
          {product.vendor_name && (
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs font-mono text-muted">Vendor: <span className="text-white">{product.vendor_name}</span></p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}