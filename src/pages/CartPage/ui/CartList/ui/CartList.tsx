import classNames from 'classnames';
import { useMemo } from 'react';
import { useAppSelector } from '../../../../../shared/store/utils';
import { cartSelectors } from '../../../../../shared/store/slices/cart';
import { CartItem } from '../../CartItem';
import s from '../../CartPage.module.css';

export const CartList = () => {
	const products = useAppSelector(cartSelectors.getCartProducts);
	const items = useMemo(
		() => products.map((p) => <CartItem product={p} key={p.id} />),
		[products]
	);

	return <div className={classNames(s['cart-list'])}>{items}</div>;
};
