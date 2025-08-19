import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index'; 

const meta: Meta<typeof Input.Text> = {
    title: 'Components/Input',
    tags: ['autodocs'],
    argTypes: {
        disabled: {
            control: 'boolean'
        },
        invalid: {
            control: 'boolean'
        },
        iconPosition: {
            control: 'select',
            options: ['leading', 'trailing']
        }
    },
}

export default meta;

export const TextInput: StoryObj<typeof Input.Text> = {
    args: {
        value: '',
        onChange: (v: string) => console.log(v),
        placeholder: '텍스트를 입력해주세요',
    },
    render: (args) => <Input.Text {...args} />,
}

export const TextInputInvalid: StoryObj<typeof Input.Text> = {
    args: {
        value: '',
        onChange: (v: string) => console.log(v),
        placeholder: '텍스트를 입력해주세요',
    },
    render: (args) => <Input.Text {...args} />,
}

export const TextInputDisabled: StoryObj<typeof Input.Text> = {
    args: {
        value: '',
        onChange: (v: string) => console.log(v),
        placeholder: '텍스트를 입력해주세요',
        disabled: true,
    },
    render: (args) => <Input.Text {...args} />,
}

export const PasswordInput: StoryObj<typeof Input.Text> = {
    args: {
        value: '',
        onChange: (v: string) => console.log(v),
        placeholder: '텍스트를 입력해주세요',
    },
    render: (args) => <Input.Text {...args} />,
}

export const InputWithLabel: StoryObj<typeof Input.Text> = {
    args: {
        value: '',
        onChange: (v: string) => console.log(v),
        placeholder: '이름을 입력해주세요'
    },
    render: (args) => (
        <Input.Box>
            <Input.Label>이름</Input.Label>
            <Input.Text {...args}/>
        </Input.Box>
    ),
}

export const InputWithHelperText: StoryObj<typeof Input.Text> = {
    args: {
        value: '',
        onChange: (v: string) => console.log(v),
        placeholder:'이름을 입력해주세요',
    },
    render: (args) => (
        <Input.Box>
            <Input.Label>이름</Input.Label>
            <Input.Text {...args} />
            <Input.HelperText>에러 문구 등 안내 문구 영역</Input.HelperText>
        </Input.Box>
    ),
}





