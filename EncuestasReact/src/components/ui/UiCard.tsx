import React from 'react';
import { Card } from 'react-bootstrap';

interface UiCardProps {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

const UiCard: React.FC<UiCardProps> = ({ header, footer, children, className }) => {
    return (
        <Card
            className={className}
            style={{
                backgroundColor: 'var(--color-background-page)',
                borderColor: 'var(--color-highlight)'
            }}
        >
            {header && (
                <Card.Header style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                    {header}
                </Card.Header>
            )}
            <Card.Body>
                {children}
            </Card.Body>
            {footer && (
                <Card.Footer style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                    {footer}
                </Card.Footer>
            )}
        </Card>
    );
};

export default UiCard;
