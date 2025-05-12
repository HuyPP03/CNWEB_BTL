import express from 'express';
import * as reviewService from '../controllers/customers/reviews.controller';
import { isManager, verifyToken } from 'src/middleware/authenticate.middleware';

const router = express.Router();
router.use(verifyToken);

router.get('/', reviewService.getAllReviews);
router.get('/:id', reviewService.getReviewsByProduct);

router.post('/', reviewService.createReview);
router.put('/:id', reviewService.updateReview);

router.delete('/customer/:id', reviewService.deleteReview);

router.delete('/:id', isManager, reviewService.deleteReview);

export default router;
