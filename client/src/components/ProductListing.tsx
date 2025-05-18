import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import brandService from '../services/brand.service';
import productService from '../services/product.service';
import { priceRanges } from '../data/price';
import { sortOptions } from '../data/sort';
import { ProductV2 } from '../types/product';

// Brand filter button component
const BrandButton: React.FC<{ brand: string; logo: string; isActive: boolean; onClick: () => void }> = ({
    brand,
    logo,
    isActive,
    onClick
}) => {
    console.log('Brand button clicked:', logo);
    return (
        <button
            className={`flex items-center px-3 py-2 rounded-full border transition-colors ${isActive ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-blue-300'
                }`}
            onClick={onClick}
        >
            {/* {logo && <img src={logo} alt={`${brand} logo`} className="h-5 w-auto mr-1" />} */}
            {<span className="text-sm">{brand}</span>}
        </button>
    );
};

// Sort option component
const SortOption: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({
    label,
    isActive,
    onClick
}) => {
    return (
        <button
            className={`px-3 py-1 text-sm rounded-md transition-colors ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

interface ProductListingProps {
    categoryId?: number;
}

const ProductListing: React.FC<ProductListingProps> = ({ categoryId }) => {
    // Brand filtering state
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

    // Sorting state
    const [sortOption, setSortOption] = useState<string>('Nổi bật');

    // Price filtering state
    const [priceRange, setPriceRange] = useState<string | null>(null);
    const [visibleProducts, setVisibleProducts] = useState<number>(10);
    const [brands, setBrands] = useState<Array<{ id: number, name: string, logo: string }>>([]);

    // Products state
    const [products, setProducts] = useState<ProductV2[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit] = useState<number>(10);

    // Fetch products based on filters
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            console.log('Fetching products with parameters:', {
                categoryId,
                brandId: selectedBrandId,
                priceRange,
                page: currentPage,
                limit
            });

            const params: any = {
                page: currentPage,
                limit,
            };

            // Add category filter if provided
            if (categoryId) {
                params.categoryId = categoryId;
            }

            // Add brand filter if selected
            if (selectedBrandId) {
                params.brandId = selectedBrandId;
                console.log('Selected brand ID:', selectedBrandId);
            }

            // Add price range if selected
            if (priceRange) {
                const selectedPriceRange = priceRanges.find(range => range.value === priceRange);
                if (selectedPriceRange) {
                    params.min = selectedPriceRange.min;
                    params.max = selectedPriceRange.max;
                    console.log('Price range:', selectedPriceRange.min, '-', selectedPriceRange.max);
                }
            }

            console.log('API Request parameters:', params);
            const response = await productService.getProducts(params);
            console.log('API Response:', response);

            if (response && response.data) {
                // For subsequent pages, add to existing products
                if (currentPage > 1) {
                    setProducts(prev => {
                        // Get existing product IDs
                        const existingIds = new Set(prev.map(p => p.id));
                        // Filter out new products that already exist in the list
                        const newProducts = response.data.filter(p => !existingIds.has(p.id));
                        // Return combined list
                        return [...prev, ...newProducts];
                    });
                } else {
                    // For first page or filter changes, replace products
                    setProducts(response.data);
                }
                setTotalProducts(response.meta?.total || 0);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [categoryId, currentPage, limit, priceRange, selectedBrandId]);

    // Fetch brands by category ID when the component mounts or categoryId changes
    useEffect(() => {
        const fetchBrands = async () => {
            if (categoryId) {
                try {
                    const brandsData = await brandService.getBrandsByCategoryId(categoryId);
                    console.log('Fetched brands:', brandsData);

                    // Map API data to the format expected by our components
                    const formattedBrands = brandsData.map(brand => ({
                        id: brand.id,
                        name: brand.name,
                        // Use logoUrl from API, if it doesn't start with http, assume it's a relative path
                        logo: brand.logoUrl
                    }));
                    setBrands(formattedBrands);
                } catch (error) {
                    console.error('Error fetching brands:', error);
                    // Fallback to default brands if API fails
                    setBrands([]);
                }
            } else {
                // Default brands when no categoryId is provided
                setBrands([]);
            }
        };

        fetchBrands();

        // Reset products, filters and pagination when category changes
        setProducts([]);
        setSelectedBrand(null);
        setSelectedBrandId(null);
        setPriceRange(null);
        setCurrentPage(1);
        setVisibleProducts(10);

        // Fetch products with the initial parameters
        fetchProducts();
    }, [categoryId]);  // Remove fetchProducts dependency to avoid double fetching    

    // // Fetch products when filters change (separate from the main useEffect to avoid double fetching)
    useEffect(() => {
        console.log('Filter changed, fetching products again');
        // Only reset products and page if we're changing filters, not when component mounts
        if (selectedBrandId !== null || priceRange !== null) {
            setProducts([]);
            setCurrentPage(1);
        }
        fetchProducts();
    }, [selectedBrandId, priceRange, fetchProducts]);

    // Handle brand selection
    const handleBrandSelect = (brandName: string, brandId: number) => {
        if (selectedBrand === brandName) {
            setSelectedBrand(null);
            setSelectedBrandId(null);
        } else {
            setSelectedBrand(brandName);
            setSelectedBrandId(brandId);
        }
    };

    // Handle price range selection
    const handlePriceRangeSelect = (range: string) => {
        if (priceRange === range) {
            setPriceRange(null);
        } else {
            setPriceRange(range);
        }
    };

    // Handle "Xem thêm" button click
    const handleLoadMore = () => {
        setCurrentPage(prev => prev + 1);
    };    // Sort products based on selected option
    const getSortedProducts = () => {
        if (!products.length) return [];

        console.log('Sorting products with option:', sortOption);
        console.log('Number of products before sorting:', products.length);

        const getVariantPrice = (product: ProductV2) => {
            const variant = product.productVariants && product.productVariants.length > 0
                ? product.productVariants[0]
                : null;
            return variant ? Number(variant.discountPrice || variant.price) : 0;
        };

        const getDiscountPercentage = (product: ProductV2) => {
            const variant = product.productVariants && product.productVariants.length > 0
                ? product.productVariants[0]
                : null;
            if (!variant || !variant.discountPrice) return 0;

            const price = Number(variant.price);
            const discountPrice = Number(variant.discountPrice);
            if (price === 0) return 0;

            return Math.round(((price - discountPrice) / price) * 100);
        };

        return [...products].sort((a, b) => {
            switch (sortOption) {
                case 'Giảm giá':
                    return getDiscountPercentage(b) - getDiscountPercentage(a);
                case 'Giá':
                    return getVariantPrice(a) - getVariantPrice(b);
                case 'Bán chạy':
                    // Mock data for sales count - in real implementation, this would come from the API
                    return Math.floor(Math.random() * 1000) - Math.floor(Math.random() * 1000);
                case 'Mới':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default: { // Nổi bật
                    // Mock data for rating - in real implementation, this would come from the API
                    const aRating = (Math.random() * 2) + 3; // Random between 3 and 5
                    const bRating = (Math.random() * 2) + 3;
                    return (bRating * 1000) - (aRating * 1000);
                }
            }
        });
    };

    const sortedProducts = getSortedProducts();
    const displayedProducts = sortedProducts.slice(0, visibleProducts);

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-6">
                {/* Filter by brand */}
                <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                    <div className="flex items-center mb-2">
                        <button className="flex items-center text-gray-600 mr-3">
                            <span className="text-sm">Hãng:</span>
                        </button>

                        <div className="overflow-x-auto flex-grow">
                            <div className="flex space-x-2">
                                {brands.map(brand => (
                                    <BrandButton
                                        key={brand.id}
                                        brand={brand.name}
                                        logo={brand.logo}
                                        isActive={selectedBrand === brand.name}
                                        onClick={() => handleBrandSelect(brand.name, brand.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Price range filters */}
                    <div className="flex items-center mb-2 mt-3">
                        <span className="text-sm text-gray-600 mr-3">Khoảng giá: </span>
                        <div className="overflow-x-auto flex-grow">
                            <div className="flex space-x-2">
                                {priceRanges.map(range => (
                                    <button
                                        key={range.value}
                                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${priceRange === range.value
                                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                                            : 'border-gray-300 hover:border-blue-300'
                                            }`}
                                        onClick={() => handlePriceRangeSelect(range.value)}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sort options */}
                    <div className="flex items-center text-sm text-gray-600 mt-3">
                        <span className="mr-2">Sắp xếp theo:</span>
                        <div className="flex gap-2">
                            {sortOptions.map(option => (
                                <SortOption
                                    key={option}
                                    label={option}
                                    isActive={sortOption === option}
                                    onClick={() => setSortOption(option)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Active filters */}
                    {(selectedBrand || priceRange) && (
                        <div className="flex flex-wrap items-center mt-3 pt-3 border-t border-gray-100">
                            <span className="text-sm text-gray-600 mr-2">Bộ lọc: </span>

                            {selectedBrand && (
                                <div className="flex items-center bg-blue-50 text-blue-600 text-xs rounded-full px-3 py-1 mr-2">
                                    <span>{selectedBrand}</span>
                                    <button
                                        className="ml-1 text-gray-500 hover:text-gray-700"
                                        onClick={() => { setSelectedBrand(null); setSelectedBrandId(null); }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            {priceRange && (
                                <div className="flex items-center bg-blue-50 text-blue-600 text-xs rounded-full px-3 py-1">
                                    <span>{priceRanges.find(range => range.value === priceRange)?.label}</span>
                                    <button
                                        className="ml-1 text-gray-500 hover:text-gray-700"
                                        onClick={() => setPriceRange(null)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Loading state */}
                {loading && products.length === 0 && (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* No products found */}
                {!loading && products.length === 0 && (
                    <div className="bg-white p-10 rounded-lg shadow-sm text-center">
                        <p className="text-gray-600">Không tìm thấy sản phẩm nào phù hợp với bộ lọc</p>
                    </div>
                )}                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {displayedProducts.map((product, index) => (
                        <ProductCard key={`${product.id}-${index}`} product={product} />
                    ))}
                </div>

                {/* Load More Button - show only if there are more products to display */}
                {!loading && products.length > 0 && products.length < totalProducts && (
                    <div className="flex justify-center mt-8">
                        <button
                            className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                            onClick={handleLoadMore}
                        >
                            Xem thêm
                        </button>
                    </div>
                )}

                {/* Loading more indicator */}
                {loading && products.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListing;
