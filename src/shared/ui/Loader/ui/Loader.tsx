import classNames from 'classnames';
import { CircularProgress, CircularProgressProps } from '@mui/material';
import s from './Loader.module.css';

type LoaderProps = CircularProgressProps & {
	fullHeight?: boolean;
};

export const Loader = ({
	className,
	fullHeight = false,
	...restProps
}: LoaderProps) => {
	return (
		<div
			className={classNames(
				s.wrapper,
				{
					[s.fullHeight]: fullHeight,
				},
				className
			)}>
			<CircularProgress {...restProps} />
		</div>
	);
};
