import type {Meta, StoryObj} from '@storybook/react'

import {Form} from './Form'
import {FormItem} from './Form'
import {Input} from '../Input'
import {Button} from '@plug/ui'
import {Checkbox} from '@plug/ui';
import {RadioGroup} from '../Radio';
import {email, maxLength, minLength, required} from "@plug/ui";
import {FormSubmitButton} from "../Button/Button";

interface FormValues {
    [key: string]: string | number | boolean;
    username: string;
    password: string;
    acceptTerms: boolean;
    gender: 'male' | 'female' | '';
}

const meta: Meta<typeof Form> = {
    title: 'Components/Form',
    component: Form,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Template: Story = {
    render: () => {
        const handleFinish = (values: FormValues) => {
            alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
        };

        return (
            <Form<FormValues> onSubmit={handleFinish}>
                <FormItem name="username" label='Username'>
                    <Input placeholder="Enter your username"/>
                </FormItem>
                <FormItem name="password" label='Password'>
                    <Input type="password" placeholder="Enter your password"/>
                </FormItem>
                <Button
                    type="submit"
                    color="primary"
                    disabled={false}
                >
                    Submit
                </Button>
            </Form>
        );
    }
};

export const Required: Story = {
    render: () => {
        const handleFinish = (values: FormValues) => {
            alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
        };

        return (
            <Form<FormValues> onSubmit={handleFinish}>
                <FormItem name="username" label='Username' required>
                    <Input placeholder="Enter your username"/>
                </FormItem>
                <FormItem name="password" label='Password' required>
                    <Input type="password" placeholder="Enter your password"/>
                </FormItem>
                <Button
                    type="submit"
                    color="primary"
                    disabled={false}
                >
                    Submit
                </Button>
            </Form>
        );
    }
};

export const WithCheckbox: Story = {
    render: () => {
            const handleSubmit = (values: FormValues) => {
                alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
            };

            return (
                <Form<FormValues> onSubmit={handleSubmit}>
                    <FormItem name="acceptTerms" label="Accept Terms">
                        <Checkbox
                            label="Accept terms and conditions"
                            color="primary"
                            size="medium"
                            type="rectangle"
                        />
                    </FormItem>
                    <Button
                        type="submit"
                        color="primary"
                    >
                        Submit
                    </Button>
                </Form>
            );
        }
};

export const WithRadio: Story = {
    render: () => {
        const handleFinish = (values: FormValues) => {
            alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
        };

        return (
            <Form<FormValues> onSubmit={handleFinish}>
                <FormItem name="gender" label="Gender" required>
                    <RadioGroup name="gender">
                        <RadioGroup.Item value="male" label='male'></RadioGroup.Item>
                        <RadioGroup.Item value="female" label='female'></RadioGroup.Item>
                    </RadioGroup>
                </FormItem>
                <Button
                    type="submit"
                    color="primary"
                    disabled={false}
                >
                    Submit
                </Button>
            </Form>
        );
    }
};

export const WithCustomValidation: Story = {
    render: () => {
        const handleFinish = (values: FormValues) => {
            alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
        };

        return (
            <Form<FormValues> onSubmit={handleFinish}>
                <FormItem name="username" label="Username" validate={[required(), email()]}>
                    <Input placeholder="Enter your username" />
                </FormItem>
                <FormItem name="password" label="Password" validate={[required(), minLength(8), maxLength(20)]}>
                    <Input type="password" placeholder="Enter your password" />
                </FormItem>
                <FormSubmitButton> Submit </FormSubmitButton>
            </Form>
        );
    }
};
