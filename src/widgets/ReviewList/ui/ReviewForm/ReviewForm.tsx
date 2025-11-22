import {
	ChangeEvent,
	FormEvent,
	useActionState,
	useEffect,
	useRef,
	useState,
} from 'react';
import classNames from 'classnames';
import s from './ReviewForm.module.css';
import { Rating } from '../../../../shared/ui/Rating';
import { useAppSelector } from '../../../../shared/store/utils';
import { userSelectors } from '../../../../shared/store/slices/user';

type ReviewFormState = {
	status: 'idle' | 'success' | 'error';
	message: string;
};

type ReviewFormProps = {
	product: Product;
	onReviewAdd: (review: Review) => void;
};

const buildReviewAuthor = (currentUser?: Partial<User> | null): User => ({
	id: currentUser?.id ?? 'guest',
	roles: currentUser?.roles ?? ['USER'],
	name: currentUser?.name ?? 'Гость',
	email: currentUser?.email ?? 'guest@example.com',
	phone: currentUser?.phone ?? '',
	avatarPath: currentUser?.avatarPath ?? '',
	about: currentUser?.about ?? 'Отправил отзыв без авторизации',
	likes: currentUser?.likes ?? [],
	favoritesPost: currentUser?.favoritesPost ?? [],
});

const buildReviewProduct = (product: Product): ReviewProduct => ({
	id: product.id,
	name: product.name,
	description: product.description,
	price: product.price,
	images: product.images,
	slug: product.slug,
	discount: product.discount,
	isPublished: product.isPublished,
	stock: product.stock,
	tags: product.tags,
	createdAt: product.createdAt,
	updatedAt: product.updatedAt,
	categoryId: product.category.id,
	userId: product.user.id,
	wight: '1',
});

export const ReviewForm = ({
	product,
	onReviewAdd,
}: ReviewFormProps) => {
	const currentUser = useAppSelector(userSelectors.getUser);
	const [reviewText, setReviewText] = useState('');
	const [rating, setRating] = useState(-1);
	const formRef = useRef<HTMLFormElement>(null);
	const lastSubmitAtRef = useRef(0);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setReviewText(e.target.value);
	};

	const [formState, formAction, isPending] = useActionState<
		ReviewFormState,
		FormData
	>(
		async (_prevState, formData) => {
			const text = (formData.get('text') as string)?.trim() ?? '';
			const ratingValue = Number(formData.get('rating') ?? 0);
			const now = Date.now();

			if (!text) {
				return { status: 'error', message: 'Введите текст отзыва' };
			}
			if (!Number.isFinite(ratingValue) || ratingValue <= 0) {
				return { status: 'error', message: 'Поставьте оценку' };
			}
			if (now - lastSubmitAtRef.current < 600) {
				return {
					status: 'error',
					message: 'Слишком частые отправки — подождите секунду',
				};
			}
			lastSubmitAtRef.current = now;

			// имитируем работу API, чтобы показать pending для useActionState
			await new Promise((resolve) => setTimeout(resolve, 350));

			const newReview: Review = {
				id: crypto.randomUUID?.() ?? `review-${now}`,
				text,
				rating: ratingValue,
				user: buildReviewAuthor(currentUser),
				product: buildReviewProduct(product),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			onReviewAdd(newReview);

			return { status: 'success', message: 'Отзыв отправлен' };
		},
		{ status: 'idle', message: '' }
	);

	useEffect(() => {
		if (formState.status !== 'success') {
			return;
		}
		formRef.current?.reset();
		setReviewText('');
		setRating(-1);
	}, [formState.status]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		formAction(new FormData(event.currentTarget));
	};

	const submittedRating = rating < 0 ? 0 : rating + 1;

	return (
		<form className={s['form']} onSubmit={handleSubmit} ref={formRef}>
			<Rating isEdit rating={rating} onChange={setRating} />
			<input type='hidden' name='rating' value={submittedRating} />
			<textarea
				className={classNames(s['input'], s['textarea'])}
				name='text'
				id='text'
				placeholder='Напишите текст отзыва'
				value={reviewText}
				onChange={handleChange}></textarea>
			{formState.message && (
				<p
					className={classNames(s.status, {
						[s.status_success]: formState.status === 'success',
						[s.status_error]: formState.status === 'error',
					})}>
					{formState.message}
				</p>
			)}
			<button
				type='submit'
				className={classNames(s['form__btn'], s['pramary'])}
				disabled={isPending}>
				{isPending ? 'Отправляем...' : 'Отправить отзыв'}
			</button>
		</form>
	);
};
