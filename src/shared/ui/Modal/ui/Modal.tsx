import {
	MutableRefObject,
	ReactNode,
	RefObject,
	useCallback,
	useEffect,
	useRef,
} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import s from './Modal.module.css';

type ModalFocusRef =
	| RefObject<HTMLElement | null>
	| MutableRefObject<HTMLElement | null>;

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	triggerRef?: ModalFocusRef;
	className?: string;
};

export const Modal = ({
	isOpen,
	onClose,
	children,
	triggerRef,
	className,
}: ModalProps) => {
	const modalRoot = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const previousFocusedElementRef = useRef<HTMLElement | null>(null);
	const closeCountRef = useRef(0);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		previousFocusedElementRef.current =
			triggerRef?.current ?? (document.activeElement as HTMLElement | null);

		const focusTimer = window.requestAnimationFrame(() => {
			closeButtonRef.current?.focus();
		});

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closeCountRef.current += 1;
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			window.cancelAnimationFrame(focusTimer);
			const returnTarget =
				triggerRef?.current ?? previousFocusedElementRef.current;
			returnTarget?.focus();
		};
	}, [isOpen, onClose, triggerRef]);

	const handleClose = useCallback(() => {
		closeCountRef.current += 1;
		onClose();
	}, [onClose]);

	const handleOverlayClick = useCallback(() => {
		handleClose();
	}, [handleClose]);

	const handleContentClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			event.stopPropagation();
		},
		[]
	);

	if (!isOpen || !modalRoot) {
		return null;
	}

	return ReactDOM.createPortal(
		<div className={s.overlay} onClick={handleOverlayClick}>
			<div
				className={classNames(s.content, className)}
				onClick={handleContentClick}
				role='dialog'
				aria-modal='true'>
				<button
					ref={closeButtonRef}
					type='button'
					className={s.closeButton}
					onClick={handleClose}
					aria-label='Закрыть модальное окно'>
					×
				</button>
				{children}
			</div>
		</div>,
		modalRoot
	);
};
