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
  isExecutive
}) {
  return (
    <div className="touchpoint-item">
      <div className="touchpoint-header">
        <NumberMarker number={number} />
        <h3 className="touchpoint-title">{title}</h3>
      </div>

      <p className="touchpoint-description">{description}</p>

      {isOptional && (
        <p className="touchpoint-optional">This module is optional</p>
      )}

      <div className="touchpoint-badges">
        {isNew && <Badge variant="new">New</Badge>}
        {isPremium && <Badge variant="premium">Premium</Badge>}
        {isExecutive && <Badge variant="executive">Executive</Badge>}
      </div>
    </div>
  );
}
