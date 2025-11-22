import React from 'react';
import { Card } from 'react-bootstrap';

interface UiCardProps {
    header?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

const UiCard: React.FC<UiCardProps> = ({ header, children, className = '', noPadding = false }) => {
    return (
        <Card className={`border-0 shadow-sm h-100 ${className}`} style={{ borderRadius: '16px', backgroundColor: '#fff' }}>
            {header && (
                <Card.Header className="bg-transparent border-bottom-0 pt-4 px-4 pb-0">
                    <div className="fw-bold text-secondary text-uppercase small d-flex align-items-center gap-2" style={{ letterSpacing: '0.5px' }}>
                        {header}
                    </div>
                </Card.Header>
            )}
            <Card.Body className={noPadding ? 'p-0 rounded-bottom-4 overflow-hidden' : 'p-4'}>
                {children}
            </Card.Body>
        </Card>
    );
};

export default UiCard;