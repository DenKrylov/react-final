import { WithProtection } from '../../../shared/store/HOCs/WithProtection';
import { WithQuery } from '../../../shared/store/HOCs/WithQuery';
import { LoadMore } from '../../../features/products/load-more';
import { CardList } from '../../../widgets/CardList';
import { useProducts } from '../../../features/products/hooks/useProducts';

const CardListWithQuery = WithQuery(CardList);

export const HomePage = WithProtection(() => {
	const { products, isLoading, isError, error } = useProducts();

	return (
		<>
			<CardListWithQuery
				title='Лакомства'
				isLoading={isLoading}
				isError={isError}
				products={products}
				error={error}
			/>
			<LoadMore />
		</>
	);
});
