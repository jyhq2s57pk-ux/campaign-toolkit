import LinkCard from './LinkCard';
import sampleImage from '../assets/omni/gen/balloon.png';
import sampleImage2 from '../assets/omni/gen/origami.png';

export default {
  title: 'Components/LinkCard',
  component: LinkCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export const Default = {
  args: {
    title: 'Title here',
    description: 'Learn how to use our iconography across product and marketing.',
    image: sampleImage,
    to: '/resources',
  },
};

export const NoDescription = {
  args: {
    title: 'Quick Link',
    image: sampleImage2,
    to: '/calendar',
  },
};

export const NoImage = {
  args: {
    title: 'Text-only Link',
    description: 'A link card without a thumbnail image.',
    to: '/resources',
  },
};

export const MobilePreview = {
  args: {
    title: 'Title here',
    description: 'Learn how to use our iconography across product and marketing.',
    image: sampleImage,
    to: '/resources',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const Stack = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <LinkCard
        title="Campaign Toolkit"
        description="Everything you need to launch and manage campaigns."
        image={sampleImage}
        to="/customer-journey"
      />
      <LinkCard
        title="Resource Library"
        description="Brand assets, templates, and guidelines."
        image={sampleImage2}
        to="/resources"
      />
      <LinkCard
        title="Calendar"
        description="Upcoming activations and key dates."
        to="/calendar"
      />
    </div>
  ),
  decorators: [],
  parameters: { layout: 'padded' },
};
