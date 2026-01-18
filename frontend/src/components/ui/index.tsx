import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { forwardRef, useState } from 'react';
import { Loader2, AlertCircle, CheckCircle, Info, X } from 'lucide-react';

// ============================================================================
// BUTTON
// ============================================================================
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'warning';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
}

const buttonVariants: Record<ButtonVariant, string> = {
    primary: 'bg-primary hover:bg-primary-light text-white shadow-lg shadow-primary/25 hover:shadow-primary/40',
    secondary: 'bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20',
    ghost: 'hover:bg-white/5 text-gray-400 hover:text-white',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30',
    success: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
    outline: 'bg-transparent hover:bg-white/5 text-gray-200 border border-white/20 hover:border-white/30',
    warning: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/30',
};

const buttonSizes: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1.5 text-xs gap-1.5',
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
};

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
                inline-flex items-center justify-center font-medium rounded-xl
                transition-all duration-200 ease-out
                disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-secondary-dark
                ${buttonVariants[variant]}
                ${buttonSizes[size]}
                ${className}
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : leftIcon}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
}

// ============================================================================
// ICON BUTTON
// ============================================================================
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    variant?: ButtonVariant;
    size?: 'sm' | 'md' | 'lg';
    tooltip?: string;
}

const iconButtonSizes = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
};

export function IconButton({ icon, variant = 'ghost', size = 'md', tooltip, className = '', ...props }: IconButtonProps) {
    return (
        <button
            title={tooltip}
            className={`
                rounded-lg transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${buttonVariants[variant]}
                ${iconButtonSizes[size]}
                ${className}
            `}
            {...props}
        >
            {icon}
        </button>
    );
}

// ============================================================================
// INPUT
// ============================================================================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, rightIcon, className = '', ...props }, ref) => (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-gray-300">
                    {label}
                    {props.required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
                        w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                        text-[15px] text-gray-200 placeholder-gray-500
                        transition-all duration-200
                        hover:border-white/20
                        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${leftIcon ? 'pl-10' : ''}
                        ${rightIcon ? 'pr-10' : ''}
                        ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
                        ${className}
                    `}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                        {rightIcon}
                    </div>
                )}
            </div>
            {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
            {error && <p className="text-sm text-red-400 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
        </div>
    )
);
Input.displayName = 'Input';

// ============================================================================
// TEXTAREA
// ============================================================================
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
    showCount?: boolean;
    maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, showCount, maxLength, className = '', value, ...props }, ref) => {
        const currentLength = typeof value === 'string' ? value.length : 0;
        
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-gray-300">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    value={value}
                    maxLength={maxLength}
                    className={`
                        w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                        text-[15px] text-gray-200 placeholder-gray-500
                        transition-all duration-200 resize-none
                        hover:border-white/20
                        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
                        ${className}
                    `}
                    {...props}
                />
                <div className="flex items-center justify-between">
                    {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
                    {error && <p className="text-sm text-red-400 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
                    {showCount && maxLength && (
                        <p className={`text-sm ml-auto ${currentLength >= maxLength ? 'text-red-400' : 'text-gray-500'}`}>
                            {currentLength}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

// ============================================================================
// SELECT
// ============================================================================
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', ...props }, ref) => (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-gray-300">
                    {label}
                    {props.required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <select
                ref={ref}
                className={`
                    w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg
                    text-[15px] text-gray-200
                    transition-all duration-200
                    hover:border-white/20
                    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${error ? 'border-red-500/50' : ''}
                    ${className}
                `}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-secondary-dark">
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-400 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
        </div>
    )
);
Select.displayName = 'Select';

// ============================================================================
// TOGGLE
// ============================================================================
interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
    return (
        <label className={`flex items-center gap-4 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={`
                    relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent
                    transition-colors duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-secondary-dark
                    ${checked ? 'bg-primary' : 'bg-white/10'}
                `}
            >
                <span
                    className={`
                        pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg
                        transform transition duration-200 ease-in-out
                        ${checked ? 'translate-x-5' : 'translate-x-0'}
                    `}
                />
            </button>
            {(label || description) && (
                <div>
                    {label && <p className="text-sm font-medium text-gray-200">{label}</p>}
                    {description && <p className="text-xs text-gray-500">{description}</p>}
                </div>
            )}
        </label>
    );
}

