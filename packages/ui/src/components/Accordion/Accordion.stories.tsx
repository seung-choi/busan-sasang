import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '@plug/ui';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: '단일/다중 확장 여부',
    },
    collapsible: {
      control: 'boolean',
      description: '모든 항목을 닫을 수 있는지 여부',
    }
  }
}

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>첫 번째 항목</Accordion.Trigger>
        <Accordion.Content>
          첫 번째 항목의 내용입니다. 
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>두 번째 항목</Accordion.Trigger>
        <Accordion.Content>
          두 번째 항목의 내용입니다.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>세 번째 항목</Accordion.Trigger>
        <Accordion.Content>
          세 번째 항목의 내용입니다.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
  args: {
    type: 'single',
    collapsible : true
  }
}

export const Multiple: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>첫 번째 항목</Accordion.Trigger>
        <Accordion.Content>
          다중 패널 확장에서는 여러 항목을 동시에 열 수 있습니다.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>두 번째 항목</Accordion.Trigger>
        <Accordion.Content>
          두 번째 항목의 내용입니다.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>세 번째 항목</Accordion.Trigger>
        <Accordion.Content>
          세 번째 항목의 내용입니다.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
  args: {
    type: 'multiple'
  }
}

export const Disabled: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="item-1">
      <Accordion.Trigger>활성화 항목</Accordion.Trigger>
        <Accordion.Content>
          활성화 항목입니다. 
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2" disabled>
        <Accordion.Trigger>비활성화된 항목</Accordion.Trigger>
        <Accordion.Content>
          비활성화된 항목입니다. 클릭이 불가능합니다.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
  args: {
    type: 'single',
    collapsible: true
  }
}