import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../data/products';
import {
    ChevronRight, Star, Check, Heart, Phone,
    ShoppingCart, ShoppingBag, Gift, Shield, Truck
} from 'lucide-react';
import { Product } from '../types';
import productService from '../services/product.service';
import { ProductV2, ProductVariant, AttributeType } from '../types/product';
import ProductReviews from '../components/ProductReviews';
import wishlistService from '../services/wishlist.service';
import cartService from '../services/cart.service';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

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

// Định nghĩa kiểu dữ liệu cho specs với các category động từ API
interface DetailedProductInfo {
    images: ProductImage[];
    specs: Record<string, ProductSpec[]>;
    promotions: ProductPromotion[];
    warranty: ProductWarranty;
    inStock: boolean;
    description: string;
}

// Sample data for detailed product information
const sampleDetailedInfo: DetailedProductInfo = {
    images: [
        { id: 1, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-1-638682285745176008-750x500.jpg", alt: "MacBook Pro 14 inch front view" },
        { id: 2, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-2-638682285755776945-750x500.jpg", alt: "MacBook Pro 14 inch side view" },
        { id: 3, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-3-638682285761712519-750x500.jpg", alt: "MacBook Pro 14 inch back view" },
        { id: 4, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-4-638682285767856306-750x500.jpg", alt: "MacBook Pro 14 inch keyboard" },
        { id: 5, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-5-638682285776811668-750x500.jpg", alt: "MacBook Pro 14 inch ports" },
    ],
    specs: {
        "cấu hình chi tiết": [
            { name: "CPU", value: "Apple M4 Pro 12 nhân" },
            { name: "RAM", value: "36GB" },
            { name: "Ổ cứng", value: "1TB SSD" },
            { name: "Màn hình", value: "14.2 inch, Liquid Retina XDR display (3024 x 1964)" },
            { name: "Card màn hình", value: "Apple M4 Pro 20 core GPU" },
            { name: "Cổng kết nối", value: "3 x Thunderbolt 4, HDMI, jack tai nghe 3.5 mm, SD card slot" },
            { name: "Hệ điều hành", value: "macOS 14 Sequoia" },
            { name: "Thiết kế", value: "Vỏ kim loại nguyên khối" },
            { name: "Kích thước", value: "31.26 x 22.12 x 1.55 cm" },
            { name: "Trọng lượng", value: "1.55 kg" },
            { name: "Thời điểm ra mắt", value: "2024" },
        ],
        "thiết kế & trọng lượng": [
            { name: "Chất liệu", value: "Nhôm tái chế" },
            { name: "Kích thước", value: "31.26 x 22.12 x 1.55 cm" },
            { name: "Trọng lượng", value: "1.55 kg" },
            { name: "Màu sắc", value: "Space Black (Đen)" },
        ],
        "pin & sạc": [
            { name: "Dung lượng pin", value: "70Whr" },
            { name: "Công nghệ pin", value: "Lithium polymer" },
            { name: "Thời gian sử dụng", value: "Lên đến 18 giờ" },
            { name: "Công suất sạc", value: "96W" },
            { name: "Cổng sạc", value: "MagSafe 3" },
        ],
    },
    promotions: [
        { id: 1, description: "Tặng Balo Laptop trị giá 790.000₫" },
        { id: 2, description: "Giảm 100.000₫ khi mua kèm Office Home & Student" },
        { id: 3, description: "Nhập mã VNPAY giảm thêm đến 200.000₫ khi thanh toán qua VNPAY-QR", code: "VNPAYTGDD" },
        { id: 4, description: "Trả góp 0% qua thẻ tín dụng" },
    ],
    warranty: {
        period: "12 tháng",
        description: "Bảo hành chính hãng tại các trung tâm bảo hành Apple"
    },
    inStock: true,
    description: `
<h3>Hiệu năng đột phá mọi giới hạn</h3>
<p>Apple M4 Pro là bộ vi xử lý hiện đại nhất của Apple, được thiết kế riêng cho dòng MacBook Pro, mang đến hiệu suất ấn tượng cho các công việc đòi hỏi sức mạnh xử lý cao như biên tập video 4K, phát triển ứng dụng, thiết kế đồ họa 3D và nhiều tác vụ phức tạp khác.</p>
<p>Với 12 nhân CPU (8 nhân hiệu suất cao và 4 nhân tiết kiệm điện), 20 nhân GPU và 16 nhân Neural Engine, M4 Pro mang đến hiệu suất vượt trội so với thế hệ trước đến 50% về khả năng xử lý và 40% về khả năng đồ họa.</p>
<img src="https://cdn.tgdd.vn/Products/Images/44/331568/macbook-pro-14-inch-m4-pro-den-6.jpg" alt="Apple M4 Pro Performance" />

<h3>Màn hình Liquid Retina XDR - Trải nghiệm hình ảnh đỉnh cao</h3>
<p>MacBook Pro 14 inch được trang bị màn hình Liquid Retina XDR với độ phân giải 3024 x 1964, hỗ trợ đầy đủ công nghệ ProMotion với tần số quét lên đến 120Hz, mang đến trải nghiệm cuộn trang mượt mà và phản hồi nhanh chóng.</p>
<p>Độ sáng tối đa lên đến 1600 nits khi xem nội dung HDR giúp hiển thị hình ảnh sống động, chi tiết với dải màu rộng P3 và công nghệ True Tone tự động điều chỉnh nhiệt độ màu phù hợp với môi trường xung quanh.</p>

<h3>Thời lượng pin ấn tượng</h3>
<p>Mặc dù sở hữu sức mạnh vượt trội, MacBook Pro 14 inch vẫn mang đến thời lượng sử dụng lên đến 18 giờ cho việc duyệt web không dây và 22 giờ cho việc xem phim trên Apple TV, cho phép bạn làm việc cả ngày mà không cần sạc pin.</p>

<h3>Kết nối đa dạng và tiện lợi</h3>
<p>MacBook Pro 14 inch được trang bị đầy đủ các cổng kết nối cần thiết: 3 cổng Thunderbolt 4, cổng HDMI, khe thẻ nhớ SDXC, jack tai nghe 3.5mm và cổng sạc MagSafe 3, mang đến sự tiện lợi tối đa cho người dùng chuyên nghiệp.</p>

<h3>Bàn phím và TouchID</h3>
<p>Bàn phím Magic Keyboard với hành trình phím thoải mái, độ nảy tốt cùng công nghệ cảm biến vân tay TouchID giúp mở khóa máy và thanh toán trực tuyến an toàn, nhanh chóng. Touchpad Force Touch rộng rãi với nhiều thao tác đa điểm và phản hồi xúc giác chính xác.</p>
    `
};

const ProductDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [apiProduct, setApiProduct] = useState<ProductV2 | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'mô tả' | 'đánh giá' | 'thông số'>('mô tả');
    const [variantLoading, setVariantLoading] = useState<boolean>(false);
    const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
    const [attributesLoading, setAttributesLoading] = useState<boolean>(false);
    const [relatedProducts, setRelatedProducts] = useState<ProductV2[]>([]);
    const [relatedProductsLoading, setRelatedProductsLoading] = useState<boolean>(false);
    const [inWishlist, setInWishlist] = useState<boolean>(false);
    const [wishlistId, setWishlistId] = useState<number | undefined>(undefined);
    const [wishlistLoading, setWishlistLoading] = useState<boolean>(false);
    const { isAuthenticated } = useAuth();

    // Fetch product from API based on slug
    useEffect(() => {
        const fetchProduct = async () => {
            if (slug) {
                try {
                    setLoading(true);
                    const response = await productService.getProductBySlug(slug);
                    console.log('API response:', response);

                    if (response.data && response.data.length > 0) {
                        const productData = response.data[0];
                        setApiProduct(productData);

                        // Set default selected variant to the first one
                        if (productData.productVariants && productData.productVariants.length > 0) {
                            setSelectedVariant(productData.productVariants[0]);
                        }

                        // Also set fallback product for existing UI components
                        const mockProductData = mockProducts.find(p => p.id === 1) || mockProducts[0];
                        setProduct(mockProductData);
                        // Fetch attribute types for this product's category
                        if (productData.categoryId) {
                            fetchAttributeTypes(productData.categoryId, productData.productVariants[0]?.id);
                        }
                    } else {
                        setError('Không tìm thấy sản phẩm');
                    }
                } catch (err) {
                    console.error('Error fetching product:', err);
                    setError('Có lỗi xảy ra khi tải sản phẩm');

                    // Fallback to mock data
                    const mockProductData = mockProducts.find(p => p.id === 1) || mockProducts[0];
                    setProduct(mockProductData);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProduct();
    }, [slug]);

    // Fetch attribute types for the product category
    const fetchAttributeTypes = async (categoryId: number, variantId?: number) => {
        try {
            setAttributesLoading(true);
            const response = await productService.getAttributeTypesByCategoryId(categoryId, variantId);
            console.log('Attribute types response:', response);

            if (response.data) {
                setAttributeTypes(response.data);
            }
        } catch (err) {
            console.error('Error fetching attribute types:', err);
        } finally {
            setAttributesLoading(false);
        }
    };


    // Fetch related products with the same category
    useEffect(() => {
        const fetchRelatedProducts = async (categoryId: number, currentProductId: number) => {
            try {
                setRelatedProductsLoading(true);
                const response = await productService.getProducts({
                    categoryId: categoryId,
                    limit: 5
                });

                if (response.data) {
                    // Filter out the current product and limit to 5 items
                    const filteredProducts = response.data
                        .filter(p => p.id !== currentProductId)
                        .slice(0, 5);

                    setRelatedProducts(filteredProducts);
                }
            } catch (err) {
                console.error('Error fetching related products:', err);
                // Fallback to empty array
                setRelatedProducts([]);
            } finally {
                setRelatedProductsLoading(false);
            }
        };

        fetchRelatedProducts(apiProduct?.categoryId || 0, apiProduct?.id || 0);
    }, [apiProduct?.categoryId, apiProduct?.id]);

    // Check if product is in wishlist when component mounts
    useEffect(() => {
        const checkWishlistStatus = async () => {
            if (!isAuthenticated || !apiProduct?.id) return;

            try {
                setWishlistLoading(true);
                const result = await wishlistService.checkInWishlist(apiProduct.id);
                setInWishlist(result.inWishlist);
                setWishlistId(result.wishlistId);
            } catch (error) {
                console.error('Error checking wishlist status:', error);
            } finally {
                setWishlistLoading(false);
            }
        };

        checkWishlistStatus();
    }, [apiProduct?.id, isAuthenticated]);

    // Toggle wishlist function
    const handleToggleWishlist = async () => {
        if (!isAuthenticated) {
            // Show notification to login
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích', {
                position: 'top-right',
                autoClose: 3000
            });
            return;
        }

        if (!apiProduct?.id) return;

        try {
            setWishlistLoading(true);

            if (inWishlist && wishlistId) {
                // Remove from wishlist
                await wishlistService.removeFromWishlist(wishlistId);
                setInWishlist(false);
                setWishlistId(undefined);
                toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích', {
                    position: 'top-right',
                    autoClose: 2000
                });
            } else {
                // Add to wishlist
                const result = await wishlistService.addToWishlist(apiProduct.id);
                setInWishlist(true);
                setWishlistId(result.id);
                toast.success('Đã thêm sản phẩm vào danh sách yêu thích', {
                    position: 'top-right',
                    autoClose: 2000
                });
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau', {
                position: 'top-right',
                autoClose: 3000
            });
        } finally {
            setWishlistLoading(false);
        }
    };

    // Fetch detailed variant information when a variant is selected
    useEffect(() => {
        const fetchVariantDetails = async () => {
            if (selectedVariant?.id) {
                try {
                    setVariantLoading(true);
                    const response = await productService.getProductVariants({ id: selectedVariant.id });
                    console.log('Variant details response:', response);

                    if (response.data && response.data.length > 0) {
                        // Update the selected variant with more detailed information
                        setSelectedVariant(response.data[0]);

                        // Also refresh attribute types with the selected variant ID
                        if (apiProduct?.categoryId) {
                            fetchAttributeTypes(apiProduct.categoryId, selectedVariant.id);
                        }
                    }
                } catch (err) {
                    console.error('Error fetching variant details:', err);
                } finally {
                    setVariantLoading(false);
                }
            }
        };

        fetchVariantDetails();
    }, [selectedVariant?.id, apiProduct?.categoryId]);

    const formatCurrency = (amount: number | string): string => {
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('vi-VN').format(numericAmount) + '₫';
    };

    // Add to cart function
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', {
                position: 'top-right',
                autoClose: 3000
            });
            return;
        }

        if (!selectedVariant?.id) {
            toast.error('Vui lòng chọn phiên bản sản phẩm', {
                position: 'top-right',
                autoClose: 3000
            });
            return;
        }

        try {
            const response = await cartService.addToCart({
                variantId: selectedVariant.id,
                quantity: 1
            });

            console.log('Added to cart:', response);
            toast.success('Đã thêm sản phẩm vào giỏ hàng', {
                position: 'top-right',
                autoClose: 2000
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng', {
                position: 'top-right',
                autoClose: 3000
            });
        }
    };

    // Generate spec data from variant attributes using attribute types
    const getSpecsFromVariant = (variant: ProductVariant | null): Record<string, ProductSpec[]> => {
        // Default specs from sample data
        const defaultSpecs = sampleDetailedInfo.specs;

        if (!variant || !variant.variantAttributes) {
            return defaultSpecs;
        }

        // Create mapping structures for attributeTypes
        const categorizedSpecs: Record<string, ProductSpec[]> = {};

        // Maps for parent-child relationships
        const parentAttributeMap: Record<number, string> = {};  // Maps parent ID to category name
        const subAttributeMap: Record<number, number> = {};     // Maps sub-attribute ID to parent ID
        const attributeTypeNameMap: Record<number, string> = {}; // Maps attribute type ID to its name

        // Build the maps from attributeTypes structure
        if (attributeTypes.length > 0) {
            attributeTypes.forEach(parentAttr => {
                // Store the parent attribute's name by its ID
                parentAttributeMap[parentAttr.id] = parentAttr.name;

                // Initialize the category in the result object
                categorizedSpecs[parentAttr.name] = [];

                // Process sub-attributes
                if (parentAttr.subAttributes) {
                    parentAttr.subAttributes.forEach(subAttr => {
                        // Map each sub-attribute to its parent
                        subAttributeMap[subAttr.id] = parentAttr.id;
                        // Also store the sub-attribute name for lookup
                        attributeTypeNameMap[subAttr.id] = subAttr.name;
                    });
                }
            });
        }

        // Process variant attributes and categorize them
        if (variant.variantAttributes.length > 0) {
            variant.variantAttributes.forEach(attr => {
                // Create a spec object from the attribute
                const attrSpec = { name: attr.name, value: attr.attributeValue.value };
                let placed = false;

                // Try to find the attribute's category through its attribute type ID
                const parentAttributeId = subAttributeMap[attr.attributeTypeId];

                if (parentAttributeId && parentAttributeMap[parentAttributeId]) {
                    // We found the parent category for this attribute
                    const categoryName = parentAttributeMap[parentAttributeId];

                    // Make sure the category array exists
                    if (!categorizedSpecs[categoryName]) {
                        categorizedSpecs[categoryName] = [];
                    }

                    // Add the spec to its category
                    categorizedSpecs[categoryName].push(attrSpec);
                    placed = true;
                } else {
                    // Alternative approach: Try to match by attribute names
                    const attrNameLower = attr.name.toLowerCase();

                    // Try to place attribute by its name matching possible parent categories
                    for (const parentId in parentAttributeMap) {
                        const parentName = parentAttributeMap[parentId].toLowerCase();

                        // Check if the attribute name contains any part of the parent category name
                        if (attrNameLower.includes(parentName) ||
                            // Special case matches based on common terms
                            (parentName.includes('cấu hình') && (
                                attrNameLower.includes('cpu') ||
                                attrNameLower.includes('ram') ||
                                attrNameLower.includes('bộ nhớ')
                            )) ||
                            (parentName.includes('thiết kế') && (
                                attrNameLower.includes('chất liệu') ||
                                attrNameLower.includes('kích thước') ||
                                attrNameLower.includes('trọng lượng')
                            )) ||
                            (parentName.includes('pin') && (
                                attrNameLower.includes('sạc') ||
                                attrNameLower.includes('battery')
                            )) ||
                            (parentName.includes('kết nối') && (
                                attrNameLower.includes('wifi') ||
                                attrNameLower.includes('bluetooth') ||
                                attrNameLower.includes('cổng')
                            )) ||
                            (parentName.includes('màn hình') && (
                                attrNameLower.includes('display') ||
                                attrNameLower.includes('độ phân giải')
                            ))
                        ) {
                            const categoryName = parentAttributeMap[parentId];

                            // Make sure the category array exists
                            if (!categorizedSpecs[categoryName]) {
                                categorizedSpecs[categoryName] = [];
                            }

                            // Add the spec to its category
                            categorizedSpecs[categoryName].push(attrSpec);
                            placed = true;
                            break;
                        }
                    }

                    // If still not placed, try to match with standard categories
                    if (!placed) {
                        const attrNameLower = attr.name.toLowerCase();

                        if (attrNameLower.includes('cpu') ||
                            attrNameLower.includes('chip') ||
                            attrNameLower.includes('ram') ||
                            attrNameLower.includes('bộ nhớ') ||
                            attrNameLower.includes('ổ cứng') ||
                            attrNameLower.includes('gpu') ||
                            attrNameLower.includes('đồ họa') ||
                            attrNameLower.includes('hệ điều hành') ||
                            attrNameLower.includes('os')) {

                            if (!categorizedSpecs["Cấu hình chi tiết"]) {
                                categorizedSpecs["Cấu hình chi tiết"] = [];
                            }
                            categorizedSpecs["Cấu hình chi tiết"].push(attrSpec);
                            placed = true;
                        }
                        else if (attrNameLower.includes('thiết kế') ||
                            attrNameLower.includes('chất liệu') ||
                            attrNameLower.includes('kích thước') ||
                            attrNameLower.includes('trọng lượng') ||
                            attrNameLower.includes('màu sắc')) {

                            if (!categorizedSpecs["Thiết kế & trọng lượng"]) {
                                categorizedSpecs["Thiết kế & trọng lượng"] = [];
                            }
                            categorizedSpecs["Thiết kế & trọng lượng"].push(attrSpec);
                            placed = true;
                        }
                        else if (attrNameLower.includes('pin') ||
                            attrNameLower.includes('battery') ||
                            attrNameLower.includes('sạc') ||
                            attrNameLower.includes('charging')) {

                            if (!categorizedSpecs["Pin & sạc"]) {
                                categorizedSpecs["Pin & sạc"] = [];
                            }
                            categorizedSpecs["Pin & sạc"].push(attrSpec);
                            placed = true;
                        }
                    }
                }

                // If we couldn't categorize the attribute, put it in a default "Khác" category
                if (!placed) {
                    if (!categorizedSpecs["Khác"]) {
                        categorizedSpecs["Khác"] = [];
                    }
                    categorizedSpecs["Khác"].push(attrSpec);
                }
            });
        }

        // If any of the categories are empty, check if we can populate from default specs
        if (Object.keys(categorizedSpecs).length === 0 ||
            (categorizedSpecs["Cấu hình chi tiết"]?.length === 0 &&
                categorizedSpecs["Thiết kế & trọng lượng"]?.length === 0 &&
                categorizedSpecs["Pin & sạc"]?.length === 0)) {
            return defaultSpecs;
        }

        // Sort specs in each category by name
        for (const category in categorizedSpecs) {
            categorizedSpecs[category].sort((a, b) => a.name.localeCompare(b.name));
        }

        // Prioritize key specs to be first in their categories
        const keySpecOrder = ['cpu', 'ram', 'storage', 'screen', 'os', 'gpu', 'pin'];

        // Move important specs to the beginning of their respective categories
        Object.keys(categorizedSpecs).forEach(category => {
            categorizedSpecs[category].sort((a, b) => {
                const aNameLower = a.name.toLowerCase();
                const bNameLower = b.name.toLowerCase();

                // Give priority to key specs
                const aKeywordIndex = keySpecOrder.findIndex(keyword => aNameLower.includes(keyword));
                const bKeywordIndex = keySpecOrder.findIndex(keyword => bNameLower.includes(keyword));

                if (aKeywordIndex !== -1 && bKeywordIndex !== -1) {
                    return aKeywordIndex - bKeywordIndex;
                } else if (aKeywordIndex !== -1) {
                    return -1;
                } else if (bKeywordIndex !== -1) {
                    return 1;
                }

                // Alphabetical order for other specs
                return aNameLower.localeCompare(bNameLower);
            });
        });

        return categorizedSpecs;
    };

    // Get variant specific specs
    const variantSpecs = getSpecsFromVariant(selectedVariant);

    // State for related products    
    // Fetch related products when the apiProduct changes
    useEffect(() => {
        const getRelatedProducts = async () => {
            if (apiProduct?.categoryId && apiProduct.id) {
                try {
                    setRelatedProductsLoading(true);
                    const response = await productService.getProducts({
                        categoryId: apiProduct.categoryId,
                        limit: 10 // Fetch more to allow filtering
                    });

                    if (response.data) {
                        // Filter out the current product and limit to 5 items
                        const filteredProducts = response.data
                            .filter(p => p.id !== apiProduct.id)
                            .slice(0, 5);

                        setRelatedProducts(filteredProducts);
                    }
                } catch (err) {
                    console.error('Error fetching related products:', err);
                    // Fallback to empty array
                    setRelatedProducts([]);
                } finally {
                    setRelatedProductsLoading(false);
                }
            }
        };

        getRelatedProducts();
    }, [apiProduct?.categoryId, apiProduct?.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    if (!apiProduct) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">Không tìm thấy sản phẩm</div>
            </div>
        );
    }

    // Extract API data
    const productName = selectedVariant?.name || apiProduct.name || '';
    const productPrice = selectedVariant?.price ? parseFloat(selectedVariant.price) : (apiProduct.basePrice ? parseFloat(apiProduct.basePrice) : 0);
    const productDescription = apiProduct.description || sampleDetailedInfo.description;
    const productImages = apiProduct.productImages?.length ?
        apiProduct.productImages.map((img, index) => ({
            id: img.id,
            url: img.imageUrl,
            alt: `${productName} - Hình ${index + 1}`
        })) : sampleDetailedInfo.images;
    // pussh all images from product variants 
    productImages.push(...(selectedVariant?.productImages || []).map((img, index) => ({
        id: img.id,
        url: img.imageUrl,
        alt: `${productName} - Hình ${index + 1}`
    })));

    // Use product category and brand from API if available
    const productCategory = product?.category || 'other';  // Fallback to mock data
    // const productBrand = product?.brand || '';  // Fallback to mock data

    return (
        <div className="bg-gray-100 pb-10">
            {/* Breadcrumb */}
            <div className="bg-white py-2 shadow-sm mb-4">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center text-sm text-gray-500">
                        <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                        <ChevronRight className="mx-1" size={14} />
                        <Link to={`/${productCategory}`} className="hover:text-blue-600">
                            {productCategory === 'laptop' ? 'Laptop' :
                                productCategory === 'smartphone' ? 'Điện thoại' :
                                    productCategory === 'smartwatch' ? 'Đồng hồ thông minh' :
                                        productCategory === 'audio' ? 'Tai nghe' :
                                            productCategory}
                        </Link>
                        {/* <ChevronRight className="mx-1" size={14} /> */}
                        {/* <Link to={`/brand/${productBrand.toLowerCase()}`} className="hover:text-blue-600">{productBrand}</Link> */}
                        <ChevronRight className="mx-1" size={14} />
                        <span className="text-gray-900 truncate max-w-xs">{productName}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Product title - Mobile view */}
                <h1 className="text-xl font-bold text-gray-900 mb-2 md:hidden">{productName}</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                    {/* Left column - Image gallery - Now 8/12 instead of 5/12 */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-lg p-4 mb-4">
                            {/* Product title - Desktop view */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-4 hidden md:block">{productName}</h1>

                            <div className="relative bg-white rounded-lg overflow-hidden mb-4">
                                <div className="aspect-w-1 aspect-h-1">
                                    <img
                                        src={productImages[selectedImageIndex].url}
                                        alt={productImages[selectedImageIndex].alt}
                                        className="w-full h-auto object-contain"
                                    />
                                </div>                                {/* Discount badge */}
                                {(selectedVariant?.discountPrice &&
                                    parseFloat(selectedVariant.discountPrice) > 0) && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                                            Giảm giá
                                        </div>
                                    )}
                            </div>

                            {/* Image thumbnails */}
                            <div className="grid grid-cols-5 gap-2">
                                {productImages.map((image, idx) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`border rounded-md p-1 transition-all ${selectedImageIndex === idx ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="w-full h-auto object-contain aspect-square"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Specifications overview - Mobile only */}
                        <div className="bg-white rounded-lg p-4 mb-4 lg:hidden">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-lg">Thông số kỹ thuật</h3>
                                <button
                                    onClick={() => setActiveTab('thông số')}
                                    className="text-blue-500 flex items-center text-sm"
                                >
                                    Xem tất cả
                                    <ChevronRight className="ml-1" size={16} />
                                </button>
                            </div>

                            {attributesLoading || variantLoading ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Display a few key specs from the first available category */}
                                    {Object.keys(variantSpecs).length > 0 && (
                                        <>
                                            {/* Get the first category (usually most important config specs) */}
                                            {(() => {
                                                const firstCategory = Object.keys(variantSpecs)[0];
                                                const specs = variantSpecs[firstCategory];

                                                return (
                                                    <>
                                                        {/* Show first 4 specs as a preview */}
                                                        {specs.slice(0, 4).map((spec, idx) => (
                                                            <div key={idx} className="flex">
                                                                <span className="text-gray-500 w-32">{spec.name}:</span>
                                                                <span className="text-gray-900 font-medium">{spec.value}</span>
                                                            </div>
                                                        ))}
                                                    </>
                                                );
                                            })()}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column - Product info - Now 4/12 instead of 7/12 */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-lg p-4 mb-4">
                            {/* Price */}
                            <div className="mb-4">
                                <div className="flex items-end">
                                    <h2 className="text-3xl font-bold text-red-600">{formatCurrency(productPrice)}</h2>                                    {selectedVariant?.discountPrice && parseFloat(selectedVariant.discountPrice) > 0 && (
                                        <div className="flex items-center ml-3">
                                            <p className="text-gray-500 line-through">{formatCurrency(selectedVariant.discountPrice)}</p>
                                            <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-1.5 py-0.5 rounded">
                                                -{Math.round(((parseFloat(selectedVariant.discountPrice) - parseFloat(selectedVariant.price)) / parseFloat(selectedVariant.discountPrice)) * 100)}%
                                            </span>
                                        </div>
                                    )}
                                </div>                                {/* Rating */}
                                <div className="flex items-center mt-2">
                                    <div className="flex">                                        {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={16}
                                            fill={star <= 4 ? "#FFC107" : "none"}
                                            color={star <= 4 ? "#FFC107" : "#E5E7EB"}
                                        />
                                    ))}
                                    </div>
                                    <span className="text-sm text-gray-500 ml-2">0 đánh giá</span>
                                </div>
                            </div>

                            {/* Product variants */}
                            {apiProduct?.productVariants && apiProduct.productVariants.length > 1 && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-700 mb-2">Phiên bản</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {apiProduct.productVariants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`border-2 py-2 px-3 rounded-lg text-gray-700 text-sm font-medium flex flex-col items-center ${selectedVariant?.id === variant.id ? 'border-blue-500' : 'border-gray-200'}`}
                                            >
                                                <span>{variant.slug}</span>
                                                <span className="font-bold">{formatCurrency(variant.price)}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color options */}
                            {/* {(apiProduct.categoryId === 1 || apiProduct.categoryId === 2) && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-700 mb-2">Màu sắc</h3>
                                    <div className="flex space-x-2">
                                        <button className="border-2 border-blue-500 p-1 rounded-full">
                                            <div className="w-8 h-8 bg-black rounded-full"></div>
                                        </button>
                                        <button className="border-2 border-transparent p-1 rounded-full">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                        </button>
                                        <button className="border-2 border-transparent p-1 rounded-full">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                                        </button>
                                    </div>
                                </div>
                            )} */}

                            {/* Promotions */}
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-700 mb-2">Khuyến mãi</h3>
                                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                                    <ul className="space-y-3">
                                        {/* Use API promotions if available */}
                                        {apiProduct?.productPromotions && apiProduct.productPromotions.length > 0 ? (
                                            apiProduct.productPromotions.map((promo, idx) => (
                                                <li key={promo.promotionId} className="flex">
                                                    <span className="flex-shrink-0 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-sm text-gray-800">
                                                        {promo.promotion.name}
                                                        {promo.promotion.discountCode && (
                                                            <span className="font-medium text-blue-600 ml-1">{promo.promotion.discountCode}</span>
                                                        )}
                                                    </span>
                                                </li>
                                            ))
                                        ) : null}
                                        {/* Fallback to sample promotions */}
                                        {sampleDetailedInfo.promotions.map(promo => (
                                            <li key={promo.id} className="flex">
                                                <span className="flex-shrink-0 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                                                    {promo.id}
                                                </span>
                                                <span className="text-sm text-gray-800">
                                                    {promo.description}
                                                    {promo.code && (
                                                        <span className="font-medium text-blue-600 ml-1">{promo.code}</span>
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>                            {/* Call to action */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center">
                                    <ShoppingBag size={20} className="mr-2" />
                                    MUA NGAY
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    className="border-2 border-blue-500 text-blue-600 font-medium py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center text-sm">
                                    <ShoppingCart size={20} className="mr-1" />
                                    GIỎ HÀNG
                                </button>
                            </div>                            {/* Extra purchase options */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button
                                    className={`border py-2 rounded-lg transition-colors flex items-center justify-center text-sm ${inWishlist
                                        ? 'border-red-500 text-red-600 bg-red-50 hover:bg-red-100'
                                        : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                                        }`}
                                    onClick={handleToggleWishlist}
                                    disabled={wishlistLoading}
                                >
                                    <Heart
                                        size={18}
                                        className={`mr-1 ${inWishlist ? 'fill-red-500' : ''}`}
                                    />
                                    {wishlistLoading ? 'ĐANG XỬ LÝ...' : inWishlist ? 'ĐÃ YÊU THÍCH' : 'YÊU THÍCH'}
                                </button>
                                <button className="border border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center text-sm">
                                    <Phone size={18} className="mr-1" />
                                    GỌI TƯ VẤN
                                </button>
                            </div>

                            {/* Benefits */}
                            <div className="border border-gray-200 rounded-lg p-3 mb-4">
                                <h3 className="font-medium text-gray-900 mb-3">Ưu đãi thêm</h3>
                                <ul className="space-y-3">
                                    <li className="flex">
                                        <Check className="flex-shrink-0 text-green-500 mr-2" size={18} />
                                        <span className="text-sm">Giảm đến 500.000₫ khi thanh toán qua VNPay, Moca</span>
                                    </li>
                                    <li className="flex">
                                        <Check className="flex-shrink-0 text-green-500 mr-2" size={18} />
                                        <span className="text-sm">Giảm đến 10% cho sinh viên, giáo viên</span>
                                    </li>
                                    <li className="flex">
                                        <Check className="flex-shrink-0 text-green-500 mr-2" size={18} />
                                        <span className="text-sm">Trả góp 0% qua thẻ tín dụng</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Policy information */}
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-start">
                                    <Shield className="flex-shrink-0 text-blue-500 mr-2" size={18} />
                                    <div>
                                        <p className="text-sm font-medium">Bảo hành chính hãng {sampleDetailedInfo.warranty.period}</p>
                                        <p className="text-xs text-gray-500">{sampleDetailedInfo.warranty.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Gift className="flex-shrink-0 text-blue-500 mr-2" size={18} />
                                    <div>
                                        <p className="text-sm font-medium">Quà tặng kèm</p>
                                        <p className="text-xs text-gray-500">Balo, Túi chống sốc, Chuột không dây</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Truck className="flex-shrink-0 text-blue-500 mr-2" size={18} />
                                    <div>
                                        <p className="text-sm font-medium">Giao hàng miễn phí</p>
                                        <p className="text-xs text-gray-500">Giao nhanh trong 2 giờ</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <ShoppingBag className="flex-shrink-0 text-blue-500 mr-2" size={18} />
                                    <div>
                                        <p className="text-sm font-medium">Đổi trả dễ dàng</p>
                                        <p className="text-xs text-gray-500">Trong 15 ngày đầu tiên</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content tabs - Description and Reviews */}
                <div className="bg-white rounded-lg overflow-hidden mb-6">                    {/* Tab headers */}
                    <div className="flex border-b">
                        <button
                            className={`px-6 py-3 font-medium text-sm ${activeTab === 'mô tả' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('mô tả')}
                        >
                            Mô tả sản phẩm
                        </button>
                        <button
                            className={`px-6 py-3 font-medium text-sm ${activeTab === 'thông số' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('thông số')}
                        >
                            Thông số kỹ thuật
                        </button>                        <button
                            className={`px-6 py-3 font-medium text-sm ${activeTab === 'đánh giá' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('đánh giá')}
                        >
                            Đánh giá
                        </button>
                    </div>                    {/* Tab content */}
                    <div className="p-4">
                        {/* Description tab */}
                        {activeTab === 'mô tả' && (
                            <div className="prose max-w-none">
                                {productDescription ? (
                                    <div dangerouslySetInnerHTML={{ __html: productDescription }} />
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: sampleDetailedInfo.description }} />
                                )}
                            </div>
                        )}

                        {/* Technical specs tab */}
                        {activeTab === 'thông số' && (
                            <div>
                                {attributesLoading || variantLoading ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {Object.entries(variantSpecs).map(([category, specs]) => (
                                            <div key={category} className="mb-6">
                                                <h3 className="font-medium text-gray-900 mb-3 capitalize border-b pb-2">{category}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {specs.map((spec, idx) => (
                                                        <div key={idx} className={`flex ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} p-3 rounded-lg`}>
                                                            <span className="text-gray-500 w-1/2">{spec.name}:</span>
                                                            <span className="text-gray-900 font-medium">{spec.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}                        {/* Reviews tab */}
                        {activeTab === 'đánh giá' && (
                            <div>
                                {apiProduct && <ProductReviews productId={apiProduct.id} />}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related products */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Sản phẩm tương tự</h2>
                        <Link to={`/${apiProduct.categoryId}`} className="text-blue-600 text-sm">
                            Xem tất cả
                        </Link>
                    </div>
                    {relatedProductsLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {relatedProducts.length > 0 ? (
                                relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        to={`/product/${relatedProduct.slug}`}
                                        className="bg-white p-3 rounded-lg hover:shadow-md transition-shadow group"
                                    >
                                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
                                            {relatedProduct.productImages && relatedProduct.productImages.length > 0 ? (
                                                <img
                                                    src={relatedProduct.productImages[0].imageUrl}
                                                    alt={relatedProduct.name}
                                                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                    <span className="text-gray-400">No image</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-sm text-gray-700 font-medium truncate">{relatedProduct.name}</h3>
                                        <div className="mt-1 text-sm font-bold text-red-600">
                                            {formatCurrency(relatedProduct.basePrice || 0)}
                                        </div>

                                        {relatedProduct.productVariants && relatedProduct.productVariants.length > 0 && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {relatedProduct.productVariants.length} phiên bản
                                            </div>
                                        )}
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-5 py-8 text-center text-gray-500">
                                    Không tìm thấy sản phẩm tương tự
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
