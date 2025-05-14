import React from "react";
import { Product } from "../types";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-all overflow-hidden">
            <div className="relative">
                {product.isPromotion && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md flex items-center">
                        <span className="text-yellow-300 mr-1">🔥</span>MỪNG GIỜ TỐ
                    </div>
                )}
                {product.isNew && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md">
                        Mẫu mới
                    </div>
                )}
                <div className="flex items-center justify-center h-40 p-4">
                    <img src={product.image} alt={product.name} className="h-full object-contain" />
                </div>
            </div>

            <div className="p-3">
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    {product.specs.processor && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded-sm">{product.specs.processor}</span>
                    )}
                    <img
                        src={`/images/logos/${product.brand.toLowerCase()}.png`}
                        alt={product.brand}
                        className="h-4 w-auto"
                    />
                </div>

                <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2 h-10">
                    {product.name}
                </h3>

                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs text-gray-600">{product.specs.ram}</span>
                    <span className="text-xs text-gray-600">{product.specs.storage}</span>
                </div>

                {product.price !== product.originalPrice ? (
                    <>
                        <div className="text-xs text-blue-600 font-medium">Online giá rẻ quá</div>
                        <div className="text-orange-600 font-semibold text-lg">
                            {product.price.toLocaleString()}₫
                        </div>
                        <div className="flex items-center text-xs space-x-1 text-gray-500">
                            <span className="line-through">{product.originalPrice.toLocaleString()}₫</span>
                            <span className="text-red-500">-{product.discountPercentage}%</span>
                        </div>
                    </>
                ) : (
                    <div className="text-orange-600 font-semibold text-lg">
                        {product.price.toLocaleString()}₫
                    </div>
                )}

                {product.giftValue && (
                    <div className="text-xs text-blue-700 mt-1">
                        Quà {product.giftValue.toLocaleString()}₫
                    </div>
                )}

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-xs">
                        <div className="text-yellow-400">⭐</div>
                        <span className="ml-1">{product.rating}</span>
                        <span className="mx-1">•</span>
                        <span className="text-gray-500">Đã bán {product.reviews}</span>
                    </div>

                    {product.hasComparison && (
                        <button className="text-blue-600 text-xs flex items-center">
                            <span>So sánh</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;