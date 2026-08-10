'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  Leaf,
  User,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

// Fallback product — only used if the API call fails
const defaultProduct = {
  _id: '1',
  name: 'Monstera Deliciosa',
  slug: 'monstera-deliciosa',
  category: 'Indoor Plants',
  price: 899,
  originalPrice: 1199,
  rating: 4.7,
  reviews: 152,
  inStock: true,
  image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80',
  images: [
    'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80',
    'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&q=80',
    'https://images.unsplash.com/photo-1459411552884-841db9b3aa2a?w=800&q=80',
  ],
  badges: ['Air Purifying', 'Low Maintenance', 'Pet Friendly'],
  description:
    "Monstera Deliciosa is a tropical plant known for its large, glossy leaves with natural splits and holes. It's easy to care for and perfect for homes and offices.",
  light: 'Bright Indirect',
  careLevel: 'Easy',
  careGuide: {
    light: 'Bright Indirect',
    water: 'Once a week',
    humidity: 'High',
    temperature: '18°C - 30°C',
    soil: 'Well-draining potting mix',
  },
  related: [
    { _id: '2', name: 'Philodendron', price: 549, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80', rating: 4.6 },
    { _id: '3', name: 'Bird of Paradise', price: 1099, image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&q=80', rating: 4.4 },
    { _id: '4', name: 'Calathea Orbifolia', price: 799, image: 'https://images.unsplash.com/photo-1459411552884-841db9b3aa2a?w=400&q=80', rating: 4.7 },
    { _id: '5', name: 'Pothos', price: 399, image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&q=80', rating: 4.8 },
  ],
};

// ============================================
// REVIEW FORM — customer writes a new review
// ============================================
function ReviewForm({ productId, onSubmitted }) {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, text: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/testimonials/customer-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, productId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', rating: 5, text: '' });
        onSubmitted?.();
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Review submit error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-6 p-6 bg-green-50 rounded-2xl border border-green-200">
        <div className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-green-700 font-semibold text-lg">Thank you for your review!</p>
          <p className="text-green-600 text-sm mt-1">Your review is pending approval from our team.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-6 bg-[#f6f8f7] rounded-2xl">
      <h3 className="font-semibold text-[#14261d] text-lg mb-4 flex items-center gap-2">
        <span>✍️</span> Write a Review
      </h3>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#14261d] mb-1">Your Name *</label>
          <input
            type="text"
            placeholder="e.g., Priya Sharma"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#e8ece9] bg-white focus:outline-none focus:ring-2 focus:ring-[#2f9e44] focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#14261d] mb-1">Your Email *</label>
          <input
            type="email"
            placeholder="e.g., priya@email.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#e8ece9] bg-white focus:outline-none focus:ring-2 focus:ring-[#2f9e44] focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-[#14261d] mb-2">Rating *</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setForm({ ...form, rating: star })}
              className="text-3xl hover:scale-110 transition-transform focus:outline-none"
              aria-label={`Rate ${star} stars`}
            >
              {star <= form.rating ? '⭐' : '☆'}
            </button>
          ))}
          <span className="ml-2 text-sm text-[#6b7280]">({form.rating} / 5)</span>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-[#14261d] mb-1">Your Review *</label>
        <textarea
          placeholder="Share your experience with this plant..."
          required
          rows={4}
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-[#e8ece9] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#2f9e44] focus:border-transparent transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-8 py-2.5 bg-[#2f9e44] text-white rounded-xl font-medium hover:bg-[#1f7a34] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span> Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}

// ============================================
// REVIEWS LIST — approved reviews for this product
// ============================================
function ReviewsList({ reviews, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2f9e44]"></div>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <p className="text-[#9ca3af] text-sm py-4">
        No reviews yet for this plant. Be the first to share your experience!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r._id} className="p-4 bg-[#f6f8f7] rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white border border-[#e8ece9] flex items-center justify-center overflow-hidden flex-shrink-0">
                {r.avatar ? (
                  <img src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-[#9ca3af]" />
                )}
              </div>
              <p className="font-semibold text-[#14261d] text-sm">{r.name}</p>
            </div>
            <span className="text-xs text-[#9ca3af]">
              {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-0.5 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-[#f5a623] text-[#f5a623]' : 'text-slate-200'}`} />
            ))}
          </div>
          <p className="text-sm text-[#4b5563] mt-2 leading-relaxed">{r.text}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// MAIN PRODUCT DETAIL PAGE
// ============================================
export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${slug}`, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          setProduct(defaultProduct);
        }
      } catch (err) {
        console.error(err);
        setProduct(defaultProduct);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const fetchReviews = async (productId) => {
    if (!productId) return;
    setReviewsLoading(true);
    try {
      const res = await fetch(`${API_URL}/testimonials/product/${productId}`, { cache: 'no-cache' });
      const data = await res.json();
      if (data.success) setReviews(data.data || []);
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (product?._id) fetchReviews(product._id);
  }, [product?._id]);

  const handleAddToCart = () => {
    if (!product || product.inStock === false) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || product.inStock === false) return;
    addToCart(product, quantity);
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="plant-store min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f9e44]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="plant-store min-h-screen flex items-center justify-center">
        <p className="text-[#6b7280]">Product not found</p>
      </div>
    );
  }

  // Gallery = admin-uploaded slider photos, falling back to the primary image
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80'];

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Badges: use admin-set badges if present, otherwise derive from the plant's real attributes
  const badges =
    product.badges && product.badges.length > 0
      ? product.badges
      : [
          product.isAirPurifying && 'Air Purifying',
          product.isLowMaintenance && 'Low Maintenance',
          product.petFriendly && 'Pet Friendly',
          product.isBestSeller && 'Best Seller',
        ].filter(Boolean);

  // Care guide: use the detailed one if admin filled it in, else fall back to the plant's basic light/care level
  const careEntries = product.careGuide && Object.values(product.careGuide).some(Boolean)
    ? Object.entries(product.careGuide).filter(([, v]) => v)
    : [
        ['light', product.light],
        ['care level', product.careLevel],
        product.potIncluded !== undefined ? ['pot included', product.potIncluded ? 'Yes' : 'No'] : null,
      ].filter((entry) => entry && entry[1]);

  return (
    <div className="plant-store bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[#e8ece9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-[#6b7280]">
            <Link href="/" className="hover:text-[#2f9e44]">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#2f9e44]">Shop</Link>
            <span>/</span>
            <span className="text-[#14261d] font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left - Image slider (gallery from admin) */}
          <AnimatedSection>
            <div className="space-y-4">
              <div className="aspect-square bg-[#f6f8f7] rounded-3xl overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80';
                  }}
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img + i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === i ? 'border-[#2f9e44]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Right - Details */}
          <AnimatedSection>
            <div className="space-y-6">
              <div>
                {product.category && (
                  <p className="text-sm text-[#2f9e44] font-medium mb-1">{product.category}</p>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14261d]">{product.name}</h1>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#14261d]">₹{product.price}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-[#9ca3af] line-through">₹{product.originalPrice}</span>
                    <span className="px-2.5 py-1 bg-red-50 text-red-600 text-sm font-semibold rounded-full">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Rating + Stock */}
              <div className="flex items-center gap-4">
                {(product.rating > 0 || product.reviews > 0) && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-[#f5a623] text-[#f5a623]" />
                    <span className="font-medium text-[#14261d]">{product.rating}</span>
                    <span className="text-sm text-[#9ca3af]">({reviews.length || product.reviews || 0} reviews)</span>
                  </div>
                )}
                {product.inStock !== false ? (
                  <span className="px-2.5 py-1 bg-[#eaf7ee] text-[#2f9e44] text-xs font-semibold rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f6f8f7] text-[#14261d] text-xs font-medium rounded-full border border-[#e8ece9]"
                    >
                      <Leaf className="w-3 h-3 text-[#2f9e44]" />
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-sm font-medium text-[#14261d] mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-[#e8ece9] flex items-center justify-center hover:bg-[#f6f8f7]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border border-[#e8ece9] flex items-center justify-center hover:bg-[#f6f8f7]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.inStock === false}
                  className="flex-1 py-3.5 bg-[#2f9e44] hover:bg-[#1f7a34] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {added ? 'Added! ✓' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.inStock === false}
                  className="flex-1 py-3.5 bg-[#14261d] hover:bg-[#1c3327] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
                <button className="w-12 h-12 rounded-xl border border-[#e8ece9] flex items-center justify-center hover:bg-[#f6f8f7]">
                  <Heart className="w-5 h-5 text-[#6b7280]" />
                </button>
              </div>

              {/* Delivery info */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2 text-sm text-[#6b7280]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#2f9e44]" />
                  Free delivery on orders above ₹999
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2f9e44]" />
                  Secure Packaging
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div className="flex gap-6 border-b border-[#e8ece9] mb-8">
            {['description', 'care', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold capitalize transition-colors relative ${
                  activeTab === tab ? 'text-[#2f9e44]' : 'text-[#6b7280] hover:text-[#14261d]'
                }`}
              >
                {tab === 'care' ? 'Care Guide' : tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
                {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f9e44]" />}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === 'description' && (
              <p className="text-[#6b7280] leading-relaxed">
                {product.description || 'No description added for this plant yet.'}
              </p>
            )}

            {activeTab === 'care' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {careEntries.length > 0 ? (
                  careEntries.map(([key, value]) => (
                    <div key={key} className="p-4 bg-[#f6f8f7] rounded-2xl">
                      <p className="text-xs uppercase tracking-wide text-[#9ca3af] mb-1">{key}</p>
                      <p className="font-medium text-[#14261d]">{value}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#9ca3af] text-sm">Care guide not added yet.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <ReviewsList reviews={reviews} loading={reviewsLoading} />
                <ReviewForm productId={product._id} onSubmitted={() => fetchReviews(product._id)} />
              </div>
            )}
          </div>
        </div>

        {/* Related Plants */}
        {product.related && product.related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#14261d] mb-6">Related Plants</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {product.related.map((item) => (
                <Link
                  key={item._id}
                  href={`/shop/${item.slug || item._id}`}
                  className="group bg-white border border-[#e8ece9] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#2f9e44]/20 transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-[#f6f8f7]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-[#14261d] text-sm line-clamp-1 group-hover:text-[#2f9e44]">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="font-bold text-[#14261d]">₹{item.price}</span>
                      {item.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#f5a623] text-[#f5a623]" />
                          <span className="text-xs">{item.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}