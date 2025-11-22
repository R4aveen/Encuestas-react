import React, { forwardRef } from 'react';
import { Button, Spinner, type ButtonProps } from 'react-bootstrap';
import classNames from 'classnames';

export type TButtonVariant = 'solid' | 'outline' | 'ghost';
export type TButtonColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
export type TButtonSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl';
export type TRounded = 'rounded' | 'rounded-pill' | 'rounded-0' | 'rounded-circle';

export interface UiButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
    // Props personalizadas
    variant?: TButtonVariant;
    color?: TButtonColor;
    size?: TButtonSize;            // Tamaños extendidos
    rounded?: TRounded;            // Bordes
    icon?: React.ReactNode;        // Icono izquierdo
    rightIcon?: React.ReactNode;   // Icono derecho
    isLoading?: boolean;           // Estado de carga
    isBlock?: boolean;             // Ancho completo
}

const UiButton = forwardRef<HTMLButtonElement, UiButtonProps>((props, ref) => {
    const {
        children,
        className,
        variant = 'solid',
        color = 'primary',
        size = 'default',
        rounded = 'rounded',
        icon,
        rightIcon,
        isLoading = false,
        disabled = false,
        isBlock = false,
        type = 'button',
        ...rest
    } = props;

    // 1. Lógica para resolver la variante de Bootstrap (ej: 'primary' vs 'outline-primary')
    const getBootstrapVariant = (): string => {
        if (variant === 'ghost') return 'link'; // Ghost se comporta como link o sin bordes
        if (variant === 'outline') return `outline-${color}`;
        return color; // Default 'solid'
    };

    // 2. Lógica para resolver tamaños (Bootstrap solo tiene sm y lg, simulamos xs y xl)
    const getSizeClass = (): string => {
        switch (size) {
            case 'xs': return 'py-1 px-2 fs-6 fw-normal'; // Extra small custom
            case 'sm': return 'btn-sm';
            case 'lg': return 'btn-lg';
            case 'xl': return 'btn-lg py-3 px-5 fs-4'; // Extra large custom
            default: return ''; // Default size
        }
    };

    // 3. Clases adicionales
    const classes = classNames(
        'd-inline-flex align-items-center justify-content-center gap-2', // Flexbox para alinear iconos y texto
        'fw-medium', // Fuente semi-bold para mejor estética
        'transition-base', // Clase para animaciones suaves (si tienes CSS global)
        getSizeClass(),
        rounded,
        { 'w-100': isBlock }, // Bloque completo
        { 'text-decoration-none': variant === 'ghost' }, // Quitar subrayado si es ghost
        className
    );

    return (
        <Button
            ref={ref}
            variant={getBootstrapVariant()}
            className={classes}
            disabled={disabled || isLoading}
            type={type}
            {...rest}
        >
            {/* Renderizado del Icono Izquierdo o Spinner */}
            {(isLoading || icon) && (
                <span className="d-flex align-items-center">
                    {isLoading ? (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className={classNames({ 'text-inherit': variant === 'outline' })}
                        />
                    ) : (
                        icon
                    )}
                </span>
            )}

            {/* Contenido del Botón */}
            {children && <span>{children}</span>}

            {/* Renderizado del Icono Derecho (solo si no está cargando, opcional) */}
            {rightIcon && !isLoading && (
                <span className="d-flex align-items-center">
                    {rightIcon}
                </span>
            )}
        </Button>
    );
});

UiButton.displayName = 'UiButton';

export default UiButton;