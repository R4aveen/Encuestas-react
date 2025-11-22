import { forwardRef } from 'react';
import { Button, Spinner, type ButtonProps } from 'react-bootstrap';

interface UiButtonProps extends ButtonProps {
    loading?: boolean;
    isBlock?: boolean;
}

const UiButton = forwardRef<HTMLButtonElement, UiButtonProps>(({
    children,
    loading = false,
    isBlock = false,
    className = '',
    variant = 'primary',
    disabled,
    ...props
}, ref) => {
    return (
        <Button
            ref={ref}
            {...props}
            variant={variant}
            disabled={disabled || loading}
            className={`d-inline-flex align-items-center justify-content-center gap-2 fw-semibold px-4 py-2 ${isBlock ? 'w-100' : ''} ${className}`}
            style={{ borderRadius: '8px', transition: 'all 0.2s' }}
        >
            {loading && (
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            )}
            {children}
        </Button>
    );
});

UiButton.displayName = 'UiButton';

export default UiButton;