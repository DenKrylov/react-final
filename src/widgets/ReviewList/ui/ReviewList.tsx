import classNames from 'classnames';
import { useCallback, useOptimistic } from 'react';
import s from './ReviewList.module.css';
import { Rating } from '../../../shared/ui/Rating';
import { ReviewForm } from './ReviewForm/ReviewForm';

type ReviewListProps = {
	product: Product;
};
export const ReviewList = ({ product }: ReviewListProps) => {
	const [optimisticReviews, addOptimisticReview] = useOptimistic(
		product.reviews,
		(state, newReview: Review) => [newReview, ...state]
	);

	const handleReviewAdd = useCallback(
		(review: Review) => {
			addOptimisticReview(review);
		},
		[addOptimisticReview]
	);

	return (
		<div className={classNames(s['product__reviews'])}>
			{optimisticReviews.map((review) => (
				<div className={s['review']} key={review.id}>
					<div className={s['review__header']}>
						<div className={s['review__name']}>{review.user.name}</div>
						<div className={s['review__date']}>
							{new Date(review.createdAt).toLocaleDateString('ru-RU')}
						</div>
					</div>
					<Rating rating={review.rating} />
					<p className={s['review__text']}>{review.text}</p>
				</div>
			))}

			<h2>Отзыв о товаре {product.name}</h2>
			<ReviewForm
				product={product}
				onReviewAdd={handleReviewAdd}
			/>
		</div>
	);
};
