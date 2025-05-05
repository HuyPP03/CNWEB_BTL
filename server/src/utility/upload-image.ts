import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const productId = req.params.productId;

        if (!productId) {
            return callback(new Error('Missing productId in request params'), '');
        }

        const uploadFolder = path.join(__dirname, '..', '..', 'uploads', productId);

        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, { recursive: true });
        }

        callback(null, uploadFolder);
    },

    filename: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        const filename = `image-${Date.now()}${ext}`;
        callback(null, filename);
    }
});

export const upload = multer({ storage });
