import React, { useState } from 'react';

// Types
interface ProductImage {
    id: number;
    url: string;
    alt: string;
}

interface ProductSpec {
    name: string;
    value: string | number;
}

interface ProductPromotion {
    id: number;
    description: string;
    code?: string;
}

interface ProductWarranty {
    period: string;
    description: string;
}

interface RatingDistribution {
    rating: number;
    percentage: number;
}

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviewCount: number;
    ratingDistribution: RatingDistribution[];
    images: ProductImage[];
    specs: Record<string, ProductSpec[]>;
    promotions: ProductPromotion[];
    warranty: ProductWarranty;
    inStock: boolean;
    description: string;
}

// Sample data
const sampleProduct: Product = {
    id: 1,
    name: "MacBook Pro 14 inch Nano M4 16GB/512GB",
    price: 42090000,
    originalPrice: 43790000,
    discount: 10,
    rating: 5,
    reviewCount: 123,
    ratingDistribution: [
        { rating: 5, percentage: 100 },
        { rating: 4, percentage: 0 },
        { rating: 3, percentage: 0 },
        { rating: 2, percentage: 0 },
        { rating: 1, percentage: 0 }
    ],
    images: [
        { id: 1, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-1-638682285745176008-750x500.jpg", alt: "MacBook Pro 14 inch front view" },
        { id: 2, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-2-638682285755776945-750x500.jpg", alt: "MacBook Pro 14 inch side view" },
        { id: 3, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-3-638682285761712519-750x500.jpg", alt: "MacBook Pro 14 inch back view" },
    ],
    specs: {
        "processor": [
            { name: "CPU", value: "Apple M4" },
            { name: "Cores", value: 10 },
            { name: "Speed", value: "120 GB/s memory bandwidth" }
        ],
        "memory": [
            { name: "RAM", value: "16GB" },
            { name: "Storage", value: "512GB" }
        ],
        "display": [
            { name: "Size", value: "14 inch" },
            { name: "Technology", value: "Liquid Retina XDR" }
        ],
        "connectivity": [
            { name: "Ports", value: "Thunderbolt, HDMI, SD Card" }
        ],
        "physical": [
            { name: "Weight", value: "1.6 kg" },
            { name: "Battery", value: "Up to 18 hours" }
        ]
    },
    promotions: [
        { id: 1, description: "Gift voucher for water filter worth 300,000₫" },
        { id: 2, description: "Enter code VNPAYTGDD2 to get 80,000₫ to 150,000₫ off when paying with VNPAY-QR", code: "VNPAYTGDD2" }
    ],
    warranty: {
        period: "12 months",
        description: "Official warranty at authorized service centers"
    },
    inStock: true,
    description: "The most powerful MacBook Pro with the M4 chip delivers exceptional performance for demanding tasks like video editing, programming, and 3D rendering."
};

// Icons
const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

// const EmptyStarIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
//         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//     </svg>
// );

// const InfoCircleIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
// );

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const GiftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ProductDetailPage: React.FC = () => {
    const product = sampleProduct;
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeSpecTab, setActiveSpecTab] = useState<string>("processor");
    const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
    };

    const formatDiscount = (originalPrice: number, price: number): string => {
        const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
        return `-${discountPercent}%`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-gray-500 mb-6">
                <a href="#" className="hover:text-blue-600">Home</a>
                <ChevronRightIcon />
                <a href="#" className="hover:text-blue-600">Laptops</a>
                <ChevronRightIcon />
                <span className="text-gray-900">{product.name}</span>
            </nav>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                {/* Image gallery */}
                <div className="flex flex-col">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <img
                            src={product.images[selectedImageIndex].url}
                            alt={product.images[selectedImageIndex].alt}
                            className="w-full h-auto object-center object-cover"
                        />

                        {/* Discount badge */}
                        {product.originalPrice && (
                            <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                                {formatDiscount(product.originalPrice, product.price)}
                            </div>
                        )}
                    </div>

                    {/* Image thumbnails */}
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {product.images.map((image, idx) => (
                            <button
                                key={image.id}
                                onClick={() => setSelectedImageIndex(idx)}
                                className={`flex-none w-20 h-20 border-2 rounded ${selectedImageIndex === idx ? 'border-blue-500' : 'border-gray-200'
                                    }`}
                            >
                                <img
                                    src={image.url}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="w-full h-full object-center object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product info */}
                <div className="mt-10 px-4 sm:px-0 lg:mt-0">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>

                    {/* Ratings */}
                    <div className="mt-3 flex items-center">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, idx) => (
                                <StarIcon key={idx} />
                            ))}
                        </div>
                        <p className="ml-2 text-sm text-gray-500">{product.reviewCount} reviews</p>
                    </div>

                    {/* Price */}
                    <div className="mt-4">
                        <div className="flex items-center">
                            <h2 className="text-2xl font-bold text-red-600">{formatCurrency(product.price)}</h2>
                            {product.originalPrice && (
                                <p className="ml-3 text-lg text-gray-500 line-through">{formatCurrency(product.originalPrice)}</p>
                            )}
                        </div>
                    </div>

                    {/* Promotions section */}
                    <div className="mt-6 border border-orange-300 rounded-lg bg-orange-50 p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Special Offers</h3>
                        <ul className="space-y-3">
                            {product.promotions.map(promo => (
                                <li key={promo.id} className="flex items-start">
                                    <span className="flex-shrink-0 pt-1">
                                        <GiftIcon />
                                    </span>
                                    <span className="ml-2 text-sm">
                                        {promo.description}
                                        {promo.code && (
                                            <span className="font-mono font-medium text-blue-600 ml-1">{promo.code}</span>
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Warranty */}
                    <div className="mt-6 flex items-start">
                        <ShieldIcon />
                        <div className="ml-3">
                            <h4 className="font-semibold text-gray-900">Official Warranty</h4>
                            <p className="text-sm text-gray-600">{product.warranty.period} - {product.warranty.description}</p>
                        </div>
                    </div>

                    {/* Call to action */}
                    <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button className="flex-1 bg-blue-600 py-3 px-8 rounded-lg text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Buy Now
                        </button>
                        <button className="flex-1 flex justify-center items-center bg-gray-100 py-3 px-8 rounded-lg text-gray-900 font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                            <CartIcon />
                            <span className="ml-2">Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs for Specs and Reviews */}
            <div className="mt-16">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`py-4 px-1 font-medium text-base whitespace-nowrap border-b-2 ${activeTab === 'specs'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Technical Specifications
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`py-4 px-1 font-medium text-base whitespace-nowrap border-b-2 ${activeTab === 'reviews'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Reviews & Ratings
                        </button>
                    </nav>
                </div>

                {/* Product specs */}
                {activeTab === 'specs' && (
                    <div className="mt-6">
                        {/* Spec navigation tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 overflow-x-auto">
                                {Object.keys(product.specs).map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveSpecTab(category)}
                                        className={`py-4 px-1 text-center border-b-2 font-medium text-sm whitespace-nowrap ${activeSpecTab === category
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Spec details */}
                        <div className="mt-6">
                            <dl className="space-y-4">
                                {product.specs[activeSpecTab].map((spec, idx) => (
                                    <div key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-lg`}>
                                        <dt className="text-sm font-medium text-gray-500">{spec.name}</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{spec.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Product description */}
                        <div className="mt-10">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Product Description</h2>
                            <div className="prose prose-blue max-w-none">
                                <p className="text-gray-700">{product.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews section */}
                {activeTab === 'reviews' && (
                    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Đánh giá Laptop MacBook Pro 14 inch Nano M4 16GB/512GB
                            </h2>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start">
                                {/* Left side - Overall rating */}
                                <div className="flex flex-col items-center mb-6 sm:mb-0 sm:mr-12">
                                    <div className="flex items-baseline">
                                        <span className="text-yellow-400 text-4xl font-bold">5</span>
                                        <span className="text-gray-500 text-lg">/5</span>
                                    </div>
                                    <div className="flex mt-1">
                                        {[...Array(5)].map((_, idx) => (
                                            <StarIcon key={idx} />
                                        ))}
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">123 khách hài lòng</p>
                                </div>

                                {/* Right side - Rating distribution */}
                                <div className="flex-1 w-full max-w-md">
                                    {product.ratingDistribution.map((item) => (
                                        <div key={item.rating} className="flex items-center mb-2">
                                            <span className="text-sm text-gray-600 w-6">{item.rating}</span>
                                            <div className="flex items-center ml-2 w-6">
                                                <StarIcon />
                                            </div>
                                            <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-12 text-right">{item.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit review button */}
                            <div className="mt-8 flex justify-center sm:justify-start">
                                <button className="bg-blue-600 text-white font-medium py-3 px-10 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Viết đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Related products */}
            <div className="mt-16">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className="group border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                                <img src={`https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-2-638682285755776945-750x500.jpg`} alt={`Product ${idx}`} className="h-full w-full object-cover object-center" />
                            </div>
                            <h3 className="text-sm text-gray-700 font-medium">
                                {idx === 1 ? "MacBook Pro 14 inch" : idx === 2 ? "iPhone 15 Pro Max" : idx === 3 ? "iPad Air" : "AirPods Pro"}
                            </h3>
                            <p className="mt-1 text-sm font-bold text-gray-900">
                                {formatCurrency(idx === 1 ? 42090000 : idx === 2 ? 29990000 : idx === 3 ? 18990000 : 6990000)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;