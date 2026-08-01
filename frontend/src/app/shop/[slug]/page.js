'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  ArrowLeft
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

// Fallback product
const defaultProduct = {
  _id: '1',
  name: 'Monstera Deliciosa',
  slug: 'monstera-deliciosa',
  price: 899,
  originalPrice: 1199,
  discount: 25,
  rating: 4.7,
  reviews: 152,
  inStock: true,
  images: [
    'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80',
    'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&q=80',
    'https://images.unsplash.com/photo-1459411552884-841db9b3aa2a?w=800&q=80',
    'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=800&q=80'
  ],
  badges: ['Air Purifying', 'Low Maintenance', 'Pet Friendly'],
  sizes: ['5 inch', '7 inch', '9 inch'],
  description: 'Monstera Deliciosa is a tropical plant known for its large, glossy leaves with natural splits and holes. It\'s easy to care for and perfect for homes and offices.',
  careGuide: {
    light: 'Bright Indirect',
    water: 'Once a week',
    humidity: 'High',
    temperature: '18°C - 30°C',
    soil: 'Well-draining potting mix'
  },
  related: [
    { _id: '2', name: 'Philodendron', price: 549, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80', rating: 4.6 },
    { _id: '3', name: 'Bird of Paradise', price: 1099, image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&q=80', rating: 4.4 },
    { _id: '4', name: 'Calathea Orbifolia', price: 799, image: 'https://images.unsplash.com/photo-1459411552884-841db9b3aa2a?w=400&q=80', rating: 4.7 },
    { _id: '5', name: 'Pothos', price: 399, image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&q=80', rating: 4.8 }
  ]
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('7 inch');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${slug}`, {
          cache: 'no-cache'
        });
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
          if (data.data.sizes?.length) setSelectedSize(data.data.sizes[1] || data.data.sizes[0]);
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

  const images = product.images || [product.image];
  const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

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
          {/* Left - Images */}
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

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === i
                        ? 'border-[#2f9e44]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Right - Details */}
          <AnimatedSection>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-[#2f9e44] font-medium mb-1">Swiss Cheese Plant</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14261d]">{product.name}</h1>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#14261d]">₹{product.price}</span>
                {product.originalPrice && (
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
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-[#f5a623] text-[#f5a623]" />
                  <span className="font-medium text-[#14261d]">{product.rating}</span>
                  <span className="text-sm text-[#9ca3af]">({product.reviews} reviews)</span>
                </div>
                {product.inStock !== false && (
                  <span className="px-2.5 py-1 bg-[#eaf7ee] text-[#2f9e44] text-xs font-semibold rounded-full">
                    In Stock
                  </span>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {(product.badges || ['Air Purifying', 'Low Maintenance', 'Pet Friendly']).map((badge, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f6f8f7] text-[#14261d] text-xs font-medium rounded-full border border-[#e8ece9]"
                  >
                    <Leaf className="w-3 h-3 text-[#2f9e44]" />
                    {badge}
                  </span>
                ))}
              </div>

              {/* Size */}
              <div>
                <p className="text-sm font-medium text-[#14261d] mb-2">Pot Size</p>
                <div className="flex gap-2">
                  {(product.sizes || ['5 inch', '7 inch', '9 inch']).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        selectedSize === size
                          ? 'bg-[#2f9e44] text-white border-[#2f9e44]'
                          : 'bg-white text-[#4b5563] border-[#e8ece9] hover:border-[#2f9e44]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

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
                <button className="flex-1 py-3.5 bg-[#2f9e44] hover:bg-[#1f7a34] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="flex-1 py-3.5 bg-[#14261d] hover:bg-[#1c3327] text-white font-semibold rounded-xl transition-all">
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
                  activeTab === tab
                    ? 'text-[#2f9e44]'
                    : 'text-[#6b7280] hover:text-[#14261d]'
                }`}
              >
                {tab === 'care' ? 'Care Guide' : tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f9e44]" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === 'description' && (
              <p className="text-[#6b7280] leading-relaxed">
                {product.description || defaultProduct.description}
              </p>
            )}

            {activeTab === 'care' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(product.careGuide || defaultProduct.careGuide).map(([key, value]) => (
                  <div key={key} className="p-4 bg-[#f6f8f7] rounded-2xl">
                    <p className="text-xs uppercase tracking-wide text-[#9ca3af] mb-1">{key}</p>
                    <p className="font-medium text-[#14261d]">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <p className="text-[#6b7280]">
                  {product.reviews} customer reviews with an average rating of {product.rating} stars.
                </p>
                <p className="text-sm text-[#9ca3af]">Reviews coming soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Plants */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#14261d] mb-6">Related Plants</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {(product.related || defaultProduct.related).map((item) => (
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
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#f5a623] text-[#f5a623]" />
                      <span className="text-xs">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}