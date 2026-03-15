import ContentCard from './ContentCard';
import sampleImage from '../assets/omni/gen/balloon.png';
import sampleImage2 from '../assets/omni/gen/origami.png';

export default {
  title: 'Components/ContentCard',
  component: ContentCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    imageUrl: { control: 'text' },
    channels: { control: 'object' },
    className: { control: 'text' },
    aspectRatio: { control: 'text' },
    imageRatio: { control: 'text' },
    actionLabel: { control: 'text' },
    onClick: { action: 'clicked' },
    action: { control: false },
  },
  parameters: {
    layout: 'padded',
  },
};

export const Default = {
  args: {
    title: 'Balloon Pop Experience',
    imageUrl: sampleImage,
    channels: ['In-Store', 'Digital', 'Social'],
  },
};

export const WithDescription = {
  args: {
    title: 'Origami Workshop',
    imageUrl: sampleImage2,
    channels: ['In-Store'],
    description: 'An interactive paper-folding activation that engages passengers during dwell time.',
  },
};

export const NoImage = {
  args: {
    title: 'Placeholder Card',
    channels: ['Digital', 'Social'],
  },
};

export const NoBadges = {
  args: {
    title: 'Balloon Pop Experience',
    imageUrl: sampleImage,
    channels: [],
  },
};

export const CustomAspectRatio = {
  args: {
    title: 'Wide Format Card',
    imageUrl: sampleImage,
    channels: ['In-Store'],
    aspectRatio: '16 / 9',
    imageRatio: '60%',
  },
};

export const CustomAction = {
  args: {
    title: 'Custom Action Slot',
    imageUrl: sampleImage2,
    channels: ['Digital'],
    action: (
      <span style={{ color: '#BEF264', fontSize: 14, fontWeight: 500 }}>
        Open
      </span>
    ),
    actionLabel: 'Open activation details',
  },
};

export const MobilePreview = {
  args: {
    title: 'Balloon Pop Experience',
    imageUrl: sampleImage,
    channels: ['In-Store', 'Digital'],
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const Grid = {
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 24,
      width: '100%',
    }}>
      <ContentCard
        title="Balloon Pop Experience"
        imageUrl={sampleImage}
        channels={['In-Store', 'Digital', 'Social']}
      />
      <ContentCard
        title="Origami Workshop"
        imageUrl={sampleImage2}
        channels={['In-Store']}
      />
      <ContentCard
        title="No Image Card"
        channels={['Digital', 'Social']}
      />
    </div>
  ),
  decorators: [],
  parameters: {
    layout: 'padded',
  },
};
