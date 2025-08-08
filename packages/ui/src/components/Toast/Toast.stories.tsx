import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@plug/ui';
import { Toast } from './index';

const meta: Meta<typeof Toast> = {
    title: 'Components/Toast',
    component: Toast,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'normal', 'warning', 'critical']
        },
        placement: {
            control: 'select',
            options: ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight', 'center'],
            description: 'Toast 위치',
            defaultValue: 'bottomRight',
        },
        closable: {
            control: 'boolean',
            description: '닫기 버튼 표시 여부',
            defaultVale: false,
        },
        autoClose: {
            control: 'boolean',
            description: '자동 닫기 여부',
            defaultValue: true,
        },
        autoCloseDuration: {
            control: 'number',
            description: '자동 닫기 시간',
            defaultValue: 3000,
        },
    }
};

export default meta;
type Story = StoryObj<typeof Toast>;

// Toast 컨트롤러 컴포넌트
const ToastController: React.FC<{
    children: (props: { isOpen: boolean; onClose: () => void }) => React.ReactNode;
  }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
    }
    
    return (
      <>
        <Button onClick={handleOpen}>Toast 열기</Button>
        {children({ isOpen, onClose: handleClose })}
      </>
    );
  };


export const Default : Story = {
    render: (args) => (
        <ToastController>
            {({ isOpen, onClose }) => (
                <Toast {...args} isOpen={isOpen} onClose={onClose}>
                    <Toast.Title>토스트 타이틀</Toast.Title>
                    <Toast.Description>기본 토스트 입니다.</Toast.Description>
                </Toast>
            )}
        </ToastController>
    )
}

export const Variant : Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">Variant: default</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose}>
                        <Toast.Title>기본 토스트</Toast.Title>
                        <Toast.Description>기본 스타일의 토스트 메시지입니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
            <div className="mt-4 mb-2">Variant: normal</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} variant="normal">
                        <Toast.Title>성공 토스트</Toast.Title>
                        <Toast.Description>작업이 성공적으로 완료되었습니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
            <div className="mt-4 mb-2">Variant: warning</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} variant="warning">
                        <Toast.Title>경고 토스트</Toast.Title>
                        <Toast.Description>주의가 필요한 상황이 발생했습니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
            <div className="mt-4 mb-2">Variant: critical</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} variant="critical">
                        <Toast.Title>중요 토스트</Toast.Title>
                        <Toast.Description>긴급한 조치가 필요한 상황입니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
        </>
    )
}

export const Placement : Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">Placement: top</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} placement="top">
                        <Toast.Title>상단 토스트</Toast.Title>
                        <Toast.Description>화면 상단에 표시되는 토스트입니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
            <div className="mt-4 mb-2">Placement: topLeft</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} placement="topLeft">
                        <Toast.Title>상단 좌측 토스트</Toast.Title>
                        <Toast.Description>화면 상단 좌측에 표시되는 토스트입니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
            <div className="mt-4 mb-2">Placement: topRight</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} placement="topRight">
                        <Toast.Title>상단 우측 토스트</Toast.Title>
                        <Toast.Description>화면 상단 우측에 표시되는 토스트입니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
            <div className="mt-4 mb-2">Placement: bottom</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} placement="bottom">
                        <Toast.Title>하단 토스트</Toast.Title>
                        <Toast.Description>화면 하단에 표시되는 토스트입니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
            <div className="mt-4 mb-2">Placement: bottomLeft</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} placement="bottomLeft">
                        <Toast.Title>하단 좌측 토스트</Toast.Title>
                        <Toast.Description>화면 하단 좌측에 표시되는 토스트입니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
            <div className="mt-4 mb-2">Placement: bottomRight</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} placement="bottomRight">
                        <Toast.Title>하단 우측 토스트</Toast.Title>
                        <Toast.Description>화면 하단 우측에 표시되는 토스트입니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
            <div className="mt-4 mb-2">Placement: center</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} placement="center">
                        <Toast.Title>중앙 토스트</Toast.Title>
                        <Toast.Description>화면 중앙에 표시되는 토스트입니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
        </>
    )
}

export const AutoClose : Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">자동 닫힘 활성화 (기본값: 3초)</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} autoClose={true}>
                        <Toast.Title>자동 닫힘 토스트</Toast.Title>
                        <Toast.Description>이 토스트는 3초 후 자동으로 닫힙니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
            <div className="mt-4 mb-2">자동 닫힘 비활성화</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} autoClose={false}>
                        <Toast.Title>수동 닫힘 토스트</Toast.Title>
                        <Toast.Description>이 토스트는 자동으로 닫히지 않습니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
        </>
    )
}

export const AutoCloseDuration : Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">자동 닫힘 시간: 1초</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} autoClose={true} autoCloseDuration={1000}>
                        <Toast.Title>빠른 닫힘 토스트</Toast.Title>
                        <Toast.Description>이 토스트는 1초 후 자동으로 닫힙니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
            <div className="mt-4 mb-2">자동 닫힘 시간: 5초</div>
            <ToastController>
                {({ isOpen, onClose }) => (
                    <Toast isOpen={isOpen} onClose={onClose} autoClose={true} autoCloseDuration={5000}>
                        <Toast.Title>느린 닫힘 토스트</Toast.Title>
                        <Toast.Description>이 토스트는 5초 후 자동으로 닫힙니다.</Toast.Description>
                    </Toast>
                )}
            </ToastController>
        </>
    )
}


export const Closable : Story = {
    render: (args) => (
        <ToastController>
            {({ isOpen, onClose }) => (
                <Toast {...args} isOpen={isOpen} onClose={onClose} closable>
                    <Toast.Title>닫기 가능한 토스트</Toast.Title>
                    <Toast.Description>이 토스트는 닫기 버튼이 있습니다.</Toast.Description>
                </Toast>
            )}
        </ToastController>
    )
}


