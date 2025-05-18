import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product, ProductV2 } from "../types/product";
import wishlistService from "../services/wishlist.service";

// Helper function to extract product information from ProductV2
const extractProductInfo = (product: ProductV2) => {
    // Use the first variant for price information
    const mainVariant = product.productVariants && product.productVariants.length > 0
        ? product.productVariants[0]
        : null;

    // Get the main product image
    const mainImage = product.productImages && product.productImages.length > 0
        ? product.productImages.find(img => img.isPrimary)?.imageUrl || product.productImages[0].imageUrl
        : '';

    // Get processor, ram, storage from variant attributes if available
    let processor = '', ram = '', storage = '';
    if (mainVariant && mainVariant.variantAttributes) {
        mainVariant.variantAttributes.forEach(attr => {
            const attrName = attr.name.toLowerCase();
            if (attrName.includes('cpu') || attrName.includes('processor')) {
                processor = attr.attributeValue.value;
            } else if (attrName.includes('ram') || attrName.includes('memory')) {
                ram = attr.attributeValue.value;
            } else if (attrName.includes('storage') || attrName.includes('ssd') || attrName.includes('hdd')) {
                storage = attr.attributeValue.value;
            }
        });
    }

    // Check if there's a promotion
    const hasPromotion = product.productPromotions && product.productPromotions.length > 0;
    // Calculate discount percentage if discountPrice exists
    const originalPrice = mainVariant ? parseFloat(mainVariant.price) : 0;
    const currentPrice = mainVariant && mainVariant.discountPrice
        ? originalPrice - parseFloat(mainVariant.discountPrice)
        : originalPrice;

    // Calculate discount percentage
    const discountPercentage = originalPrice > 0 && currentPrice < originalPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0;

    // Generate random rating between 4 and 5
    const rating = (Math.random() * 1) + 4;

    // Generate random number of reviews between 500 and 10000
    const reviews = Math.floor(Math.random() * 9500) + 500;

    // Check if product is new (less than 30 days old)
    const isNew = new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Extract brand name from productVariants if available
    const brandId = product.brandId;

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: brandId.toString(),
        image: mainImage,
        specs: {
            processor,
            ram,
            storage
        },
        price: currentPrice,
        originalPrice: originalPrice,
        discountPercentage,
        isPromotion: hasPromotion,
        isNew,
        rating: rating.toFixed(1),
        reviews,
        // Optional gift value (mock for now)
        giftValue: hasPromotion ? Math.round(currentPrice * 0.1) : 0,
        hasComparison: true
    };
};

interface ProductCardProps {
    product: ProductV2 | Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // Check if product is ProductV2 and convert it if needed
    const isProductV2 = 'productVariants' in product;
    const productInfo = isProductV2
        ? extractProductInfo(product as ProductV2)
        : {
            ...product as Product,
            slug: undefined,
            rating: typeof (product as Product).rating === 'number'
                ? (product as Product).rating.toFixed(1)
                : (product as Product).rating,
        };

    // State for wishlist functionality
    const [inWishlist, setInWishlist] = useState<boolean>(false);
    const [wishlistId, setWishlistId] = useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Check if product is in wishlist
    useEffect(() => {
        const checkWishlist = async () => {
            try {
                const result = await wishlistService.checkInWishlist(productInfo.id);
                setInWishlist(result.inWishlist);
                setWishlistId(result.wishlistId);
            } catch (error) {
                console.error('Error checking wishlist status:', error);
            }
        };

        checkWishlist();
    }, [productInfo.id]);

    // Toggle wishlist status
    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to product detail
        e.stopPropagation(); // Prevent event bubbling

        if (isLoading) return;

        setIsLoading(true);
        try {
            if (inWishlist && wishlistId) {
                await wishlistService.removeFromWishlist(wishlistId);
                setInWishlist(false);
                setWishlistId(undefined);
            } else {
                const result = await wishlistService.addToWishlist(productInfo.id);
                setInWishlist(true);
                setWishlistId(result.id);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link to={`/product/${productInfo.slug || productInfo.id}`} className="block">
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-all overflow-hidden">
                <div className="relative">                    {productInfo.isPromotion && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md flex items-center z-10">
                        <span className="text-yellow-300 mr-1">🔥</span>MỪNG 1/6
                    </div>
                )}{productInfo.isNew && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md z-10">
                        Mẫu mới
                    </div>
                )}
                    <div className="flex items-center justify-center h-48 p-2 overflow-hidden">
                        <img
                            src={productInfo.image}
                            alt={productInfo.name}
                            className="h-full w-auto max-w-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>

                <div className="p-3">
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        {productInfo.specs.processor && (
                            <span className="px-2 py-0.5 bg-gray-100 rounded-sm">{productInfo.specs.processor}</span>
                        )}
                        {/* Brand logo removed as requested */}
                    </div>

                    <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2 h-10">
                        {productInfo.name}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs text-gray-600">{productInfo.specs.ram}</span>
                        <span className="text-xs text-gray-600">{productInfo.specs.storage}</span>
                    </div>

                    {productInfo.price !== productInfo.originalPrice ? (
                        <>
                            <div className="text-xs text-blue-600 font-medium">Online giá rẻ quá</div>
                            <div className="text-orange-600 font-semibold text-lg">
                                {productInfo.price.toLocaleString()}₫
                            </div>
                            <div className="flex items-center text-xs space-x-1 text-gray-500">
                                <span className="line-through">{productInfo.originalPrice.toLocaleString()}₫</span>
                                <span className="text-red-500">-{productInfo.discountPercentage}%</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-orange-600 font-semibold text-lg">
                            {productInfo.price.toLocaleString()}₫
                        </div>
                    )}

                    {productInfo.giftValue && (
                        <div className="text-xs text-blue-700 mt-1">
                            Quà {productInfo.giftValue.toLocaleString()}₫
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs">
                            <div className="text-yellow-400">⭐</div>
                            <span className="ml-1">{productInfo.rating}</span>
                            <span className="mx-1">•</span>
                            <span className="text-gray-500">Đã bán {productInfo.reviews}</span>
                        </div>

                        {/* Heart icon for wishlist instead of compare */}
                        <button
                            onClick={handleToggleWishlist}
                            className={`text-xs flex items-center justify-center h-6 w-6 rounded-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {inWishlist ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 hover:text-red-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;