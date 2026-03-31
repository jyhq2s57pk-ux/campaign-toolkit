import CompactCampaignCard from './CompactCampaignCard';
import sampleImage from '../assets/omni/gen/balloon.png';

export default {
  title: 'Components/CompactCampaignCard',
  component: CompactCampaignCard,
  tags: ['autodocs'],
  argTypes: {
    primaryColor: { control: 'color' },
    variant: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    onClick: { action: 'clicked' },
  },
  parameters: { layout: 'padded' },
};

export const Vertical = {
  args: {
    id: '1',
    name: 'The Magic of Joy',
    subtitle: 'Holiday Season 2025',
    heroImage: sampleImage,
    activationDates: 'Oct–Dec 2025',
    scope: 'Global',
    channels: 'In-Store, Digital',
    primaryColor: '#8F53F0',
    variant: 'vertical',
    onClick: undefined,
  },
};

export const Horizontal = {
  args: {
    ...Vertical.args,
    variant: 'horizontal',
  },
};

export const LightBackground = {
  args: {
    ...Vertical.args,
    primaryColor: '#BEF264',
    name: 'Summer Refresh',
    subtitle: 'Light color — dark text auto-detection',
  },
};

export const Orange = {
  args: {
    ...Vertical.args,
    primaryColor: '#F97316',
    name: 'Heading up to two lines with optional highlight',
    subtitle: 'Feb 23, 2026',
    activationDates: 'October – December 2025',
    channels: 'Airports, Cruise Lines, Borders',
  },
};

export const NoImage = {
  args: {
    ...Vertical.args,
    heroImage: null,
    name: 'No Image Fallback',
    subtitle: 'Shows initial letter',
  },
};

export const Grid = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, width: '100%' }}>
      <CompactCampaignCard
        id="1"
        name="The Magic of Joy"
        subtitle="Holiday Season"
        heroImage={sampleImage}
        activationDates="Oct–Dec 2025"
        scope="Global"
        channels="In-Store, Digital"
        primaryColor="#8F53F0"
        onClick={() => {}}
      />
      <CompactCampaignCard
        id="2"
        name="Summer Refresh"
        subtitle="Q3 2026"
        heroImage={sampleImage}
        activationDates="Jul–Sep 2026"
        scope="Regional"
        channels="Digital"
        primaryColor="#BEF264"
        onClick={() => {}}
      />
      <CompactCampaignCard
        id="3"
        name="Travel Exclusive"
        subtitle="Year-round"
        scope="Global"
        channels="In-Store"
        primaryColor="#3B82F6"
        onClick={() => {}}
      />
    </div>
  ),
  decorators: [],
  parameters: { layout: 'padded' },
};
