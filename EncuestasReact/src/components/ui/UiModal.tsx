import React from 'react';
import { Modal } from 'react-bootstrap';

interface UiModalProps {
    show: boolean;
    handleClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const UiModal: React.FC<UiModalProps> = ({ show, handleClose, title, children, footer }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                <Modal.Title style={{ color: 'var(--color-text-headline)' }}>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: 'var(--color-background-page)' }}>
                {children}
            </Modal.Body>
            {footer && (
                <Modal.Footer style={{ backgroundColor: 'var(--color-background-page)' }}>
                    {footer}
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default UiModal;
