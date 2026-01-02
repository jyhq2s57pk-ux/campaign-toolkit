import './Badge.css';

/**
 * Badge Component - Unified badge styling for the Campaign Toolkit
 * 
 * @param {Object} props
 * @param {'new'|'executive'|'premium'|'standard'|'optional'|'magenta'|'success'|'purple'|'default'} props.variant - Color variant
 * @param {'sm'|'md'|'lg'} props.size - Size variant (sm = small/default, md = medium, lg = large)
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.className - Additional CSS classes
 */
export default function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className = ''
}) {
  const sizeClass = size !== 'sm' ? `badge--${size}` : '';
  const variantClass = `badge--${variant}`;

  return (
    <span className={`badge ${sizeClass} ${variantClass} ${className}`.trim()}>
      {children}
    </span>
  );
}

/**
 * Pre-configured badge components for common use cases
 */
export const NewBadge = ({ size, className }) => (
  <Badge variant="new" size={size} className={className}>New</Badge>
);

export const ExecutiveBadge = ({ size, className }) => (
  <Badge variant="executive" size={size} className={className}>Executive</Badge>
);

export const PremiumBadge = ({ size, className }) => (
  <Badge variant="premium" size={size} className={className}>Premium</Badge>
);

export const StandardBadge = ({ size, className }) => (
  <Badge variant="standard" size={size} className={className}>Standard</Badge>
);

export const OptionalBadge = ({ size, className }) => (
  <Badge variant="optional" size={size} className={className}>Optional</Badge>
);
