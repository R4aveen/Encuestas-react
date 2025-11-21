import React from 'react';
import { Button, type ButtonProps, Spinner } from 'react-bootstrap';

interface UiButtonProps extends ButtonProps {
    loading?: boolean;
}

const UiButton: React.FC<UiButtonProps> = ({
    children,
    loading = false,
    style,
    ...props
}) => {
    return (
        <Button
            {...props}
            style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-text)',
                borderColor: 'var(--color-primary)',
                ...style,
            }}
            disabled={props.disabled || loading}
        >
            {loading ? (
                <>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                    />
                    Loading...
                </>
            ) : (
                children
            )}
        </Button>
    );
};

export default UiButton;
