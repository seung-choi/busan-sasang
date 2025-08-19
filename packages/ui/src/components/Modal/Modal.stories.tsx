import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '@plug/ui';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Card/Card';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달 표시 여부',
      defaultValue: false
    },
    onClose: {
      action: 'closed',
      description: '모달이 닫힐 때 호출되는 함수'
    },
    title: {
      control: 'text',
      description: '모달 제목'
    },
    width: {
      control: 'text',
      description: '모달 너비'
    },
    height: {
      control: 'text',
      description: '모달 높이'
    },
    closable: {
      control: 'boolean',
      description: '닫기 버튼 표시 여부',
      defaultValue: true
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: '오버레이 클릭 시 닫기 여부',
      defaultValue: false
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'ESC 키 누를 시 닫기 여부',
      defaultValue: true
    }
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// 모달 컨트롤러 컴포넌트
const ModalController: React.FC<{
  children: (props: { isOpen: boolean; onClose: () => void }) => React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  
  return (
    <div>
      <Button onClick={handleOpen}>모달 열기</Button>
      {children({ isOpen, onClose: handleClose })}
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <ModalController>
      {({ isOpen, onClose }) => (
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          title="기본 모달"
        >
          <p>모달 내용이 여기에 들어갑니다. 다양한 콘텐츠를 포함할 수 있습니다.</p>
        </Modal>
      )}
    </ModalController>
  ),
};

export const WithFooter: Story = {
  render: (args) => (
    <ModalController>
      {({ isOpen, onClose }) => (
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          title="푸터가 있는 모달"
          footer={
            <>
              <Button variant="outline" onClick={onClose}>취소</Button>
              <Button onClick={() => {
                alert('확인 버튼이 클릭되었습니다.');
                onClose();
              }}>확인</Button>
            </>
          }
        >
          <p>모달 내용이 여기에 들어갑니다. 다양한 콘텐츠를 포함할 수 있습니다.</p>
          <p className="mt-4">푸터에는 주로 액션 버튼이 위치합니다.</p>
        </Modal>
      )}
    </ModalController>
  ),
};

export const CustomSize: Story = {
  render: (args) => (
    <ModalController>
      {({ isOpen, onClose }) => (
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          title="크기 조절 가능한 모달"
          width={700}
          height={400}
        >
          <div className="h-full flex items-center justify-center">
            <p className="text-center">
              width와 height 속성을 통해 모달의 크기를 조절할 수 있습니다.<br />
              숫자 또는 문자열(예: '50%', '300px')로 지정할 수 있습니다.
            </p>
          </div>
        </Modal>
      )}
    </ModalController>
  ),
};

export const NoHeader: Story = {
  render: (args) => (
    <ModalController>
      {({ isOpen, onClose }) => (
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          closable={false}
        >
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">헤더 없는 모달</h3>
            <p>title과 closable을 모두 제거하면 헤더가 표시되지 않습니다.</p>
            <Button className="mt-6" onClick={onClose}>닫기</Button>
          </div>
        </Modal>
      )}
    </ModalController>
  ),
};

export const WithCards: Story = {
  render: (args) => (
    <ModalController>
      {({ isOpen, onClose }) => (
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={onClose}
          title="카드 목록"
          footer={
            <Button onClick={onClose}>닫기</Button>
          }
        >
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>첫 번째 카드</CardTitle>
                <CardDescription>모달 내부에 카드를 배치할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent>
                <p>모달 내부에 여러 개의 카드를 배치하여 정보를 구조화할 수 있습니다.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>두 번째 카드</CardTitle>
                <CardDescription>다양한 정보를 구조화하여 표시</CardDescription>
              </CardHeader>
              <CardContent>
                <p>각 카드는 관련된 정보를 그룹화하여 표시하는 데 유용합니다.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>세 번째 카드</CardTitle>
                <CardDescription>일관된 디자인 시스템</CardDescription>
              </CardHeader>
              <CardContent>
                <p>컴포넌트를 조합하여 일관된 디자인 시스템을 구축할 수 있습니다.</p>
              </CardContent>
            </Card>
          </div>
        </Modal>
      )}
    </ModalController>
  ),
}; 