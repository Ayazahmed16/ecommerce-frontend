import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { productsAPI } from '../api/axios'
import { useCartStore } from '../store/cartStore'

function ProductCard({ product, index }) {
  const { addItem } = useCartStore()
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="card group"
    >
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square bg-subtle overflow-hidden">
          {product.image
            ? <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            : <div className="w-full h-full flex items-center justify-center text-muted font-mono text-xs">NO IMAGE</div>
          }
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">{product.category_name || 'Uncategorized'}</p>
              <h3 className="text-sm text-white font-medium leading-snug">{product.name}</h3>
            </div>
            <span className="font-mono text-accent text-sm flex-shrink-0">${parseFloat(product.price).toFixed(2)}</span>
          </div>
          {product.stock === 0 && (
            <span className="tag mt-2 inline-block">Out of Stock</span>
          )}
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button onClick={() => addItem(product.id)}
          disabled={product.stock === 0}
          className="btn-primary w-full text-xs disabled:opacity-40 disabled:cursor-not-allowed">
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''

  useEffect(() => {
    productsAPI.categories().then(r => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (category) params.category = category
    productsAPI.list(params)
      .then(r => setProducts(r.data.results || r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [search, category])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-mono text-accent tracking-widest uppercase mb-2">Catalog</p>
          <h1 className="font-display text-5xl text-white tracking-wider">Products</h1>
        </div>
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input pl-9" placeholder="Search products..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button onClick={() => setSearchParams({})}
          className={`tag px-3 py-1.5 transition-colors ${!category ? 'border-accent text-accent' : 'hover:border-white/30 hover:text-white'}`}>
          All
        </button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setSearchParams({ category: c.slug || c.id })}
            className={`tag px-3 py-1.5 transition-colors ${category === (c.slug || String(c.id)) ? 'border-accent text-accent' : 'hover:border-white/30 hover:text-white'}`}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-square bg-subtle" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-subtle rounded w-1/2" />
                <div className="h-4 bg-subtle rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted font-mono">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </motion.div>
  )
}