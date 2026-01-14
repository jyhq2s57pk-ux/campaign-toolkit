import NumberMarker from './NumberMarker';
import Badge from './Badge';
import './TouchpointItem.css';

export default function TouchpointItem({
  number,
  title,
  description,
  isOptional,
  isNew,
  isPremium,
  isExecutive,
  isStandard
}) {
  // Build badges array based on props
  const badges = [];
  if (isNew) badges.push({ label: 'New', color: 'new' });
  if (isPremium) badges.push({ label: 'Premium', color: 'premium' });
  if (isExecutive) badges.push({ label: 'Executive', color: 'executive' });
  if (isStandard) badges.push({ label: 'Standard', color: 'standard' });

  return (
    <div className="touchpoint-item">
      {/* Header: Number + Title */}
      <div className="touchpoint-header">
        <NumberMarker number={number} />
        <h3 className="touchpoint-title">{title}</h3>
      </div>

      {/* Badges - now positioned after title like in Figma design */}
      {badges.length > 0 && (
        <div className="touchpoint-badges">
          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.color} size="sm">
              {badge.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="touchpoint-description">{description}</p>

      {/* Optional indicator */}
      {isOptional && (
        <p className="touchpoint-optional">This module is optional</p>
      )}
    </div>
  );
}
