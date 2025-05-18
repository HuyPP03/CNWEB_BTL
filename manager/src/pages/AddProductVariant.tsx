import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";
import ImageUploader from "../components/ImageUploader";

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

interface AttributeValue {
    id: number;
    value: string;
    attributeTypeId: number;
}

const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Number(amount));
};

export default function AddProductVariant() {
    const { id: productId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
    const [attributeValues, setAttributeValues] = useState<{ [key: number]: AttributeValue[] }>({});
    const [attributes, setAttributes] = useState<{ [key: number]: string }>({});
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Lấy categoryId của sản phẩm
    const [categoryId, setCategoryId] = useState<number | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products?id=${productId}`);
                setCategoryId(res.data.data[0]?.categoryId);
            } catch {
                setError("Không tìm thấy sản phẩm");
            }
        };
        fetchProduct();
    }, [productId]);

    // Lấy attribute types theo categoryId
    useEffect(() => {
        if (!categoryId) return;
        const fetchAttributeTypes = async () => {
            try {
                const res = await api.get(`/public/attribute-types/${categoryId}`);
                // Sort attributes to show parent attributes first
                const sortedAttributes = res.data.data.sort((a: AttributeType, b: AttributeType) => {
                    if (a.parentId === null && b.parentId !== null) return -1;
                    if (a.parentId !== null && b.parentId === null) return 1;
                    return 0;
                });
                setAttributeTypes(sortedAttributes || []);
            } catch {
                setAttributeTypes([]);
            }
        };
        fetchAttributeTypes();
    }, [categoryId]);

    // Lấy attribute values cho từng attribute type
    useEffect(() => {
        attributeTypes.forEach((type) => {
            api.get(`/public/attribute-values/${type.id}`).then(res => {
                setAttributeValues(prev => ({ ...prev, [type.id]: res.data.data || [] }));
            });
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

    // Lấy thuộc tính từ biến thể đầu tiên (nếu có)
    useEffect(() => {
        if (!productId) return;
        const fetchFirstVariant = async () => {
            try {
                const res = await api.get(`/product-variant?productId=${productId}`);
                const firstVariant = res.data.data && res.data.data[0];
                if (firstVariant && firstVariant.variantAttributes) {
                    const attributeMap: { [key: number]: string } = {};
                    firstVariant.variantAttributes.forEach((attr: any) => {
                        attributeMap[attr.attributeTypeId] = attr.attributeValue.value;
                    });
                    setAttributes(attributeMap);
                }
            } catch {}
        };
        fetchFirstVariant();
    }, [productId]);

    const handleAttributeChange = (typeId: number, value: string) => {
        setAttributes(prev => ({ ...prev, [typeId]: value }));
    };

    const handleImageChange = (newFiles: File[]) => {
        setImages(newFiles);
    };

    const handleRemoveImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("productId", productId || "");
            formData.append("name", name);
            formData.append("price", price);
            formData.append("stock", stock);
            formData.append("discountPrice", discountPrice);
            // attributes
            Object.entries(attributes).forEach(([typeId, value], idx) => {
                formData.append(`attributes[${idx}].attributeTypeId`, typeId);
                formData.append(`attributes[${idx}].value`, value);
            });
            // images
            images.forEach((img, idx) => {
                formData.append(`image[${idx}]`, img);
            });
            await api.post("/product-variant", formData);
            setSuccess("Thêm biến thể thành công!");
            setTimeout(() => navigate(-1), 1200);
        } catch (err: any) {
            setError(err.response?.data?.message || "Có lỗi xảy ra");
        }
        setLoading(false);
    };

    return (
        <div className="p-8 w-full min-h-screen bg-white">
            <BackButton onClick={() => navigate(-1)} />
            <h1 className="text-2xl font-bold mb-8 text-center">Thêm biến thể sản phẩm</h1>
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
                <label className="block font-semibold mb-2 text-lg">Ảnh biến thể</label>
                <ImageUploader
                    onImageChange={handleImageChange}
                    imagePreviews={imagePreviews}
                    onRemoveImage={handleRemoveImage}
                />
                <div>
                    <label className="block font-semibold mb-2 text-lg">Thuộc tính</label>
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
                    {loading ? "Đang thêm..." : "Lưu biến thể"}
                </button>
            </form>
        </div>
    );
} 