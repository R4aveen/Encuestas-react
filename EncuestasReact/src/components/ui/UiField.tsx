import React from 'react';
import { Form } from 'react-bootstrap';

interface UiFieldProps {
    label: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: string;
    placeholder?: string;
    as?: 'input' | 'textarea';
    rows?: number;
}

const UiField: React.FC<UiFieldProps> = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    as = 'input',
    rows,
}) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--color-text-paragraph)' }}>{label}</Form.Label>
            <Form.Control
                as={as as any}
                type={type}
                value={value}
                onChange={onChange}
                isInvalid={!!error}
                placeholder={placeholder}
                rows={rows}
            />
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    );
};

export default UiField;
