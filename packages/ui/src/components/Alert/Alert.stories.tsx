import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@plug/ui';
import { Alert } from '../Alert';

const meta: Meta<typeof Alert> = {
    title: 'Components/Alert',
    component: Alert,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'success', 'error', 'notice', 'info']
        }
    }
};

export default meta;
type Story = StoryObj<typeof Alert>;

// 알럿 컨트롤러 컴포넌트
const AlertController: React.FC<{
    children: (props: { isOpen: boolean; onClose: () => void }) => React.ReactNode;
  }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
    }
    
    return (
      <div>
        <Button onClick={handleOpen}>Alert 열기</Button>
        {children({ isOpen, onClose: handleClose })}
      </div>
    );
  };

export const Default : Story = {
    render: (args) => (
        <AlertController>    
            {({ isOpen, onClose }) => (
                <Alert {...args} isOpen={isOpen} onClose={onClose}>
                    <Alert.Title>Alert Title</Alert.Title>
                    <Alert.Description>This is a basic alert.</Alert.Description>
                </Alert>
            )}
        </AlertController>
    )
}

export const Variant : Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">Variant: default</div>
            <AlertController>    
                {({ isOpen, onClose }) => (
                    <Alert isOpen={isOpen} onClose={onClose}>
                        <Alert.Title>Alert Title</Alert.Title>
                        <Alert.Description>This is a basic alert.</Alert.Description>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: success</div>
            <AlertController>    
                {({ isOpen, onClose }) => (
                    <Alert isOpen={isOpen} onClose={onClose} variant="success">
                        <Alert.Title>Success</Alert.Title>
                        <Alert.Description>Your operations was successful!</Alert.Description>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: error</div>
            <AlertController>    
                {({ isOpen, onClose }) => (
                    <Alert isOpen={isOpen} onClose={onClose} variant="error">
                        <Alert.Title>Error</Alert.Title>
                        <Alert.Description>Something went wrong</Alert.Description>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: notice</div>
            <AlertController>    
                {({ isOpen, onClose }) => (
                    <Alert isOpen={isOpen} onClose={onClose} variant="notice">
                        <Alert.Title>Notice</Alert.Title>
                        <Alert.Description>This action cannot be undone.</Alert.Description>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: info</div>
            <AlertController>    
                {({ isOpen, onClose }) => (
                    <Alert isOpen={isOpen} onClose={onClose} variant="info">
                        <Alert.Title>Info</Alert.Title>
                        <Alert.Description>Be Notice!</Alert.Description>
                    </Alert>
                )}
            </AlertController>
        </>
    )
}

