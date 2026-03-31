import FeatureBlock from './FeatureBlock';

export default {
  title: 'Components/FeatureBlock',
  component: FeatureBlock,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export const Default = {
  args: {
    number: 1,
    title: 'CLP Hero',
    description: 'Feature special SKUs by category in a new carousel to appear before Bestsellers.',
    badges: [
      { label: 'New', color: 'new' },
      { label: 'Executive', color: 'executive' },
      { label: 'Premium', color: 'premium' },
      { label: 'Standard', color: 'standard' },
    ],
  },
};

export const NoBadges = {
  args: {
    number: 2,
    title: 'Homepage Banner',
    description: 'Full-width hero banner on the store homepage with campaign key visual.',
    badges: [],
  },
};

export const SingleBadge = {
  args: {
    number: 3,
    title: 'Push Notification',
    description: 'Targeted mobile push notification to app users within the airport.',
    badges: [{ label: 'Premium', color: 'premium' }],
  },
};

export const Sequence = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <FeatureBlock
        number={1}
        title="CLP Hero"
        description="Feature special SKUs by category."
        badges={[
          { label: 'New', color: 'new' },
          { label: 'Premium', color: 'premium' },
        ]}
      />
      <FeatureBlock
        number={2}
        title="Homepage Banner"
        description="Full-width hero with campaign KV."
        badges={[{ label: 'Executive', color: 'executive' }]}
      />
      <FeatureBlock
        number={3}
        title="Push Notification"
        description="Targeted push to app users."
        badges={[
          { label: 'Premium', color: 'premium' },
          { label: 'Standard', color: 'standard' },
        ]}
      />
    </div>
  ),
  decorators: [],
  parameters: { layout: 'padded' },
};
