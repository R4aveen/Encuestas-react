import React from 'react';
import { Modal } from 'react-bootstrap';

interface UiModalProps {
    show: boolean;
    handleClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'lg' | 'xl';
}

const UiModal: React.FC<UiModalProps> = ({
    show,
    handleClose,
    title,
    children,
    footer,
    size = 'lg'
}) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size={size}
            backdrop="static"
            keyboard={false}
            contentClassName="border-0 shadow-lg rounded-4"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold h5 text-dark">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
                {children}
            </Modal.Body>
            {footer && (
                <Modal.Footer className="border-0 pt-0">
                    {footer}
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default UiModal;