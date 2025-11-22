import React from 'react';
import { Badge } from 'react-bootstrap';

interface UiBadgeProps {
    children: React.ReactNode;
    bg?: string;
    className?: string;
}

const UiBadge: React.FC<UiBadgeProps> = ({ children, bg = 'secondary', className = '' }) => {
    return (
        <Badge
            bg={bg}
            className={`px-3 py-2 rounded-pill fw-bold text-uppercase shadow-sm ${className}`}
            style={{
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
                verticalAlign: 'middle'
            }}
        >
            {children}
        </Badge>
    );
};

export default UiBadge;