// ============================================================================
// CHECKBOX
// ============================================================================
interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
    return (
        <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-secondary-dark
                    ${checked ? 'bg-primary border-primary' : 'bg-white/5 border-white/20 hover:border-white/30'}
                `}
            >
                {checked && (
                    <CheckCircle className="text-white" size={14} />
                )}
            </button>
            {label && <span className="text-sm text-gray-300">{label}</span>}
        </label>
    );
}

// ============================================================================
// BADGE
// ============================================================================
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: 'sm' | 'md';
    dot?: boolean;
}

const badgeVariants: Record<BadgeVariant, string> = {
    default: 'bg-white/10 text-gray-300',
    primary: 'bg-primary/20 text-primary-light',
    success: 'bg-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/20 text-amber-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
};

export function Badge({ children, variant = 'default', size = 'sm', dot }: BadgeProps) {
    return (
        <span
            className={`
                inline-flex items-center gap-1.5 font-medium rounded-full capitalize
                ${badgeVariants[variant]}
                ${size === 'sm' ? 'px-2.5 py-1 text-sm' : 'px-3 py-1.5 text-sm'}
            `}
        >
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${
                    variant === 'success' ? 'bg-emerald-400' :
                    variant === 'warning' ? 'bg-amber-400' :
                    variant === 'danger' ? 'bg-red-400' :
                    variant === 'primary' ? 'bg-primary-light' :
                    variant === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                }`} />
            )}
            {children}
        </span>
    );
}

// ============================================================================
// CARD
// ============================================================================
interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    dark?: boolean;
    onClick?: () => void;
}

const cardPadding = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

export function Card({ children, className = '', hover = false, padding = 'md', dark = false, onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`
                ${dark ? 'bg-secondary-dark border-gray-700' : 'bg-white/[0.02] border-white/[0.05]'}
                backdrop-blur-sm border rounded-2xl
                ${hover || onClick ? 'hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200 cursor-pointer' : ''}
                ${cardPadding[padding]}
                ${className}
            `}
        >
            {children}
        </div>
    );
}

// ============================================================================
// STAT CARD
// ============================================================================
interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon: ReactNode;
    iconColor?: string;
}

