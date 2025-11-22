import {  forwardRef, type FC, type HTMLAttributes, type ReactNode } from 'react';
import classNames from 'classnames';
import { Card, Collapse } from 'react-bootstrap';

export type TRounded = '0' | '1' | '2' | '3' | 'circle' | 'pill';

interface ICardTitleProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
export const CardTitle: FC<ICardTitleProps> = ({ children, className, ...rest }) => {
    const classes = classNames('d-flex align-items-center h5 fw-bold mb-0', className);
    return (
        <div data-component-name='Card/CardTitle' className={classes} {...rest}>
            {children}
        </div>
    );
};

interface ICardHeaderChildProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
export const CardHeaderChild: FC<ICardHeaderChildProps> = ({ children, className, ...rest }) => {
    const classes = classNames('d-flex flex-wrap align-items-start gap-3', className);
    return (
        <div data-component-name='Card/CardHeaderChild' className={classes} {...rest}>
            {children}
        </div>
    );
};

interface ICardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
export const CardHeader: FC<ICardHeaderProps> = ({ children, className, ...rest }) => {
    const classes = classNames(
        'd-flex flex-wrap align-items-center justify-content-between gap-3 px-4 pt-4 pb-3 bg-transparent border-bottom-0',
        className
    );
    return (
        <Card.Header data-component-name='Card/CardHeader' className={classes} {...rest}>
            {children}
        </Card.Header>
    );
};

interface ICardBodyProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
export const CardBody: FC<ICardBodyProps> = ({ children, className, ...rest }) => {
    const classes = classNames('flex-grow-1 px-4 pb-4', className);
    return (
        <Card.Body data-component-name='Card/CardBody' className={classes} {...rest}>
            {children}
        </Card.Body>
    );
};

interface ICardBodyCollapseProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    isOpen: boolean;
}
export const CardBodyCollapse: FC<ICardBodyCollapseProps> = ({ children, className, isOpen, ...rest }) => {
    return (
        <Collapse in={isOpen}>
            <div data-component-name='Card/CardBodyCollapse'>
                <Card.Body className={classNames('px-4 pb-4', className)} {...rest}>
                    {children}
                </Card.Body>
            </div>
        </Collapse>
    );
};

interface ICardFooterChildProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
export const CardFooterChild: FC<ICardFooterChildProps> = ({ children, className, ...rest }) => {
    const classes = classNames('d-flex flex-wrap align-items-center gap-3', className);
    return (
        <div data-component-name='Card/CardFooterChild' className={classes} {...rest}>
            {children}
        </div>
    );
};

interface ICardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
export const CardFooter: FC<ICardFooterProps> = ({ children, className, ...rest }) => {
    const classes = classNames(
        'd-flex flex-wrap align-items-center justify-content-between gap-3 px-4 pb-4 pt-3 bg-transparent border-top-0',
        className
    );
    return (
        <Card.Footer data-component-name='Card/CardFooter' className={classes} {...rest}>
            {children}
        </Card.Footer>
    );
};

interface ICardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    rounded?: TRounded;
}

const CardComponent = forwardRef<HTMLDivElement, ICardProps>((props, ref) => {
    const { children, className, rounded = '3', ...rest } = props;

    // Clases base de Bootstrap para Cards modernas
    const cardClasses = classNames(
        'd-flex flex-col border-0 shadow-sm', // Estilos modernos (sin borde, con sombra)
        { [`rounded-${rounded}`]: rounded },
        'bg-white', // Fondo blanco por defecto
        className
    );

    return (
        <Card ref={ref} data-component-name='Card' className={cardClasses} {...rest}>
            {children}
        </Card>
    );
});

CardComponent.displayName = 'UiCard';

export default CardComponent;