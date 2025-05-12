import express from 'express';
import * as feedbackController from '../controllers/managers/feedbacks.controller';
import { isManager, verifyToken } from 'src/middleware/authenticate.middleware';

const router = express.Router();

router.use(verifyToken);

// Customer đăng phản hồi
router.post('/', feedbackController.createfeedback);

router.use(isManager);

// Manager xem và xóa phản hồi
router.get('/', feedbackController.getAllfeedbacks);
router.delete('/', feedbackController.deletefeedback);

export default router;
