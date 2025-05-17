import React, { useState, useEffect } from 'react';
import profileService, { UpdateUserProfileParams } from '../services/profile.service';
import { UserProfile } from '../types/user';

const AccountPage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form data
    const [formData, setFormData] = useState<UpdateUserProfileParams>({
        fullName: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const data = await profileService.getUserProfile();
                setProfile(data);
                setFormData({
                    fullName: data.fullName,
                    phone: data.phone,
                    address: data.address || '',
                });
            } catch (err) {
                setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');
                console.error('Error fetching profile:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const updatedProfile = await profileService.updateUserProfile(formData);
            setProfile(updatedProfile);
            setIsEditing(false);
            setSuccess('Cập nhật thông tin thành công!');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (err) {
            setError('Cập nhật thông tin thất bại. Vui lòng thử lại sau.');
            console.error('Error updating profile:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">Tài Khoản Của Tôi</h1>
                    </div>

                    {/* Account Content */}
                    <div className="p-6">
                        {error && (
                            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-md border border-green-200">
                                {success}
                            </div>
                        )}

                        {/* Profile Info */}
                        {!isEditing ? (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Thông tin cá nhân</h2>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Chỉnh sửa
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                                        <p className="text-gray-800 font-medium">{profile?.fullName}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <p className="text-gray-800 font-medium">{profile?.email}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                                        <p className="text-gray-800 font-medium">{profile?.phone || 'Chưa cập nhật'}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
                                        <p className="text-gray-800 font-medium">{profile?.address || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-gray-700 font-medium mb-2">Thông tin tài khoản</h3>
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">ID tài khoản</p>
                                                <p className="text-gray-800 font-medium">#{profile?.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Ngày tạo tài khoản</p>
                                                <p className="text-gray-800 font-medium">
                                                    {new Date(profile?.createdAt || '').toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                                                <p className={`font-medium ${profile?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                    {profile?.isActive ? 'Đang hoạt động' : 'Bị khóa'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Chỉnh sửa thông tin cá nhân</h2>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                // Reset form data
                                                if (profile) {
                                                    setFormData({
                                                        fullName: profile.fullName,
                                                        phone: profile.phone,
                                                        address: profile.address || '',
                                                    });
                                                }
                                            }}
                                            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition duration-300 ease-in-out"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
                                        >
                                            Lưu thay đổi
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                                            placeholder="Nhập họ và tên của bạn"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={profile?.email || ''}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                            disabled
                                        />
                                        <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                                            placeholder="Nhập số điện thoại của bạn"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                            Địa chỉ
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={formData.address || ''}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                                            placeholder="Nhập địa chỉ của bạn"
                                        />
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Order History Section (Preview) */}
                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Lịch sử đơn hàng gần đây</h2>
                                <a href="/orders" className="text-blue-600 hover:text-blue-800 flex items-center">
                                    Xem tất cả
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>

                            <div className="bg-gray-50 rounded-md p-6 text-center">
                                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {/* <p className="mt-2 text-gray-600">Bạn chưa có đơn hàng nào</p> */}
                                <a href="/" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out">
                                    Mua sắm ngay
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
