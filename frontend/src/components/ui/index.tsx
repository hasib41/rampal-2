import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
    const baseStyles = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center disabled:opacity-50';
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-secondary text-white hover:bg-secondary-light border border-gray-600',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    };
    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    );
}

// Card Component
interface CardProps {
    children: ReactNode;
    className?: string;
    dark?: boolean;
    onClick?: () => void;
}

export function Card({ children, className = '', dark = false, onClick }: CardProps) {
    return (
        <div onClick={onClick} className={`rounded-xl overflow-hidden ${dark ? 'bg-secondary-light' : 'bg-white shadow-lg'} ${className}`}>
            {children}
        </div>
    );
}

// Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => (
        <div className="space-y-1">
            {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
            <input
                ref={ref}
                className={`w-full px-4 py-3 bg-secondary-light border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
);
Input.displayName = 'Input';

// Textarea Component
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', ...props }, ref) => (
        <div className="space-y-1">
            {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
            <textarea
                ref={ref}
                className={`w-full px-4 py-3 bg-secondary-light border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors min-h-[120px] resize-y ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
);
Textarea.displayName = 'Textarea';

// Select Component
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
    error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, className = '', ...props }, ref) => (
        <div className="space-y-1">
            {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
            <select
                ref={ref}
                className={`w-full px-4 py-3 bg-secondary-light border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary transition-colors ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
);
Select.displayName = 'Select';

// Stat Component
interface StatProps {
    value: string;
    label: string;
    suffix?: string;
}

export function Stat({ value, label, suffix }: StatProps) {
    return (
        <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-white">
                {value}
                {suffix && <span className="text-primary-light text-2xl">{suffix}</span>}
            </p>
            <p className="text-gray-400 mt-2">{label}</p>
        </div>
    );
}

// Section Title Component
interface SectionTitleProps {
    title: string;
    subtitle?: string;
    light?: boolean;
    centered?: boolean;
}

export function SectionTitle({ title, subtitle, light = false, centered = true }: SectionTitleProps) {
    return (
        <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
            <h2 className={`text-3xl md:text-4xl font-bold ${light ? 'text-gray-900' : 'text-white'}`}>{title}</h2>
            {subtitle && <p className={`mt-4 text-lg ${light ? 'text-gray-600' : 'text-gray-400'}`}>{subtitle}</p>}
        </div>
    );
}

// Page Header Component
interface PageHeaderProps {
    title: string;
    subtitle?: string;
    bgColor?: string;
}

export function PageHeader({ title, subtitle, bgColor = 'from-primary to-primary-dark' }: PageHeaderProps) {
    return (
        <section className={`relative py-24 pt-32 bg-gradient-to-r ${bgColor}`}>
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">{title}</h1>
                {subtitle && <p className="mt-4 text-xl text-white/80 max-w-2xl">{subtitle}</p>}
            </div>
        </section>
    );
}

// Loading Spinner
export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
