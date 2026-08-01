'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart,
  ChevronDown,
  X,
  Leaf
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

// Default plants data (fallback)
const defaultPlants = [
  {
    _id: '1',
    name: 'Monstera Deliciosa',
    slug: 'monstera-deliciosa',
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviews: 152,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80',
    category: 'Indoor Plants',
    plantType: 'Indoor Plants',
    light: 'Bright Indirect',
    careLevel: 'Easy',
    petFriendly: true,
    potIncluded: true,
    isBestSeller: true,
    isLowMaintenance: true,
    isAirPurifying: true,
    tags: ['indoor', 'air-purifying', 'bestseller']
  },
  {
    _id: '2',
    name: 'Snake Plant',
    slug: 'snake-plant',
    price: 449,
    originalPrice: 599,
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&q=80',
    category: 'Indoor Plants',
    plantType: 'Indoor Plants',
    light: 'Low Light',
    careLevel: 'Easy',
    petFriendly: false,
    potIncluded: true,
    isBestSeller: true,
    isLowMaintenance: true,
    isAirPurifying: true,
    tags: ['indoor', 'low-maintenance']
  },
  {
    _id: '3',
    name: 'Peace Lily',
    slug: 'peace-lily',
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1592150621744-b18d0c0f0b0b?w=500&q=80',
    category: 'Indoor Plants',
    plantType: 'Indoor Plants',
    light: 'Low Light',
    careLevel: 'Easy',
    petFriendly: false,
    potIncluded: true,
    isBestSeller: false,
    isLowMaintenance: true,
    isAirPurifying: true,
    tags: ['indoor', 'air-purifying']
  },
  {
    _id: '4',
    name: 'Rubber Plant',
    slug: 'rubber-plant',
    price: 699,
    originalPrice: 899,
    rating: 4.6,
    reviews: 74,
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3aa2a?w=500&q=80',
    category: 'Indoor Plants',
    plantType: 'Indoor Plants',
    light: 'Bright Indirect',
    careLevel: 'Moderate',
    petFriendly: false,
    potIncluded: true,
    isBestSeller: false,
    isLowMaintenance: false,
    isAirPurifying: true,
    tags: ['indoor']
  },
  {
    _id: '5',
    name: 'ZZ Plant',
    slug: 'zz-plant',
    price: 649,
    originalPrice: 849,
    rating: 4.9,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80',
    category: 'Indoor Plants',
    plantType: 'Indoor Plants',
    light: 'Low Light',
    careLevel: 'Easy',
    petFriendly: true,
    potIncluded: true,
    isBestSeller: true,
    isLowMaintenance: true,
    isAirPurifying: false,
    tags: ['indoor', 'low-maintenance', 'pet-friendly']
  },
  {
    _id: '6',
    name: 'Areca Palm',
    slug: 'areca-palm',
    price: 799,
    originalPrice: 999,
    rating: 4.7,
    reviews: 63,
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=500&q=80',
    category: 'Indoor Plants',
    plantType: 'Indoor Plants',
    light: 'Bright Indirect',
    careLevel: 'Moderate',
    petFriendly: true,
    potIncluded: true,
    isBestSeller: false,
    isLowMaintenance: false,
    isAirPurifying: true,
    tags: ['indoor', 'air-purifying', 'pet-friendly']
  },
  {
    _id: '7',
    name: 'Fiddle Leaf Fig',
    slug: 'fiddle-leaf-fig',
    price: 1299,
    originalPrice: 1599,
    rating: 4.5,
    reviews: 47,
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3aa2a?w=500&q=80',
    category: 'Indoor Plants',
    plantType: 'Indoor Plants',
    light: 'Bright Indirect',
    careLevel: 'Expert',
    petFriendly: false,
    potIncluded: false,
    isBestSeller: false,
    isLowMaintenance: false,
    isAirPurifying: false,
    tags: ['indoor']
  },
  {
    _id: '8',
    name: 'Philodendron',
    slug: 'philodendron',
    price: 549,
    originalPrice: 699,
    rating: 4.6,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80',
    category: 'Indoor Plants',
    plantType: 'Indoor Plants',
    light: 'Bright Indirect',
    careLevel: 'Easy',
    petFriendly: false,
    potIncluded: true,
    isBestSeller: false,
    isLowMaintenance: true,
    isAirPurifying: true,
    tags: ['indoor', 'air-purifying']
  },
  {
    _id: '9',
    name: 'Bird of Paradise',
    slug: 'bird-of-paradise',
    price: 1099,
    originalPrice: 1399,
    rating: 4.4,
    reviews: 32,
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=500&q=80',
    category: 'Indoor Plants',
    plantType: 'Indoor Plants',
    light: 'Bright Indirect',
    careLevel: 'Moderate',
    petFriendly: false,
    potIncluded: true,
    isBestSeller: false,
    isLowMaintenance: false,
    isAirPurifying: false,
    tags: ['indoor']
  }
];

