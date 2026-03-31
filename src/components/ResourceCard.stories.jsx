import ResourceCard from './ResourceCard';
import avoltaLogo from '../assets/logo1.svg';
import sampleImage from '../assets/omni/gen/balloon.png';

export default {
  title: 'Components/ResourceCard',
  component: ResourceCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export const Default = {
  args: {
    title: 'Brand Guidelines',
    image: avoltaLogo,
  },
};

export const WithCoverImage = {
  args: {
    title: 'Campaign Assets',
    image: sampleImage,
    imageFit: 'cover',
  },
};

export const WithLink = {
  args: {
    title: 'Download Template',
    image: avoltaLogo,
    href: 'https://example.com',
  },
};

export const MobilePreview = {
  args: {
    title: 'Brand Guidelines',
    image: avoltaLogo,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const Grid = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, width: '100%' }}>
      <ResourceCard title="Brand Guidelines" image={avoltaLogo} />
      <ResourceCard title="Campaign Assets" image={sampleImage} imageFit="cover" />
      <ResourceCard title="Templates" image={avoltaLogo} />
      <ResourceCard title="Style Guide" image={avoltaLogo} />
    </div>
  ),
  decorators: [],
  parameters: { layout: 'padded' },
};
