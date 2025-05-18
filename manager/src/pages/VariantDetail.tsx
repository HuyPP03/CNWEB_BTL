import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";

interface Product {
    id: number;
    name: string;
    slug: string;
    categoryId: number;
    brandId: number;
    description: string;
    basePrice: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AttributeValue {
    id: number;
    attributeTypeId: number;
    value: string;
    createdAt: string;
    updatedAt: string;
}

interface VariantAttribute {
    id: number;
    productId: number;
    variantId: number;
    attributeValueId: number;
    attributeTypeId: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    attributeValue: AttributeValue;
}

interface ProductVariant {
    id: number;
    productId: number;
    name: string;
    price: string;
    discountPrice: string | null;
    stock: number;
    createdAt: string;
    updatedAt: string;
    product: Product;
    productImages: {
        id: number;
        imageUrl: string;
    }[];
    variantAttributes: VariantAttribute[];
}

interface AttributeType {
    id: number;
    name: string;
    parentId: number | null;
    parent?: {
        id: number;
        name: string;
    };
    subAttributes?: AttributeType[];
}

const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Number(amount));
};

export default function VariantDetail() {
    const { variantId } = useParams<{ id: string; variantId: string }>();
    const navigate = useNavigate();
    const [variant, setVariant] = useState<ProductVariant | null>(null);
    const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewImg, setPreviewImg] = useState<string | null>(null);

    // Fetch variant data
    useEffect(() => {
        const fetchVariant = async () => {
            try {
                const res = await api.get(`/product-variant?id=${variantId}`);
                const variantData: ProductVariant = res.data.data[0];
                setVariant(variantData);

                // Fetch attribute types based on product category
                const attrRes = await api.get(`/public/attribute-types/${variantData.product.categoryId}`);
                const sortedAttributes = attrRes.data.data.sort((a: AttributeType, b: AttributeType) => {
                    if (a.parentId === null && b.parentId !== null) return -1;
                    if (a.parentId !== null && b.parentId === null) return 1;
                    return 0;
                });
                setAttributeTypes(sortedAttributes || []);
            } catch (err) {
                setError("Không tìm thấy biến thể sản phẩm");
            }
            setLoading(false);
        };
        fetchVariant();
    }, [variantId]);

    if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!variant) return null;

    return (
        <div className="p-8 w-full min-h-screen bg-white">
            <BackButton onClick={() => navigate(-1)} />
            <h1 className="text-2xl font-bold mb-8 text-center">Chi tiết biến thể sản phẩm</h1>
            
            <div className="mt-6 bg-white shadow-md rounded-lg p-10 space-y-8 max-w-4xl mx-auto">
                {/* Basic Information */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-blue-700 mb-4">Thông tin cơ bản</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-semibold mb-2 text-lg">Tên biến thể</label>
                            <div className="p-3 bg-gray-50 rounded border text-lg">{variant.name}</div>
                        </div>
                        <div>
                            <label className="block font-semibold mb-2 text-lg">Giá</label>
                            <div className="p-3 bg-gray-50 rounded border text-lg">{formatCurrency(variant.price)}</div>
                        </div>
                        <div>
                            <label className="block font-semibold mb-2 text-lg">Số lượng</label>
                            <div className="p-3 bg-gray-50 rounded border text-lg">{variant.stock}</div>
                        </div>
                    </div>
                </div>

                {/* Product Images */}
                {variant.productImages && variant.productImages.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-blue-700 mb-4">Hình ảnh biến thể</h2>
                        <div className="flex flex-wrap gap-4">
                            {variant.productImages.map((img) => (
                                <img
                                    key={img.id}
                                    src={`${img.imageUrl}`}
                                    alt={`variant-img-${img.id}`}
                                    className="w-40 h-40 object-cover rounded-lg border shadow cursor-pointer hover:scale-105 transition"
                                    onClick={() => setPreviewImg(img.imageUrl)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Attributes */}
                <div>
                    <h2 className="text-xl font-bold text-blue-700 mb-4">Thuộc tính</h2>
                    <div className="space-y-6">
                        {attributeTypes.map(parent => (
                            <div key={parent.id} className="border rounded-lg p-4 bg-gray-50">
                                <h3 className="font-semibold text-lg mb-4 text-gray-800">{parent.name}</h3>
                                <div className="space-y-3 pl-4">
                                    {parent.subAttributes && parent.subAttributes.length > 0 ? (
                                        parent.subAttributes.map(sub => {
                                            const attribute = variant.variantAttributes.find(
                                                attr => attr.attributeTypeId === sub.id
                                            );
                                            return (
                                                <div key={sub.id} className="flex flex-col md:flex-row md:items-center gap-2 bg-white p-3 rounded shadow-sm">
                                                    <span className="md:w-48 text-base font-medium text-gray-700">{sub.name}</span>
                                                    <div className="flex-1 p-2 bg-gray-50 rounded">
                                                        {attribute?.attributeValue.value || "Không có"}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="italic text-gray-400">Không có thuộc tính con</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImg && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setPreviewImg(null)}
                >
                    <img
                        src={previewImg}
                        alt="preview"
                        className="max-w-3xl max-h-[80vh] rounded-lg shadow-lg border-4 border-white"
                        onClick={e => e.stopPropagation()}
                    />
                    <button
                        className="absolute top-8 right-8 text-white text-3xl font-bold"
                        onClick={() => setPreviewImg(null)}
                        title="Đóng"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
} 