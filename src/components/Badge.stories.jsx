import Badge, { NewBadge, ExecutiveBadge, PremiumBadge, StandardBadge, OptionalBadge } from './Badge';

export default {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'new', 'executive', 'premium', 'standard', 'optional', 'magenta', 'success', 'purple'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    children: { control: 'text' },
  },
  parameters: { layout: 'padded' },
};

export const Default = {
  args: {
    children: 'Default',
    variant: 'default',
    size: 'sm',
  },
};

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="new">New</Badge>
      <Badge variant="executive">Executive</Badge>
      <Badge variant="premium">Premium</Badge>
      <Badge variant="standard">Standard</Badge>
      <Badge variant="optional">Optional</Badge>
      <Badge variant="magenta">Magenta</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="purple">Purple</Badge>
    </div>
  ),
};

export const AllSizes = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Badge variant="premium" size="sm">Small</Badge>
      <Badge variant="premium" size="md">Medium</Badge>
      <Badge variant="premium" size="lg">Large</Badge>
    </div>
  ),
};

export const Presets = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <NewBadge />
      <ExecutiveBadge />
      <PremiumBadge />
      <StandardBadge />
      <OptionalBadge />
    </div>
  ),
};
