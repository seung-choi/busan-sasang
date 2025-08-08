import React, { useState } from 'react';
import { Modal, Popup, Dialog } from '@plug/ui';
import { Button } from '@plug/ui';

const DialogExamples: React.FC = () => {
  // Modal 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLargeModalOpen, setIsLargeModalOpen] = useState(false);

  // Popup 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupPlacement, setPopupPlacement] = useState<'top' | 'bottom' | 'center'>('center');

  // Dialog 상태 관리
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 팝업 위치 변경 핸들러
  const handlePopupPlacementChange = (placement: 'top' | 'bottom' | 'center') => {
    setPopupPlacement(placement);
    setIsPopupOpen(true);
  };

  return (
    <div className="container p-5">
      <h1>Dialog, Modal, Popup 예제</h1>

      {/* Modal 섹션 */}
      <section className="mb-10">
        <h2>Modal 예제</h2>
        <div className="flex gap-2.5">
          <Button onClick={() => setIsModalOpen(true)}>기본 모달 열기</Button>
          <Button onClick={() => setIsLargeModalOpen(true)}>큰 모달 열기</Button>
        </div>

        {/* 기본 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="기본 모달"
          width={400}
          closable
        >
          <div className="p-5">
            <p>이것은 기본 모달 내용입니다.</p>
            <p>모달은 중요한 정보나 작업을 위한 대화상자입니다.</p>
          </div>
        </Modal>

        {/* 큰 모달 */}
        <Modal
          isOpen={isLargeModalOpen}
          onClose={() => setIsLargeModalOpen(false)}
          title="큰 모달 예제"
          width={600}
          height={400}
          closable
          footer={
            <div className="flex justify-end gap-2.5">
              <Button onClick={() => setIsLargeModalOpen(false)}>취소</Button>
              <Button onClick={() => setIsLargeModalOpen(false)}>확인</Button>
            </div>
          }
        >
          <div className="p-5">
            <p>이것은 더 큰 모달 예제입니다.</p>
            <p>푸터에 버튼이 있는 모달입니다.</p>
            <p>모달은 사용자의 주의를 필요로 하는 중요한 작업에 사용됩니다.</p>
          </div>
        </Modal>
      </section>

      {/* Popup 섹션 */}
      <section className="mb-10">
        <h2>Popup 예제</h2>
        <div className="flex gap-2.5">
          <Button onClick={() => handlePopupPlacementChange('top')}>상단 팝업</Button>
          <Button onClick={() => handlePopupPlacementChange('center')}>중앙 팝업</Button>
          <Button onClick={() => handlePopupPlacementChange('bottom')}>하단 팝업</Button>
        </div>

        {/* 팝업 */}
        <Popup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          placement={popupPlacement}
          title="팝업 예제"
          width={300}
          closable
        >
          <div className="p-4">
            <p>이것은 팝업 내용입니다.</p>
            <p>현재 위치: {popupPlacement}</p>
            <Button onClick={() => setIsPopupOpen(false)}>닫기</Button>
          </div>
        </Popup>
      </section>

      {/* Dialog 섹션 */}
      <section>
        <h2>Dialog 예제</h2>
        <Button onClick={() => setIsDialogOpen(true)}>다이얼로그 열기</Button>

        {/* 다이얼로그 */}
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          closeOnOverlayClick
          closeOnEsc
        >
          <div className="bg-white p-5 rounded-lg shadow-md max-w-[400px]">
            <h3>다이얼로그 예제</h3>
            <p>이것은 기본 다이얼로그입니다.</p>
            <p>다이얼로그는 Modal과 Popup의 기본이 되는 컴포넌트입니다.</p>
            <div className="mt-5 text-right">
              <Button onClick={() => setIsDialogOpen(false)}>닫기</Button>
            </div>
          </div>
        </Dialog>
      </section>
    </div>
  );
};

export default DialogExamples; 