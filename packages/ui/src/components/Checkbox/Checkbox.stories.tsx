import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from '@plug/ui';

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    argTypes:{
        color:{
            control: 'select',
            options: ['primary', 'secondary']
        },
        size:{
            control: 'select',
            options: ['small', 'medium', 'large']
        },
        type:{
            control: 'select',
            options: ['rectangle', 'circle']
        },
        disabled:{
            control: 'boolean',
        },
        indeterminate:{
            control: 'boolean',
            description: '중간 상태 지원'
        }
    }
}

export default meta;

type Story = StoryObj<typeof Checkbox>;

// 체크박스 상태 관리를 위한 컨트롤러 컴포넌트
const CheckboxController: React.FC<{
  children: (props: { checked: boolean; onChange: (checked: boolean) => void }) => React.ReactNode;
  initialChecked?: boolean;
}> = ({ children, initialChecked = false }) => {
  const [checked, setChecked] = useState(initialChecked);
  
  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
  };
  
  return children({ checked, onChange: handleChange });
};


export const Default: Story = {
    render: (args) => (
        <CheckboxController>
            {({ checked, onChange }) => (
                <div>
                    <Checkbox 
                        {...args} 
                        checked={checked} 
                        onChange={onChange} 
                        label="Checkbox"
                    />
                </div>
            )}
        </CheckboxController>
    ),
}

export const Colors: Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">Color: primary</div>
            <CheckboxController>
                {({ checked, onChange }) => (
                    <Checkbox color="primary" checked={checked} onChange={onChange} label="색상 primary"/>
                )}
            </CheckboxController>

            <div className="mt-4 mb-2">Color: Secondary</div>
            <CheckboxController>
                {({ checked, onChange }) => (
                    <Checkbox color="secondary" checked={checked} onChange={onChange} label="색상 secondary"/>
                )}
            </CheckboxController>
        </>
    ),
}

export const Sizes: Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">Size: small</div>
            <CheckboxController>
                {({ checked, onChange }) => (
                    <Checkbox size="small" checked={checked} onChange={onChange} label="small"/>
                )}
            </CheckboxController>

            <div className="mt-4 mb-2">Size: medium</div>
            <CheckboxController>
                {({ checked, onChange }) => (
                    <Checkbox size="medium" checked={checked} onChange={onChange} label="medium"/>
                )}
            </CheckboxController>

            <div className="mt-4 mb-2">Size: large</div>
            <CheckboxController>
                {({ checked, onChange }) => (
                    <Checkbox size="large" checked={checked} onChange={onChange} label="large"/>
                )}
            </CheckboxController>
        </>
    ),
}

export const Types: Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">Type: rectangle</div>
            <CheckboxController>
                {({ checked, onChange }) => (
                    <Checkbox type="rectangle" checked={checked} onChange={onChange} label="checkbox 사각형"/>
                )}
            </CheckboxController>

            <div className="mt-4 mb-2">Type: circle</div>
            <CheckboxController>
                {({ checked, onChange }) => (
                    <Checkbox type="circle" checked={checked} onChange={onChange} label="checkbox 원형"/>
                )}
            </CheckboxController>
        </>
    ),
}

export const Disabled: Story = {
    render: (args) => (
        <>
            <div className="mt-4 mb-2">체크 비활성화</div>
            <CheckboxController initialChecked={true}>
                {({ checked, onChange }) => (
                    <Checkbox 
                        {...args} 
                        checked={checked} 
                        onChange={onChange} 
                        disabled={true} 
                        label="비활성화"
                    />
                )}
            </CheckboxController>

            <div className="mt-4 mb-2">언체크 비활성화</div>
            <CheckboxController initialChecked={false}>
                {({ checked, onChange }) => (
                    <Checkbox 
                        {...args} 
                        checked={checked} 
                        onChange={onChange} 
                        disabled={true} 
                        label="비활성화"
                    />
                )}
            </CheckboxController>
        </>
    ),
}

export const Indeterminate: Story = {
    render: (args) => (
        <CheckboxController>
            {({ checked, onChange }) => (
                <Checkbox 
                    {...args} 
                    checked={checked} 
                    onChange={onChange} 
                    indeterminate={true} 
                    label="indeterminate"
                />
            )}
        </CheckboxController>
    ),
}

export const CustomInput: Story = {
    render: (args) => (
        <CheckboxController>
            {({ checked, onChange }) => (
                <Checkbox 
                    {...args} 
                    checked={checked} 
                    onChange={onChange} 
                    className="text-orange-500" 
                    inputClassName="bg-orange-500 border-white" 
                    label="custom Input"
                />
            )}
        </CheckboxController>
    ),
}
