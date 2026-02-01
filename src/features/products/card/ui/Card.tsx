import classNames from 'classnames';
import { memo, useMemo, useCallback, useState, useRef } from 'react';
import s from './Card.module.css';
import { Price } from './Price/ui/Price';
import { Link } from 'react-router-dom';
import { LikeButton } from '../../../favorites/LikeButton';
import { useAppSelector } from '../../../../shared/store/utils';
import { cartSelectors } from '../../../../shared/store/slices/cart';
import { useAddToCart } from '../../../cart/hooks/useAddToCart';
import { CartCounter } from '../../../cart/CartCounter';
import { Modal } from '../../../../shared/ui/Modal';
import { Button } from '../../../../shared/ui/Button';

type CardProps = {
	product: Product;
};
export const Card = memo(({ product }: CardProps) => {
	const { discount, price, name, tags, id, images } = product;
	const cartProducts = useAppSelector(cartSelectors.getCartProducts);
	const isProductInCart = useMemo(
		() => cartProducts.some((p) => p.id === id),
		[cartProducts, id]
	);
	const { addProductToCart } = useAddToCart();
	const handleAddToCart = useCallback(
		() => addProductToCart({ ...product, count: 1 }),
		[addProductToCart, product]
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const quickViewTriggerRef = useRef<HTMLButtonElement>(null);

	return (
		<article className={s['card']}>
			<div
				className={classNames(
					s['card__sticky'],
					s['card__sticky_type_top-left']
				)}>
				<span className={s['card__discount']}>{discount}</span>
				{tags.length > 0 &&
					tags.map((t) => (
						<span key={t} className={classNames(s['tag'], s['tag_type_new'])}>
							{t}
						</span>
					))}
			</div>
			<div
				className={classNames(
					s['card__sticky'],
					s['card__sticky_type_top-right']
				)}>
				<LikeButton product={product} />
			</div>
			<Link className={s['card__link']} to={`/products/${id}`}>
				<img
					src={images}
					alt={name}
					className={s['card__image']}
					loading='lazy'
				/>
				<div className={s['card__desc']}>
					<Price price={price} discountPrice={discount} />
					<h3 className={s['card__name']}>{name}</h3>
				</div>
			</Link>
			{isProductInCart ? (
				<CartCounter productId={id} />
			) : (
				<button
					onClick={handleAddToCart}
					disabled={isProductInCart}
					className={classNames(
						s['card__cart'],
						s['card__btn'],
						s['card__btn_type_primary']
					)}>
					В корзину
				</button>
			)}
			<Button
				ref={quickViewTriggerRef}
				variant='secondary'
				onClick={() => setIsModalOpen(true)}>
				Быстрый просмотр
			</Button>
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				triggerRef={quickViewTriggerRef}>
				<div className={classNames(s['card'])}>
					<div className={classNames(s['card__desc'])}>
						<Price price={price} discountPrice={discount} />
						<h3 className={s['card__name']}>{name}</h3>
					</div>
					<img
						src={images}
						alt={name}
						className={s['card__image']}
						loading='lazy'
					/>
					<LikeButton product={product} />
					{isProductInCart ? (
				<CartCounter productId={id} />
			) : (
				<button
					onClick={handleAddToCart}
					disabled={isProductInCart}
					className={classNames(
						s['card__cart'],
						s['card__btn'],
						s['card__btn_type_primary']
					)}>
					В корзину
				</button>
			)}
				</div>
			</Modal>
		</article>
	);
});