export function StatCard({ title, value, change, trend, icon, iconColor = 'bg-primary/20 text-primary-light' }: StatCardProps) {
    return (
        <Card className="relative overflow-hidden">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {change && (
                        <p className={`text-sm flex items-center gap-1 ${
                            trend === 'up' ? 'text-emerald-400' : 
                            trend === 'down' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                            {change}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${iconColor}`}>
                    {icon}
                </div>
            </div>
            {/* Decorative gradient */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
        </Card>
    );
}

// ============================================================================
// PAGE HEADER
// ============================================================================
interface PageHeaderProps {
    title: string;
    description?: string;
    subtitle?: string;
    bgImage?: string;
    action?: ReactNode;
}

export function PageHeader({ title, description, subtitle, bgImage, action }: PageHeaderProps) {
    if (bgImage) {
        return (
            <div
                className="relative py-24 pt-32 bg-cover bg-center"
                style={{ backgroundImage: `url('${bgImage}')` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
                <div className="relative max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">{title}</h1>
                    {subtitle && <p className="mt-4 text-xl text-white/80 max-w-2xl">{subtitle}</p>}
                    {description && <p className="text-gray-300 mt-2">{description}</p>}
                    {action && <div className="mt-6">{action}</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {subtitle && <p className="text-xl text-white/80 mt-1">{subtitle}</p>}
                {description && <p className="text-gray-400 mt-1">{description}</p>}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}

// ============================================================================
// EMPTY STATE
// ============================================================================
interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-2xl bg-white/5 text-gray-400 mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-medium text-gray-200">{title}</h3>
            {description && <p className="text-gray-500 mt-1 max-w-sm">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

// ============================================================================
// LOADING STATE
// ============================================================================
interface LoadingStateProps {
    text?: string;
}

export function LoadingState({ text = 'Loading...' }: LoadingStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-gray-400">{text}</p>
        </div>
    );
}

// ============================================================================
// MODAL
// ============================================================================
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    footer?: ReactNode;
}

const modalSizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, title, description, children, size = 'md', footer }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`
                        relative w-full ${modalSizes[size]}
                        bg-secondary-dark border border-white/10 rounded-2xl shadow-2xl
                        transform transition-all
                    `}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-white/5">
                        <div>
                            <h3 className="text-xl font-semibold text-white">{title}</h3>
                            {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 -m-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 bg-white/[0.02]">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// CONFIRM MODAL
// ============================================================================
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning';
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading,
}: ConfirmModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p className="text-gray-300">{message}</p>
        </Modal>
    );
}

// ============================================================================
// SEARCH INPUT
// ============================================================================
interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onClear?: () => void;
}

export function SearchInput({ value, onClear, className = '', ...props }: SearchInputProps) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                value={value}
                className={`
                    w-full pl-12 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl
                    text-[15px] text-gray-200 placeholder-gray-500
                    transition-all duration-200
                    hover:border-white/20
                    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                    ${className}
                `}
                {...props}
            />
            {value && onClear && (
                <button
                    onClick={onClear}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}

// ============================================================================
// TABS
// ============================================================================
interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
    return (
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${activeTab === tab.id
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                    `}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

// ============================================================================
// ALERT
// ============================================================================
type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: ReactNode;
    onClose?: () => void;
}

const alertVariants: Record<AlertVariant, { bg: string; border: string; icon: typeof Info }> = {
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Info },
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertCircle },
    error: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle },
};

export function Alert({ variant = 'info', title, children, onClose }: AlertProps) {
    const config = alertVariants[variant];
    const Icon = config.icon;
    
    return (
        <div className={`flex gap-3 p-4 rounded-xl border ${config.bg} ${config.border}`}>
            <Icon className={`shrink-0 mt-0.5 ${
                variant === 'success' ? 'text-emerald-400' :
                variant === 'warning' ? 'text-amber-400' :
                variant === 'error' ? 'text-red-400' : 'text-blue-400'
            }`} size={20} />
            <div className="flex-1">
                {title && <p className="font-medium text-gray-200">{title}</p>}
                <div className="text-gray-400 text-sm">{children}</div>
            </div>
            {onClose && (
                <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
                    <X size={16} />
                </button>
            )}
        </div>
    );
}

// ============================================================================
// TABLE
// ============================================================================
interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string | number;
    isLoading?: boolean;
    emptyState?: ReactNode;
    onRowClick?: (item: T) => void;
}

export function DataTable<T>({
    columns,
    data,
    keyExtractor,
    isLoading,
    emptyState,
    onRowClick,
}: DataTableProps<T>) {
    if (isLoading) {
        return <LoadingState />;
    }

    if (data.length === 0 && emptyState) {
        return <>{emptyState}</>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/5">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data.map((item) => (
                        <tr
                            key={keyExtractor(item)}
                            onClick={() => onRowClick?.(item)}
                            className={`
                                hover:bg-white/[0.02] transition-colors
                                ${onRowClick ? 'cursor-pointer' : ''}
                            `}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className={`py-4 px-6 ${col.className || ''}`}>
                                    {col.render 
                                        ? col.render(item) 
                                        : (item as Record<string, unknown>)[col.key] as ReactNode
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ============================================================================
// AVATAR
// ============================================================================
interface AvatarProps {
    src?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const avatarSizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
};

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`${avatarSizes[size]} rounded-full object-cover bg-white/10`}
            />
        );
    }

    return (
        <div
            className={`
                ${avatarSizes[size]} rounded-full
                bg-gradient-to-br from-primary to-primary-dark
                flex items-center justify-center font-medium text-white
            `}
        >
            {initials}
        </div>
    );
}

// ============================================================================
// DROPDOWN
// ============================================================================
interface DropdownItem {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    variant?: 'default' | 'danger';
}

interface DropdownProps {
    trigger: ReactNode;
    items: DropdownItem[];
    align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="relative">
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>
            
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className={`
                            absolute z-50 mt-2 w-48
                            bg-secondary-dark border border-white/10 rounded-xl shadow-xl
                            py-1 overflow-hidden
                            ${align === 'right' ? 'right-0' : 'left-0'}
                        `}
                    >
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-2.5 text-sm
                                    transition-colors
                                    ${item.variant === 'danger'
                                        ? 'text-red-400 hover:bg-red-500/10'
                                        : 'text-gray-300 hover:bg-white/5'
                                    }
                                `}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// Re-export for compatibility
export function LoadingSpinner() {
    return <LoadingState />;
}

// ============================================================================
// SECTION TITLE
// ============================================================================
interface SectionTitleProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
    light?: boolean;
}

export function SectionTitle({ title, subtitle, centered = false, light = false }: SectionTitleProps) {
    return (
        <div className={centered ? 'text-center' : ''}>
            <h2 className={`text-3xl md:text-4xl font-bold ${light ? 'text-white' : 'text-gray-900'}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`mt-4 text-lg ${light ? 'text-gray-300' : 'text-gray-600'}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}

// ============================================================================
// STAT (for homepage)
// ============================================================================
interface StatProps {
    value: string;
    label: string;
    icon?: ReactNode;
    suffix?: string;
}

export function Stat({ value, label, icon, suffix }: StatProps) {
    return (
        <div className="text-center">
            {icon && <div className="flex justify-center mb-2 text-primary">{icon}</div>}
            <div className="text-3xl md:text-4xl font-bold text-white">
                {value}{suffix && <span className="text-primary-light">{suffix}</span>}
            </div>
            <div className="text-gray-400 mt-1">{label}</div>
        </div>
    );
}