export default function ShopPage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filters state
  const [filters, setFilters] = useState({
    plantType: [],
    light: [],
    careLevel: [],
    priceRange: [0, 5000],
    petFriendly: null,
    potIncluded: null,
  });

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/products?limit=50&active=true`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache'
      });

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();
      const apiPlants = data.data || [];

      if (apiPlants.length > 0) {
        setPlants(apiPlants);
      } else {
        setPlants(defaultPlants);
      }
    } catch (err) {
      console.error('Error fetching plants:', err);
      setError('Using demo data');
      setPlants(defaultPlants);
    } finally {
      setLoading(false);
    }
  };

  // Filter + Search + Sort logic
  const filteredPlants = plants
    .filter((plant) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !plant.name.toLowerCase().includes(q) &&
          !(plant.tags || []).some(t => t.toLowerCase().includes(q))
        ) {
          return false;
        }
      }

      // Plant Type
      if (filters.plantType.length > 0 && !filters.plantType.includes(plant.plantType)) {
        return false;
      }

      // Light
      if (filters.light.length > 0 && !filters.light.includes(plant.light)) {
        return false;
      }

      // Care Level
      if (filters.careLevel.length > 0 && !filters.careLevel.includes(plant.careLevel)) {
        return false;
      }

      // Price
      if (plant.price < filters.priceRange[0] || plant.price > filters.priceRange[1]) {
        return false;
      }

      // Pet Friendly
      if (filters.petFriendly !== null && plant.petFriendly !== filters.petFriendly) {
        return false;
      }

      // Pot Included
      if (filters.potIncluded !== null && plant.potIncluded !== filters.potIncluded) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // newest (default)
    });

  // Pagination
  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
  const paginatedPlants = filteredPlants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key];
      if (Array.isArray(current)) {
        if (current.includes(value)) {
          return { ...prev, [key]: current.filter(v => v !== value) };
        }
        return { ...prev, [key]: [...current, value] };
      }
      return prev;
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      plantType: [],
      light: [],
      careLevel: [],
      priceRange: [0, 5000],
      petFriendly: null,
      potIncluded: null,
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const FilterSection = ({ title, children }) => (
    <div className="border-b border-[#e8ece9] pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <h3 className="font-semibold text-[#14261d] mb-3 text-sm">{title}</h3>
      {children}
    </div>
  );

  const Checkbox = ({ label, checked, onChange, count }) => (
    <label className="flex items-center gap-2.5 cursor-pointer group py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-[#d1d5db] text-[#2f9e44] focus:ring-[#2f9e44] focus:ring-offset-0"
      />
      <span className="text-sm text-[#4b5563] group-hover:text-[#14261d] flex-1">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-[#9ca3af]">({count})</span>
      )}
    </label>
  );

  return (
    <div className="plant-store min-h-screen bg-[#f6f8f7]">
      {/* Hero Banner */}
      <section className="bg-[#14261d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                Indoor Plants Collection
              </h1>
              <p className="text-white/70 text-lg max-w-md">
                Find the perfect plant for your space
              </p>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1463320726281-696a485928c7?w=700&q=80"
                alt="Indoor plants"
                className="rounded-2xl h-48 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Top Bar - Search + Sort + Mobile Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30 focus:border-[#2f9e44]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e8ece9] rounded-xl text-sm font-medium text-[#14261d]"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Sort */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-[#e8ece9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2f9e44]/30 focus:border-[#2f9e44] cursor-pointer"
              >
                <option value="newest">Sort by: Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#e8ece9] p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-[#14261d]">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#2f9e44] hover:underline font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Plant Type */}
              <FilterSection title="Plant Type">
                <div className="space-y-1">
                  {[
                    { label: 'Indoor Plants', value: 'Indoor Plants', count: 42 },
                    { label: 'Outdoor Plants', value: 'Outdoor Plants', count: 18 },
                    { label: 'Succulents', value: 'Succulents', count: 24 },
                    { label: 'Flowering Plants', value: 'Flowering Plants', count: 15 },
                    { label: 'Large Plants', value: 'Large Plants', count: 12 },
                  ].map((item) => (
                    <Checkbox
                      key={item.value}
                      label={item.label}
                      count={item.count}
                      checked={filters.plantType.includes(item.value)}
                      onChange={() => toggleFilter('plantType', item.value)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Light Requirement */}
              <FilterSection title="Light Requirement">
                <div className="space-y-1">
                  {[
                    { label: 'Low Light', value: 'Low Light', count: 28 },
                    { label: 'Bright Indirect', value: 'Bright Indirect', count: 35 },
                    { label: 'Direct Sunlight', value: 'Direct Sunlight', count: 14 },
                  ].map((item) => (
                    <Checkbox
                      key={item.value}
                      label={item.label}
                      count={item.count}
                      checked={filters.light.includes(item.value)}
                      onChange={() => toggleFilter('light', item.value)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Care Level */}
              <FilterSection title="Care Level">
                <div className="space-y-1">
                  {[
                    { label: 'Easy', value: 'Easy', count: 40 },
                    { label: 'Moderate', value: 'Moderate', count: 22 },
                    { label: 'Expert', value: 'Expert', count: 8 },
                  ].map((item) => (
                    <Checkbox
                      key={item.value}
                      label={item.label}
                      count={item.count}
                      checked={filters.careLevel.includes(item.value)}
                      onChange={() => toggleFilter('careLevel', item.value)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price Range">
                <div className="px-1">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => {
                      setFilters(prev => ({
                        ...prev,
                        priceRange: [0, Number(e.target.value)]
                      }));
                      setCurrentPage(1);
                    }}
                    className="w-full accent-[#2f9e44]"
                  />
                  <div className="flex justify-between text-xs text-[#6b7280] mt-2">
                    <span>₹0</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                </div>
              </FilterSection>

              {/* Pet Friendly */}
              <FilterSection title="Pet Friendly">
                <div className="space-y-1">
                  <Checkbox
                    label="Yes"
                    checked={filters.petFriendly === true}
                    onChange={() => setFilters(prev => ({
                      ...prev,
                      petFriendly: prev.petFriendly === true ? null : true
                    }))}
                  />
                  <Checkbox
                    label="No"
                    checked={filters.petFriendly === false}
                    onChange={() => setFilters(prev => ({
                      ...prev,
                      petFriendly: prev.petFriendly === false ? null : false
                    }))}
                  />
                </div>
              </FilterSection>

              {/* Pot Included */}
              <FilterSection title="Pot Included">
                <div className="space-y-1">
                  <Checkbox
                    label="Yes"
                    checked={filters.potIncluded === true}
                    onChange={() => setFilters(prev => ({
                      ...prev,
                      potIncluded: prev.potIncluded === true ? null : true
                    }))}
                  />
                  <Checkbox
                    label="No"
                    checked={filters.potIncluded === false}
                    onChange={() => setFilters(prev => ({
                      ...prev,
                      potIncluded: prev.potIncluded === false ? null : false
                    }))}
                  />
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-[#6b7280]">
                Showing <span className="font-medium text-[#14261d]">{paginatedPlants.length}</span> of{' '}
                <span className="font-medium text-[#14261d]">{filteredPlants.length}</span> results
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f9e44]"></div>
              </div>
            ) : paginatedPlants.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#e8ece9]">
                <Leaf className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
                <p className="text-lg font-medium text-[#14261d] mb-1">No plants found</p>
                <p className="text-sm text-[#6b7280] mb-5">Try adjusting your filters or search</p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-[#2f9e44] text-white rounded-xl text-sm font-medium hover:bg-[#1f7a34] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginatedPlants.map((plant, i) => (
                    <AnimatedSection key={plant._id || plant.id} delay={i * 50}>
                      <div className="group bg-white border border-[#e8ece9] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#2f9e44]/20 transition-all duration-300">
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-[#f6f8f7]">
                          <Link href={`/shop/${plant.slug || plant._id}`}>
                            <img
                              src={plant.image}
                              alt={plant.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=500&q=80';
                              }}
                            />
                          </Link>

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {plant.isBestSeller && (
                              <span className="px-2.5 py-1 bg-[#2f9e44] text-white text-[10px] font-semibold rounded-full uppercase tracking-wide">
                                Best Seller
                              </span>
                            )}
                            {plant.isLowMaintenance && (
                              <span className="px-2.5 py-1 bg-white/90 text-[#14261d] text-[10px] font-semibold rounded-full">
                                Low Maintenance
                              </span>
                            )}
                            {plant.isAirPurifying && (
                              <span className="px-2.5 py-1 bg-white/90 text-[#14261d] text-[10px] font-semibold rounded-full">
                                Air Purifying
                              </span>
                            )}
                          </div>

                          {/* Wishlist + Cart buttons */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-[#eaf7ee] transition-colors">
                              <Heart className="w-4 h-4 text-[#6b7280]" />
                            </button>
                            <button className="w-9 h-9 bg-[#2f9e44] rounded-full shadow-md flex items-center justify-center hover:bg-[#1f7a34] transition-colors">
                              <ShoppingCart className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <Link href={`/shop/${plant.slug || plant._id}`}>
                            <h3 className="font-semibold text-[#14261d] text-base line-clamp-1 group-hover:text-[#2f9e44] transition-colors">
                              {plant.name}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Star className="w-3.5 h-3.5 fill-[#f5a623] text-[#f5a623]" />
                            <span className="text-sm font-medium text-[#14261d]">{plant.rating}</span>
                            <span className="text-xs text-[#9ca3af]">({plant.reviews})</span>
                          </div>

                          <div className="flex items-center gap-2 mt-2.5">
                            <span className="text-lg font-bold text-[#14261d]">₹{plant.price}</span>
                            {plant.originalPrice && (
                              <span className="text-sm text-[#9ca3af] line-through">
                                ₹{plant.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                          currentPage === page
                            ? 'bg-[#2f9e44] text-white'
                            : 'bg-white border border-[#e8ece9] text-[#4b5563] hover:border-[#2f9e44] hover:text-[#2f9e44]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#e8ece9] px-5 py-4 flex items-center justify-between">
              <h2 className="font-bold text-[#14261d]">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-5 h-5 text-[#6b7280]" />
              </button>
            </div>

            <div className="p-5">
              {/* Same filters as desktop */}
              <FilterSection title="Plant Type">
                <div className="space-y-1">
                  {['Indoor Plants', 'Outdoor Plants', 'Succulents', 'Flowering Plants', 'Large Plants'].map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={filters.plantType.includes(item)}
                      onChange={() => toggleFilter('plantType', item)}
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Light Requirement">
                <div className="space-y-1">
                  {['Low Light', 'Bright Indirect', 'Direct Sunlight'].map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={filters.light.includes(item)}
                      onChange={() => toggleFilter('light', item)}
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Care Level">
                <div className="space-y-1">
                  {['Easy', 'Moderate', 'Expert'].map((item) => (
                    <Checkbox
                      key={item}
                      label={item}
                      checked={filters.careLevel.includes(item)}
                      onChange={() => toggleFilter('careLevel', item)}
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Price Range">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [0, Number(e.target.value)]
                  }))}
                  className="w-full accent-[#2f9e44]"
                />
                <div className="flex justify-between text-xs text-[#6b7280] mt-2">
                  <span>₹0</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
              </FilterSection>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border border-[#e8ece9] rounded-xl text-sm font-medium text-[#4b5563]"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 bg-[#2f9e44] text-white rounded-xl text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}