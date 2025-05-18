import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";
import ImageUploader from "../components/ImageUploader";

interface Product {
    id: number;
    name: string;
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

export default function EditProductVariant() {
    const { variantId } = useParams<{ id: string; variantId: string }>();
    const navigate = useNavigate();
    const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
    const [attributeValues, setAttributeValues] = useState<{ [key: number]: AttributeValue[] }>({});
    const [attributes, setAttributes] = useState<{ [key: number]: string }>({});
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [oldImages, setOldImages] = useState<{ id: number; imageUrl: string }[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    // Fetch variant data
    useEffect(() => {
        const fetchVariant = async () => {
            try {
                const res = await api.get(`/product-variant?id=${variantId}`);
                const variant: ProductVariant = res.data.data[0];
                
                setName(variant.name);
                setPrice(variant.price);
                setStock(String(variant.stock));
                setDiscountPrice(variant.discountPrice || "");
                setOldImages(variant.productImages || []);
                
                // Set attributes from variantAttributes
                const attributeMap: { [key: number]: string } = {};
                variant.variantAttributes.forEach(attr => {
                    attributeMap[attr.attributeTypeId] = attr.attributeValue.value;
                });
                setAttributes(attributeMap);

                // Get categoryId from product
                setCategoryId(variant.product.categoryId);
            } catch (err) {
                setError("Không tìm thấy biến thể sản phẩm");
            }
        };
        fetchVariant();
    }, [variantId]);

    // Fetch attribute types based on categoryId
    useEffect(() => {
        if (!categoryId) return;
        const fetchAttributeTypes = async () => {
            try {
                const res = await api.get(`/public/attribute-types/${categoryId}`);
                const sortedAttributes = res.data.data.sort((a: AttributeType, b: AttributeType) => {
                    if (a.parentId === null && b.parentId !== null) return -1;
                    if (a.parentId !== null && b.parentId === null) return 1;
                    return 0;
                });
                setAttributeTypes(sortedAttributes || []);
            } catch (err) {
                setAttributeTypes([]);
            }
        };
        fetchAttributeTypes();
    }, [categoryId]);

    // Fetch attribute values for each attribute type
    useEffect(() => {
        attributeTypes.forEach((type) => {
            api.get(`/public/attribute-values/${type.id}`).then(res => {
                setAttributeValues(prev => ({ ...prev, [type.id]: res.data.data || [] }));
            }).catch(() => {});
        });
    }, [attributeTypes]);

    useEffect(() => {
        if (images.length > 0) {
            const urls = images.map(file => URL.createObjectURL(file));
            setImagePreviews(urls);
            return () => urls.forEach(url => URL.revokeObjectURL(url));
        } else {
            setImagePreviews([]);
        }
    }, [images]);

    const handleAttributeChange = (typeId: number, value: string) => {
        setAttributes(prev => ({ ...prev, [typeId]: value }));
    };

    const handleImageChange = (newFiles: File[]) => {
        setImages(newFiles);
    };

    const handleRemoveImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleRemoveOldImage = (imgId: number) => {
        setOldImages(prev => prev.filter(img => img.id !== imgId));
        setDeletedImageIds(prev => [...prev, imgId]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            // Xóa ảnh cũ đã chọn xóa
            if (deletedImageIds.length > 0) {
                await Promise.all(deletedImageIds.map(id => api.delete(`/images/${id}`)));
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("stock", stock);
            formData.append("discountPrice", discountPrice);
            
            // Chỉ thêm attributes khi có thay đổi
            Object.entries(attributes).forEach(([typeId, value], idx) => {
                formData.append(`attributes[${idx}].attributeTypeId`, typeId);
                formData.append(`attributes[${idx}].value`, value);
            });

            // Chỉ thêm ảnh mới khi có ảnh được chọn
            if (images.length > 0) {
                images.forEach((img, idx) => {
                    formData.append(`image[${idx}]`, img);
                });
            }

            await api.put(`/product-variant/${variantId}`, formData);
            setSuccess("Cập nhật biến thể thành công!");
            setTimeout(() => navigate(-1), 1200);
        } catch (err: any) {
            setError(err.response?.data?.message || "Có lỗi xảy ra");
        }
        setLoading(false);
    };

    return (
        <div className="p-8 w-full min-h-screen bg-white">
            <BackButton onClick={() => navigate(-1)} />
            <h1 className="text-2xl font-bold mb-8 text-center">Chỉnh sửa biến thể sản phẩm</h1>
            <form
                onSubmit={handleSubmit}
                className="mt-6 bg-white shadow-md rounded-lg p-10 space-y-8 max-w-4xl mx-auto"
                encType="multipart/form-data"
            >
                <div>
                    <label className="block font-semibold mb-2 text-lg">Tên biến thể <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        placeholder="Nhập tên biến thể"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full p-3 border rounded focus:outline-blue-400 text-lg"
                        required
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <label className="block font-semibold mb-2 text-lg">Giá <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            placeholder="Nhập giá"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="w-full p-3 border rounded text-lg"
                            min={0}
                            required
                        />
                        {price && (
                            <div className="text-sm text-gray-500 mt-1">
                                {formatCurrency(price)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block font-semibold mb-2 text-lg">Giá giảm</label>
                        <input
                            type="number"
                            placeholder="Nhập giá giảm"
                            value={discountPrice}
                            onChange={e => setDiscountPrice(e.target.value)}
                            className="w-full p-3 border rounded text-lg"
                            min={0}
                        />
                        {discountPrice && (
                            <div className="text-sm text-gray-500 mt-1">
                                {formatCurrency(discountPrice)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block font-semibold mb-2 text-lg">Số lượng <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            placeholder="Nhập số lượng"
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                            className="w-full p-3 border rounded text-lg"
                            min={0}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-2 text-lg">Ảnh biến thể</label>
                    <ImageUploader
                        onImageChange={handleImageChange}
                        imagePreviews={imagePreviews}
                        onRemoveImage={handleRemoveImage}
                    />
                    {oldImages.length > 0 && (
                        <div className="mt-4">
                            <label className="block font-semibold mb-2 text-lg">Ảnh hiện tại</label>
                            <div className="flex flex-wrap gap-4">
                                {oldImages.map(img => (
                                    <div key={img.id} className="relative">
                                        <img 
                                            src={`${img.imageUrl}`} 
                                            alt="old" 
                                            className="w-24 h-24 object-cover rounded border" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOldImage(img.id)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block font-semibold mb-2 text-lg">Thuộc tính </label>
                    <div className="space-y-6">
                        {attributeTypes.map(parent => (
                            <div key={parent.id} className="border rounded-lg p-4 bg-gray-50">
                                <h3 className="font-semibold text-lg mb-4 text-gray-800">{parent.name}</h3>
                                <div className="space-y-3 pl-4">
                                    {parent.subAttributes && parent.subAttributes.length > 0 ? (
                                        parent.subAttributes.map(sub => (
                                            <div key={sub.id} className="flex flex-col md:flex-row md:items-center gap-2 bg-white p-3 rounded shadow-sm">
                                                <span className="md:w-48 text-base font-medium text-gray-700">{sub.name}</span>
                                                {attributeValues[sub.id] && attributeValues[sub.id].length > 0 ? (
                                                    <select
                                                        className="border rounded p-2 flex-1 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={attributes[sub.id] || ""}
                                                        onChange={e => handleAttributeChange(sub.id, e.target.value)}
                                                    >
                                                        <option value="">Chọn giá trị</option>
                                                        {attributeValues[sub.id].map(val => (
                                                            <option key={val.id} value={val.value}>{val.value}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="border rounded p-2 flex-1 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={attributes[sub.id] || ""}
                                                        onChange={e => handleAttributeChange(sub.id, e.target.value)}
                                                        placeholder={`Nhập ${sub.name.toLowerCase()}`}
                                                    />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="italic text-gray-400">Không có thuộc tính con</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {error && <div className="text-red-500 font-semibold text-lg">{error}</div>}
                {success && <div className="text-green-600 font-semibold text-lg">{success}</div>}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-8 py-3 rounded hover:bg-blue-600 font-semibold w-full text-lg shadow"
                    disabled={loading}
                >
                    {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                </button>
            </form>
        </div>
    );
} 