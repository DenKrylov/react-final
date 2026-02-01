import s from './ProductCartCounter.module.css';
import classNames from 'classnames';
import { useCount } from '../hooks/useCount';
import { useAddToCart } from '../../hooks/useAddToCart';
import { Button } from '../../../../shared/ui/Button';

type ProductCartCounterProps = {
	product: Product;
};
export const ProductCartCounter = ({ product }: ProductCartCounterProps) => {
	const { count, handleCount, handleCountMinus, handleCountPlus } = useCount();
	const { addProductToCart } = useAddToCart();

	return (
		<div className={classNames('product__btn-wrap')}>
			<div className={s['button-count']}>
				<button className={s['button-count__minus']} onClick={handleCountMinus}>
					-
				</button>
				<input
					type='number'
					className={s['button-count__num']}
					value={count}
					onChange={handleCount}
				/>
				<button className={s['button-count__plus']} onClick={handleCountPlus}>
					+
				</button>
			</div>
			<Button
				variant='primary'
				onClick={() => addProductToCart({ ...product, count })}
				className={classNames(s['button'])}>
				В корзину
			</Button>
		</div>
	);
};
