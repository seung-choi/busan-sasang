import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Popup } from './Popup';
import { Button } from '@plug/ui';
import { PopupPlacement } from './Popup.types';
import { Card, CardHeader, CardTitle, CardContent } from '../Card/Card';

const meta: Meta<typeof Popup> = {
  title: 'Components/Popup',
  component: Popup,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '팝업 표시 여부',
      defaultValue: false
    },
    onClose: {
      action: 'closed',
      description: '팝업이 닫힐 때 호출되는 함수'
    },
    title: {
      control: 'text',
      description: '팝업 제목'
    },
    placement: {
      control: 'select',
      options: ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight', 'center'],
      description: '팝업 위치',
      defaultValue: 'center'
    },
    width: {
      control: 'text',
      description: '팝업 너비'
    },
    closable: {
      control: 'boolean',
      description: '닫기 버튼 표시 여부',
      defaultValue: true
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: '오버레이 클릭 시 닫기 여부',
      defaultValue: true
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'ESC 키 누를 시 닫기 여부',
      defaultValue: true
    }
  },
};

export default meta;
type Story = StoryObj<typeof Popup>;

// 팝업 컨트롤러 컴포넌트
const PopupController: React.FC<{
  children: (props: { isOpen: boolean; onClose: () => void; placement: PopupPlacement }) => React.ReactNode;
  initialPlacement?: PopupPlacement;
}> = ({ children, initialPlacement = 'center' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<PopupPlacement>(initialPlacement);
  
  const handleOpen = (newPlacement: PopupPlacement) => {
    setPlacement(newPlacement);
    setIsOpen(true);
  };
  
  const handleClose = () => setIsOpen(false);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => handleOpen('top')}>상단</Button>
        <Button onClick={() => handleOpen('topLeft')}>상단-좌측</Button>
        <Button onClick={() => handleOpen('topRight')}>상단-우측</Button>
        <Button onClick={() => handleOpen('center')}>중앙</Button>
        <Button onClick={() => handleOpen('bottom')}>하단</Button>
        <Button onClick={() => handleOpen('bottomLeft')}>하단-좌측</Button>
        <Button onClick={() => handleOpen('bottomRight')}>하단-우측</Button>
      </div>
      {children({ isOpen, onClose: handleClose, placement })}
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <PopupController>
      {({ isOpen, onClose, placement }) => (
        <Popup
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          title="알림"
          placement={placement}
        >
          <p>팝업 내용이 여기에 들어갑니다.</p>
          <p className="mt-2">팝업은 일시적인 정보나 알림을 표시하는 데 사용됩니다.</p>
          <div className="mt-4 flex justify-end">
            <Button size="small" onClick={onClose}>확인</Button>
          </div>
        </Popup>
      )}
    </PopupController>
  ),
};

export const NoTitle: Story = {
  render: (args) => (
    <PopupController initialPlacement="center">
      {({ isOpen, onClose, placement }) => (
        <Popup
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          placement={placement}
        >
          <div className="text-center">
            <p>제목 없는 팝업입니다.</p>
            <p className="mt-2">title 속성을 제공하지 않으면 제목 영역이 표시되지 않습니다.</p>
            <Button className="mt-4" size="small" onClick={onClose}>확인</Button>
          </div>
        </Popup>
      )}
    </PopupController>
  ),
};

export const CustomWidth: Story = {
  render: (args) => (
    <PopupController initialPlacement="center">
      {({ isOpen, onClose, placement }) => (
        <Popup
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          title="넓은 팝업"
          placement={placement}
          width={400}
        >
          <p>width 속성을 통해 팝업의 너비를 조절할 수 있습니다.</p>
          <p className="mt-2">숫자 또는 문자열(예: '50%', '300px')로 지정할 수 있습니다.</p>
          <div className="mt-4 flex justify-end">
            <Button size="small" onClick={onClose}>확인</Button>
          </div>
        </Popup>
      )}
    </PopupController>
  ),
};

export const WithCard: Story = {
  render: (args) => (
    <PopupController initialPlacement="center">
      {({ isOpen, onClose, placement }) => (
        <Popup
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          placement={placement}
          contentClassName="p-0 overflow-hidden"
          closable={false}
        >
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>카드가 포함된 팝업</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Popup 컴포넌트 안에 Card 컴포넌트를 포함시킬 수 있습니다.</p>
              <p className="mt-2">이렇게 하면 일관된 디자인 시스템을 유지하면서 다양한 컴포넌트를 조합할 수 있습니다.</p>
              <div className="mt-4 flex justify-end">
                <Button size="small" onClick={onClose}>닫기</Button>
              </div>
            </CardContent>
          </Card>
        </Popup>
      )}
    </PopupController>
  ),
}; 