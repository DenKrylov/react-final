import s from './LikeButton.module.css';
import { ReactComponent as LikeSvg } from '../../../../shared/assets/icons/like.svg?component';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../../../shared/store/utils';
import { userSelectors } from '../../../../shared/store/slices/user';
import {
	useSetLikeProductMutation,
	useDeleteLikeProductMutation,
	IErrorResponse,
} from '../../../../shared/store/api/productsApi';
import { toast } from 'react-toastify';
import { useOptimisticValue } from '../../../../shared/hooks/useOptimisticValue';

type TLikeButtonProps = {
	product: Product;
};
export const LikeButton = ({ product }: TLikeButtonProps) => {
	const accessToken = useAppSelector(userSelectors.getAccessToken);
	const user = useAppSelector(userSelectors.getUser);

	const [setLike] = useSetLikeProductMutation();
	const [deleteLike] = useDeleteLikeProductMutation();

	const isLike = product?.likes.some((l) => l.userId === user?.id);
	const [optimisticIsLike, setOptimisticIsLike] = useOptimisticValue(
		isLike,
		(_prev, nextValue: boolean) => nextValue
	);

	const prevIsLikeRef = useRef(isLike);
	useEffect(() => {
		if (prevIsLikeRef.current === isLike) {
			return;
		}
		prevIsLikeRef.current = isLike;
		setOptimisticIsLike(isLike);
	}, [isLike, setOptimisticIsLike]);

	const toggleLike = async () => {
		if (!accessToken) {
			toast.warning('Вы не авторизованы');
			return;
		}
		const prevValue = optimisticIsLike;
		setOptimisticIsLike((prev) => !prev);

		let response;
		if (prevValue) {
			response = await deleteLike({ id: `${product.id}` });
		} else {
			response = await setLike({ id: `${product.id}` });
		}

		if (response.error) {
			const error = response.error as IErrorResponse;
			toast.error(error.data.message);
			setOptimisticIsLike(prevValue);
		}
	};

	return (
		<button
			className={classNames(s['card__favorite'], {
				[s['card__favorite_is-active']]: optimisticIsLike,
			})}
			onClick={toggleLike}>
			<LikeSvg />
		</button>
	);
};
