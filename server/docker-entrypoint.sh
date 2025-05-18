#!/bin/sh

echo "Đang chờ MySQL sẵn sàng..."
# Chờ thêm để đảm bảo MySQL đã hoàn toàn sẵn sàng
sleep 5

echo "Đang chạy database migrations..."
npm run migration:run

echo "Đang chạy database seeds..."
npm run seed:run

echo "Đang build ứng dụng..."
npm run build

echo "Khởi động ứng dụng..."
npm start