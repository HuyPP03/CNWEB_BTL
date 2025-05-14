import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { mockProducts } from '../data';

// Brand filter button component
const BrandButton: React.FC<{ brand: string; logo: string; isActive: boolean; onClick: () => void }> = ({
    brand,
    logo,
    isActive,
    onClick
}) => {
    return (
        <button
            className={`flex items-center px-3 py-2 rounded-full border transition-colors ${isActive ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-blue-300'
                }`}
            onClick={onClick}
        >
            {logo && <img src={logo} alt={`${brand} logo`} className="h-5 w-auto mr-1" />}
            {!logo && <span className="text-sm">{brand}</span>}
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

    // Sorting state
    const [sortOption, setSortOption] = useState<string>('Nổi bật');

    // Price filtering state
    const [priceRange, setPriceRange] = useState<string | null>(null);

    // State for visible products count
    const [visibleProducts, setVisibleProducts] = useState<number>(10);

    // NOTE: In a real implementation, we would call an API with the categoryId
    // For example: 
    // useEffect(() => {
    //     if (categoryId) {
    //         fetchProductsByCategory(categoryId);
    //     } else {
    //         fetchAllProducts();
    //     }
    // }, [categoryId]);

    const brands = [
        { name: 'ASUS', logo: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/9f/72/9f72697b78e17090628020cca9cce5e6.png' },
        { name: 'HP', logo: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/b2/11/b2118350c0f60b9ecb1e8ef65cb2de96.png' },
        { name: 'Dell', logo: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/c9/ea/c9eac61be9530e9c6c4404ba573086c4.png' },
        { name: 'Acer', logo: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/6a/6f/6a6f7e4792cdbc7946e58e539d1f05f1.png' },
        { name: 'MacBook', logo: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/f9/bf/f9bf13ff9843115d6edacf7ba01af389.png' },
        { name: 'Lenovo', logo: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/0b/90/0b907e4551b7ad8857426905ae627cad.png' },
        { name: 'MSI', logo: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/44/af/44af0b82dd48675388be5cf873c49393.png' },
        { name: 'Gigabyte', logo: 'https://cdnv2.tgdd.vn/mwg-static/common/Category/69/6f/696f3b1b67bbe449ff729b25784dfdfb.png' },
    ];

    const sortOptions = ['Nổi bật', 'Bán chạy', 'Giảm giá', 'Mới', 'Giá'];

    // Price range options
    const priceRanges = [
        { label: "Dưới 5 triệu", value: "under-5", min: 0, max: 5000000 },
        { label: "Từ 5 - 10 triệu", value: "5-10", min: 5000000, max: 10000000 },
        { label: "Từ 10 - 20 triệu", value: "10-20", min: 10000000, max: 20000000 },
        { label: "Từ 20 - 30 triệu", value: "20-30", min: 20000000, max: 30000000 },
        { label: "Trên 30 triệu", value: "over-30", min: 30000000, max: Infinity }
    ];    // First filter by category ID if provided (using the mock data structure for now)
    // In a real implementation, this would be an API call using categoryId
    const categoryFilteredProducts = categoryId
        ? mockProducts.filter(product => {
            // This is a mock implementation - in reality, products would have categoryId property
            // For now, we're mapping from the category string to an assumed ID based on our mappings
            const productCategoryId = product.category === 'smartphone' ? 1 :
                product.category === 'laptop' ? 2 :
                    product.category === 'smartwatch' ? 4 :
                        product.category === 'tablet' ? 6 :
                            product.category === 'audio' ? 48 : 0;

            return productCategoryId === categoryId;
        })
        : mockProducts;

    // Then filter by selected brand
    let filteredProducts = selectedBrand
        ? categoryFilteredProducts.filter(product => product.brand === selectedBrand)
        : categoryFilteredProducts;

    // Apply price filter if selected
    if (priceRange) {
        const selectedPriceRange = priceRanges.find(range => range.value === priceRange);
        if (selectedPriceRange) {
            filteredProducts = filteredProducts.filter(product =>
                product.price >= selectedPriceRange.min &&
                product.price <= selectedPriceRange.max
            );
        }
    }

    // Sort products based on selected option
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
            case 'Giảm giá':
                return b.discountPercentage - a.discountPercentage;
            case 'Giá':
                return a.price - b.price;
            case 'Bán chạy':
                return b.reviews - a.reviews;
            case 'Mới':
                return a.isNew ? -1 : b.isNew ? 1 : 0;
            default: // Nổi bật
                return (b.rating * 1000 + b.reviews) - (a.rating * 1000 + a.reviews);
        }
    });

    // Only show the number of products based on visibleProducts state
    const displayedProducts = sortedProducts.slice(0, visibleProducts);

    // Handle "Xem thêm" button click
    const handleLoadMore = () => {
        setVisibleProducts(prevCount => prevCount + 10);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-6">
                {/* Filter by brand */}
                <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                    <div className="flex items-center mb-2">
                        <button className="flex items-center text-gray-600 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span>Lọc</span>
                        </button>

                        <div className="overflow-x-auto flex-grow">
                            <div className="flex gap-2 pb-1">
                                {brands.map(brand => (
                                    <BrandButton
                                        key={brand.name}
                                        brand={brand.name}
                                        logo={brand.logo}
                                        isActive={selectedBrand === brand.name}
                                        onClick={() => setSelectedBrand(selectedBrand === brand.name ? null : brand.name)}
                                    />
                                ))}
                                <BrandButton
                                    brand="Laptop AI"
                                    logo=""
                                    isActive={selectedBrand === "Laptop AI"}
                                    onClick={() => setSelectedBrand(selectedBrand === "Laptop AI" ? null : "Laptop AI")}
                                />
                                <BrandButton
                                    brand="Laptop Gaming"
                                    logo=""
                                    isActive={selectedBrand === "Laptop Gaming"}
                                    onClick={() => setSelectedBrand(selectedBrand === "Laptop Gaming" ? null : "Laptop Gaming")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price range filters */}
                    <div className="flex items-center mb-2 mt-3">
                        <span className="text-sm text-gray-600 mr-3">Khoảng giá: </span>
                        <div className="overflow-x-auto flex-grow">
                            <div className="flex gap-2 pb-1">
                                {priceRanges.map((range) => (
                                    <button
                                        key={range.value}
                                        className={`px-3 py-1.5 rounded-full border transition-colors text-sm ${priceRange === range.value
                                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        onClick={() => setPriceRange(priceRange === range.value ? null : range.value)}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>                    {/* Sort options */}
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
                            <span className="text-sm text-gray-600 mr-2">Bộ lọc đã chọn:</span>

                            {selectedBrand && (
                                <div className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs mr-2 mb-1">
                                    <span>Thương hiệu: {selectedBrand}</span>
                                    <button
                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                        onClick={() => setSelectedBrand(null)}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            {priceRange && (
                                <div className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs mr-2 mb-1">
                                    <span>Giá: {priceRanges.find(r => r.value === priceRange)?.label}</span>
                                    <button
                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                        onClick={() => setPriceRange(null)}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            <button
                                className="text-xs text-blue-600 hover:text-blue-800 ml-auto underline"
                                onClick={() => {
                                    setSelectedBrand(null);
                                    setPriceRange(null);
                                }}
                            >
                                Xóa tất cả
                            </button>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {displayedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Load More Button - show only if there are more products to display */}
                {visibleProducts < sortedProducts.length && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleLoadMore}
                            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-md flex items-center"
                        >
                            <span>Xem thêm sản phẩm</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListing;
