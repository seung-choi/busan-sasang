import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from '@plug/ui';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../Card/Card';
import { cn } from '../../utils/classname';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: false },
    onClose: { action: 'closed' },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    overlayClassName: { control: 'text' },
    contentClassName: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

const DialogController: React.FC<{
  children: (props: { isOpen: boolean; onClose: () => void }) => React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
      <div>
        <Button onClick={() => setIsOpen(true)}>다이얼로그 열기</Button>
        {children({ isOpen, onClose: () => setIsOpen(false) })}
      </div>
  );
};

const DialogBody = ({
                      title,
                      children,
                      onClose,
                      className,
                    }: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}) => (
    <div
        onClick={(e) => e.stopPropagation()}
        className={cn('bg-white p-6 rounded-lg shadow-none', className)}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="text-sm text-slate-700">{children}</div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>닫기</Button>
      </div>
    </div>
);

export const Default: Story = {
  args: {
    closeOnOverlayClick: true,
    closeOnEsc: true,
  },
  render: (args) => (
      <DialogController>
        {({ isOpen, onClose }) => (
            <Dialog {...args} isOpen={isOpen} onClose={onClose}>
              <DialogBody title="기본 다이얼로그" onClose={onClose}>
                <p>다이얼로그는 모달과 팝업의 기본이 되는 컴포넌트입니다.</p>
                <p className="mt-2">오버레이와 포털 기능을 제공합니다.</p>
              </DialogBody>
            </Dialog>
        )}
      </DialogController>
  ),
};

export const CustomOverlay: Story = {
  args: {
    closeOnOverlayClick: true,
    closeOnEsc: true,
    overlayClassName: 'bg-blue-500 bg-opacity-30 backdrop-blur-xs',
  },
  render: (args) => (
      <DialogController>
        {({ isOpen, onClose }) => (
            <Dialog {...args} isOpen={isOpen} onClose={onClose}>
              <DialogBody title="커스텀 오버레이" onClose={onClose}>
                <p>overlayClassName 속성을 통해 오버레이의 스타일을 변경할 수 있습니다.</p>
              </DialogBody>
            </Dialog>
        )}
      </DialogController>
  ),
};

export const CustomContent: Story = {
  args: {
    contentClassName: 'max-w-md rounded-3xl overflow-hidden',
  },
  render: (args) => (
      <DialogController>
        {({ isOpen, onClose }) => (
            <Dialog {...args} isOpen={isOpen} onClose={onClose}>
              <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white"
                  onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-semibold mb-4">커스텀 콘텐츠</h2>
                <p>contentClassName 속성을 통해 콘텐츠 컨테이너의 스타일을 변경할 수 있습니다.</p>
                <div className="mt-6 flex justify-end">
                  <Button variant="ghost" className="bg-white text-purple-500 hover:bg-gray-100" onClick={onClose}>
                    닫기
                  </Button>
                </div>
              </div>
            </Dialog>
        )}
      </DialogController>
  ),
};

export const WithCard: Story = {
  args: {
    contentClassName: 'p-0 overflow-hidden shadow-none',
  },
  render: (args) => (
      <DialogController>
        {({ isOpen, onClose }) => (
            <Dialog {...args} isOpen={isOpen} onClose={onClose}>
              <Card className="border-0 shadow-none" onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                  <CardTitle>카드가 포함된 다이얼로그</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Dialog 컴포넌트 안에 Card 컴포넌트를 포함시킬 수 있습니다.</p>
                  <p className="mt-2">디자인 시스템을 유지하며 다양한 조합이 가능합니다.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={onClose}>
                    닫기
                  </Button>
                </CardFooter>
              </Card>
            </Dialog>
        )}
      </DialogController>
  ),
};
