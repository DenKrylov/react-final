import { ButtonHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import s from './Button.module.css';

type ButtonVariant = 'primary' | 'light' | 'secondary' | 'border' | 'box';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant = 'primary', fullWidth = false, type = 'button', ...rest },
		ref
	) => (
		<button
			// eslint-disable-next-line react/button-has-type
			type={type}
			ref={ref}
			className={classNames(
				s.button,
				s[`button_type_${variant}`],
				{
					[s.button_type_wide]: fullWidth,
				},
				className
			)}
			{...rest}
		/>
	)
);

Button.displayName = 'Button';
