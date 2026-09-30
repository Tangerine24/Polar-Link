import React from 'react';

export type BadgeVariant =
  | 'VERIFIED'
  | 'DERIVED'
  | 'SUGGESTED'
  | 'UNVERIFIED'
  | 'REJECTED'
  | 'SUPPORTED'
  | 'NUMBER_MISMATCH'
  | 'UNIT_MISMATCH'
  | 'SCOPE_DRIFT'
  | 'CERTAINTY_DRIFT'
  | 'UNSUPPORTED'
  | 'UNBOUND'
  | 'READY_TO_PUBLISH'
  | 'READY_FOR_REVIEW'
  | 'BLOCKED'
  | 'CURRENT'
  | 'UNDER_REVIEW'
  | 'UNKNOWN';

interface BadgeProps {
  label?: string;
  variant: BadgeVariant | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant,
  className = '',
  size = 'md'
}) => {
  const displayLabel = label || variant.replace(/_/g, ' ');

  const getColors = () => {
    switch (variant) {
      case 'VERIFIED':
      case 'SUPPORTED':
      case 'READY_TO_PUBLISH':
      case 'CURRENT':
        return 'bg-success/15 text-success border-success/30';

      case 'DERIVED':
        return 'bg-accent/15 text-accent border-accent/30';

      case 'SUGGESTED':
      case 'READY_FOR_REVIEW':
      case 'UNDER_REVIEW':
      case 'CERTAINTY_DRIFT':
      case 'SCOPE_DRIFT':
        return 'bg-warning/15 text-warning border-warning/30';

      case 'NUMBER_MISMATCH':
      case 'UNIT_MISMATCH':
      case 'UNSUPPORTED':
      case 'BLOCKED':
      case 'REJECTED':
        return 'bg-danger/15 text-danger border-danger/30';

      case 'UNBOUND':
      case 'UNVERIFIED':
      case 'UNKNOWN':
      default:
        return 'bg-polarBorder/40 text-polarMuted border-polarBorder';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center font-mono-data font-medium border rounded uppercase tracking-wider ${sizeClasses} ${getColors()} ${className}`}
    >
      {displayLabel}
    </span>
  );
};
