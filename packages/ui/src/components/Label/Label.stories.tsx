import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';
import { Input } from '../Input';

const meta: Meta<typeof Label> = {
    title: 'Components/Label',
    component: Label,
    tags: ['autodocs'],
}

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
    render: (args) => (
        <Label {...args} htmlFor="label-id1"></Label>
    ),
    args:{
        children: '기본 라벨 텍스트입니다.'
    }
}

export const Sizes: Story = {
    render: () => (
        <>
            <div className="mt-4">Small:</div>
            <Label htmlFor="label-id2" size='small'>Small Size</Label>
            <div className="mt-4">Medium:</div>
            <Label htmlFor="label-id3" size='medium'>Medium Size</Label>
            <div className="mt-4">Large:</div>
            <Label htmlFor="label-id4" size='large'>Large Size</Label>
        </>
    )
}

export const Colors: Story = {
    render: () => (
        <>
            <div className="mt-4">Small:</div>
            <Label htmlFor="label-id5" color='primary'>Small Size</Label>
            <div className="mt-4">Medium:</div>
            <Label htmlFor="label-id6" color='secondary'>Medium Size</Label>
            <div className="mt-4">Large:</div>
            <Label htmlFor="label-id7" color='destructive'>Large Size</Label>
        </>
    )
}

export const Required: Story = {
    render: (args) => (
        <Label {...args} htmlFor="label-id8" required></Label>
    ),
    args:{
        children: '필수 입력 상태'
    }
}

export const WithInput: Story = {
    render: (args) => (
        <div className="flex gap-1 items-center">
            <Label {...args} htmlFor="label-id9" required />
            <Input.Text
                id="label-id9"
                value=""
                onChange={() => {}}
                placeholder="텍스트를 입력하세요"
            />
        </div>
    ),
    args: {
        children: 'Input 등 입력 요소들과 같이 사용 가능합니다.',
    },
}
