import type { Meta, StoryObj } from '@storybook/react';
import { Sheet } from '../Sheet';
import { Button } from '@plug/ui';
import { useState } from 'react';

const meta: Meta<typeof Sheet> = {
    title: 'Components/Sheet',
    component: Sheet,
    tags: ['autodocs'],
    argTypes:{
    isOpen: {
        control: 'boolean',
        description: 'Sheet가 열려있는지 여부',
        defaultValue: false
    },
    onClose: {
        action: 'closed',
        description: 'Sheet가 닫힐 때 호출되는 함수'
    },
    closeOnOverlayClick: {
        control: 'boolean',
        description: '오버레이 클릭 시 닫기 여부',
        defaultValue: true
    },
    closable: {
        control: 'boolean',
        description: '닫기 버튼 표시 여부',
        defaultValue: true
    },
    overlay: {
        control: 'boolean',
        description: '오버레이 표시 여부',
        defaultValue: true
    },
    position: {
        control: 'select',
        options: ['right', 'left', 'top', 'bottom'],
        description: 'Sheet의 위치',
        defaultValue: 'right'
    },
    className: {
        control: 'text',
        description: 'Sheet에 적용할 추가 클래스'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Sheet>;

// Sheet 컨트롤러 컴포넌트
const SheetController: React.FC<{
    children: (props: { isOpen: boolean; onClose: () => void }) => React.ReactNode;
  }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpen = () => {
        setIsOpen(true);
    }
    const handleClose = () => {
        setIsOpen(false);
    }
    
    return (
      <div>
        <Button onClick={handleOpen}>Sheet 열기</Button>
        {children({ isOpen, onClose: handleClose })}
      </div>
    );
  };

export const Default: Story = {
    render: (args) => (
        <SheetController>
            {({ isOpen, onClose }) => (
                <Sheet
                {...args}
                isOpen={isOpen}
                onClose={onClose}
            >
                <Sheet.Header className="text-lg font-semibold">
                    Sheet Header
                </Sheet.Header>
                <Sheet.Content>
                    <p>This is a sheet example.</p>
                </Sheet.Content>
                <Sheet.Footer>
                    <Button onClick={onClose}>닫기</Button>
                </Sheet.Footer>
            </Sheet>
            )}
        </SheetController>
    )
};

export const closeOnOverlayClick: Story = {
    render: (args) => (
        <>
            <div className="mt-4 mb-2">overlay 클릭 시 닫기</div>
            <SheetController>
                {({ isOpen, onClose }) => (
                    <Sheet
                        {...args}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <Sheet.Header>Sheet Header</Sheet.Header>
                        <Sheet.Content>Sheet Content</Sheet.Content>
                        <Sheet.Footer>Sheet Footer</Sheet.Footer>
                    </Sheet>
                )}
            </SheetController>

            <div className="mt-4 mb-2">overlay 클릭 시 닫기 비활성화</div>
            <SheetController>
                {({ isOpen, onClose }) => (
                    <Sheet
                        {...args}
                        closeOnOverlayClick={false}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <Sheet.Header>Sheet Header</Sheet.Header>
                        <Sheet.Content>Sheet Content</Sheet.Content>
                        <Sheet.Footer>Sheet Footer</Sheet.Footer>
                    </Sheet>
                )}
            </SheetController>
        </>
    )
};

export const ClosableButton: Story = {
    render: (args) => (
        <>
            <div className="mt-4 mb-2">close 버튼 활성화</div>
            <SheetController>
                {({ isOpen, onClose }) => (
                    <Sheet
                        {...args}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <Sheet.Header>Sheet Header</Sheet.Header>
                        <Sheet.Content>Sheet Content</Sheet.Content>
                        <Sheet.Footer>Sheet Footer</Sheet.Footer>
                    </Sheet>
                )}
            </SheetController>

            <div className="mt-4 mb-2">close 버튼 비활성화</div>
            <SheetController>
                {({ isOpen, onClose }) => (
                    <Sheet
                        {...args}
                        closable={false}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <Sheet.Header>Sheet Header</Sheet.Header>
                        <Sheet.Content>Sheet Content</Sheet.Content>
                        <Sheet.Footer>Sheet Footer</Sheet.Footer>
                    </Sheet>
                )}
            </SheetController>
        </>
    )
};

export const Overlay: Story = {
    render: (args) => (
        <>
            <div className="mt-4 mb-2">overlay 배경 활성화</div>
            <SheetController>
                {({ isOpen, onClose }) => (
                    <Sheet
                        {...args}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <Sheet.Header>Sheet Header</Sheet.Header>
                        <Sheet.Content>Sheet Content</Sheet.Content>
                        <Sheet.Footer>Sheet Footer</Sheet.Footer>
                    </Sheet>
                )}
            </SheetController>

            <div className="mt-4 mb-2">overlay 배경 비활성화</div>
            <SheetController>
                {({ isOpen, onClose }) => (
                    <Sheet
                        {...args}
                        overlay={false}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <Sheet.Header>Sheet Header</Sheet.Header>
                        <Sheet.Content>Sheet Content</Sheet.Content>
                        <Sheet.Footer>Sheet Footer</Sheet.Footer>
                    </Sheet>
                )}
            </SheetController>
        </>
    )
};

export const Position: Story = {
    render: (args) => (
        <>
            <div className="mt-4 mb-2">sheet position: right(default)</div>
            <SheetController>
                {({ isOpen, onClose }) => (
                    <Sheet
                        {...args}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <Sheet.Header>Sheet Header</Sheet.Header>
                        <Sheet.Content>Sheet Content</Sheet.Content>
                        <Sheet.Footer>Sheet Footer</Sheet.Footer>
                    </Sheet>
                )}
            </SheetController>

            <div className="mt-4 mb-2">sheet position: left</div>
            <SheetController>
                {({ isOpen, onClose }) => (
                    <Sheet
                        {...args}
                        position="left"
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <Sheet.Header>Sheet Header</Sheet.Header>
                        <Sheet.Content>Sheet Content</Sheet.Content>
                        <Sheet.Footer>Sheet Footer</Sheet.Footer>
                    </Sheet>
                )}
            </SheetController>

            <div className="mt-4 mb-2">sheet position: top</div>
            <SheetController>
                {({ isOpen, onClose }) => (
                    <Sheet
                        {...args}
                        position="top"
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <Sheet.Header>Sheet Header</Sheet.Header>
                        <Sheet.Content>Sheet Content</Sheet.Content>
                        <Sheet.Footer>Sheet Footer</Sheet.Footer>
                    </Sheet>
                )}
            </SheetController>

            <div className="mt-4 mb-2">sheet position: bottom</div>
            <SheetController>
                {({ isOpen, onClose }) => (
                    <Sheet
                        {...args}
                        position="bottom"
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <Sheet.Header>Sheet Header</Sheet.Header>
                        <Sheet.Content>Sheet Content</Sheet.Content>
                        <Sheet.Footer>Sheet Footer</Sheet.Footer>
                    </Sheet>
                )}
            </SheetController>
        </>
    )
};


