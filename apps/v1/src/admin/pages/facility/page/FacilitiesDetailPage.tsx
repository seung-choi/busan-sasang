import {useNavigate, useParams} from 'react-router-dom';
import { Form, FormItem, Input, Select, Button, ConfirmModal} from '@plug/ui';
import { useLinesSWR } from '@plug/common-services';
import {useStationDetail} from "@plug/v1/admin/pages/facility/hook/useStationDetail";
import {FileUploadField} from "@plug/v1/admin/pages/facility/component/FileUploadField";

export default function FacilitiesDetailPage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const { data: lines } = useLinesSWR();
  const {
    station,
    formValues,
    fileStates,
    isLoading,
    isUploading,
    confirmModal,  
    setConfirmModal,
    handleChange,
    handleFileChange,
    handleSubmit,
    handleDelete, 
  } = useStationDetail(id!);

  const handleConfirmModalClose = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };
  const openFilePicker = (type: 'model' | 'thumbnail') => {
    const fileInput = document.getElementById(`${type}-file`);
    if (fileInput) fileInput.click();
  };

  if (!station) return <div className="p-6">로딩 중...</div>;

  return (
    <>
      <div className="p-6">
        <Form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50 w-1/6">역사 ID</th>
                <td className="border border-gray-300 p-2 w-1/3">
                  <FormItem name="id">
                    <div className='mb-[-16px]'>
                      <Input.Text
                        value={formValues.id}
                        onChange={(value) => handleChange('id', value)}
                        className="w-full"
                        disabled
                      />
                    </div>
                  </FormItem>
                </td>
                <th className="border border-gray-300 p-2 bg-gray-50 w-1/6">역사명</th>
                <td className="border border-gray-300 p-2 w-1/3">
                  <FormItem name="name">
                    <div className='mb-[-16px]'>
                      <Input.Text
                        value={formValues.name}
                        onChange={(value) => handleChange('name', value)}
                        className="w-full"
                      />
                    </div>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">설명</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="description">
                    <div className='mb-[-16px]'>
                      <Input.Text
                        value={formValues.description}
                        onChange={(value) => handleChange('description', value)}
                        className="w-full"
                      />
                    </div>
                  </FormItem>
                </td>
                <th className="border border-gray-300 p-2 bg-gray-50">코드</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="code">
                    <div className='mb-[-16px]'>
                      <Input.Text
                        value={formValues.code}
                        onChange={(value) => handleChange('code', value)}
                        className="w-full"
                        disabled
                      />
                    </div>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">노선</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="lineIds" required>
                    <div>
                      <Select
                        type="multiple"
                        className="w-full mb-[-16px]"
                        selected={formValues.lineIds}
                        onChange={(value) => {
                          const selectedValues = value || [];
                          handleChange('lineIds', selectedValues);
                        }}
                      >
                        <Select.Trigger />
                        <Select.Content>
                          {lines?.map((line) => (
                            <Select.Item key={line.id} value={String(line.id)}>
                              {line.name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </div>
                  </FormItem>
                </td>
                <th className="border border-gray-300 p-2 bg-gray-50">외부 코드</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="externalCode" >
                    <div className='mb-[-16px]'>
                      <Input.Text
                        value={formValues.externalCode}
                        onChange={(e) => handleChange('externalCode', e)}
                        className="w-full"
                      />
                    </div>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">층 정보</th>
                <td className="border border-gray-300 p-2" colSpan={3}>
                  <FormItem name="floors" required>
                    <div className="space-y-2 mb-[-16px]">
                      {formValues.floors.map((floor) => (
                        <div key={floor.floorId} className="flex gap-2">
                          <p>{floor.name}</p>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">수정일</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="updatedAt" >
                    <div className='mb-[-16px]'>
                      <Input.Text
                        value={formValues.updatedAt}
                        onChange={(e) => handleChange('updatedAt', e)}
                        className="w-full"
                        disabled
                      />
                    </div>
                  </FormItem>
                </td>
                <th className="border border-gray-300 p-2 bg-gray-50">마지막 수정인</th>
                <td className="border border-gray-300 p-2">
                  <FormItem name="updatedBy" >
                    <div className='mb-[-16px]'>
                      <Input.Text
                        value={formValues.updatedBy}
                        onChange={(e) => handleChange('updatedBy', e)}
                        className="w-full"
                        disabled
                      />
                    </div>
                  </FormItem>
                </td>

              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50" rowSpan={2}>썸네일 이미지</th>
                <td rowSpan={2} className='p-2'>
                  {fileStates.thumbnail.file ? (
                    <img
                      src={URL.createObjectURL(fileStates.thumbnail.file)}
                      alt="썸네일 이미지"
                      className="w-full h-full object-cover"
                    />
                  ) : station.facility.thumbnail?.url && (
                    <img
                      src={station.facility.thumbnail.url}
                      alt="썸네일 이미지"
                      className="w-full h-full object-cover"
                    />
                  )}
                </td>
                <th className="border border-gray-300 p-2 bg-gray-50">썸네일 파일</th>
                <td className="border border-gray-300 p-2">
                  <FileUploadField
                    type="thumbnail"
                    fileState={fileStates.thumbnail}
                    isUploading={isUploading}
                    onChange={(e) => handleFileChange(e, 'thumbnail')}
                    onOpenPicker={openFilePicker}
                    label="썸네일 파일"
                  />
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50">3D 모델 파일</th>
                <td className="border border-gray-300 p-2">
                  <FileUploadField
                    type="model"
                    fileState={fileStates.model}
                    isUploading={isUploading}
                    onChange={(e) => handleFileChange(e, 'model')}
                    onOpenPicker={openFilePicker}
                    label="3D 모델 파일"
                    className='mb-[-16px]'
                  />
                </td>
              </tr>
              </tbody>
            </table>

            <div className="flex justify-center gap-2 mt-6 w-1/3 ml-auto">
              <Button type="button" color="secondary" onClick={() => navigate('/admin/dashboard/facility')}>목록</Button>
              <Button type="submit" color="primary" disabled={isLoading} isLoading={isLoading}>
                저장
              </Button>
              <Button type="button" color="destructive" disabled={isLoading} onClick={handleDelete} isLoading={isLoading}>
                삭제
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <ConfirmModal
            isOpen={confirmModal.isOpen}
            onClose={handleConfirmModalClose}
            onConfirm={confirmModal.onConfirm}
            title={confirmModal.title}
            message={confirmModal.message}
            confirmText="삭제"
            cancelText="취소"
            isDangerous={true}
        />
    </>
  );
}