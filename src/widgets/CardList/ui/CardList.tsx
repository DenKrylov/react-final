import { useMemo } from 'react';
import { Card } from '../../../features/products/card';
import s from './CardList.module.css';

type CardListProps = {
	title: string;
	products: Product[];
};
export const CardList = ({ title, products }: CardListProps) => {
	if (!products.length) {
		return <h1 className='header-title'>Товар не найден</h1>;
	}

	const items = useMemo(
		() => products.map((product) => <Card key={product.id} product={product} />),
		[products]
	);

	return (
		<div className={s['card-list']}>
			<div className={s['card-list__header']}>
				<h2 className={s['card-list__title']}>{title}</h2>
			</div>
			<div className={s['card-list__items']}>
				{items}
			</div>
		</div>
	);
};
