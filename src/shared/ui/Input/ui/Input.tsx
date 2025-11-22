import { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export type InputProps = TextFieldProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ margin = 'normal', fullWidth = true, ...rest }, ref) => (
		<TextField
			margin={margin}
			fullWidth={fullWidth}
			inputRef={ref}
			{...rest}
		/>
	)
);

Input.displayName = 'Input';
