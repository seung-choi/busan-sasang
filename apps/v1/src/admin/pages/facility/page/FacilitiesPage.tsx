import { useEffect, useState } from "react";
import {Card, Button, Pagination} from "@plug/ui";
import { useNavigate } from "react-router-dom";
import {StateInfoWrapper} from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import {useModal} from "@plug/v1/admin/components/hook/useModal";
import {FacilityModal} from "@plug/v1/admin/pages/facility/component/FacilityModal";
import {Station, useStationsSWR} from "@plug/common-services";
import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";

export default function FacilitiesPage() {
    const navigate = useNavigate();
    const [stations, setStations] = useState<Station[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const {isOpen, openModal, closeModal} = useModal();
    const {data, error: listError, mutate} = useStationsSWR()
  const addToast = useToastStore((state) => state.addToast);

    const itemsPerPage = 8;

    useEffect(() => {
        const loadStations = async () => {
            try {
                mutate();
                setStations(data || []);
                if (listError) {
                  addToast({
                    variant: 'critical',
                    title: '서비스 불러오기 실패',
                    description: listError.message,
                  })
                }
            } catch (err) {
                setError(err as Error);
            }
        };
        loadStations();
    }, [data, mutate]);

    if (error) return <StateInfoWrapper preset={"defaultError"}/>;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStations = stations.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(stations.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className='mt-4  h-[90%]'>
            <div className='ml-auto flex gap-1 w-24'>
                <Button 
                    color='primary'
                    className='bg-primary-150 text-primary-700 font-semibold hover:bg-primary-200'
                    onClick={() => openModal('create')}
                >
                    등록
                </Button>
            </div>
            <div className='w-full h-[90%] mt-5 flex flex-col justify-between' >
                <div className='grid grid-cols-4 gap-4'>
                    {currentStations.length === 0 ? (
                        <StateInfoWrapper preset="emptyTable" onClick={() => openModal('create')}
                                          className="cursor-pointer col-span-4"/>
                    ) : (
                        currentStations.map((station) => (
                            <Card
                                key={station.facility?.id}
                                className="w-full hover:shadow-md transition-shadow duration-200"
                                onClick={() => navigate(`/admin/dashboard/facility/${station.facility.id}`)}
                            >
                                <div className="w-full h-[150px] bg-gray-100 rounded-t-lg overflow-hidden">
                                    <img
                                        src={station.facility?.thumbnail?.url ?? null}
                                        alt={station.facility?.name}
                                        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                    />
                                </div>
                                <Card.Header>
                                    <Card.Title className="text-lg font-semibold">
                                        {station.facility?.name}
                                    </Card.Title>
                                </Card.Header>
                                <Card.Footer className="flex">
                                    <Button
                                        size="small"
                                        className='rounded-r-none hover:bg-primary-50'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/admin/dashboard/facility/${station.facility?.id}`);
                                        }}
                                    >
                                        도면 관리
                                    </Button>
                                    <Button
                                        size="small"
                                        className="rounded-none border-x border-x-slate-300 hover:bg-primary-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/admin/viewer/${station.facility?.id}`);
                                        }}
                                    >
                                        공간 관리
                                    </Button>
                                    <Button
                                        size="small"
                                        className='rounded-l-none hover:bg-primary-50'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/service/${station.facility?.code}`);
                                        }}
                                    >
                                        3D 뷰어
                                    </Button>
                                </Card.Footer>
                            </Card>
                        ))
                    )}
                </div>

                {totalPages > 0 && (
                    <div className="flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
            <FacilityModal
                isOpen={isOpen}
                onClose={closeModal}
                onSuccess={() => {
                  mutate();
                  closeModal();
                }}
                />
        </div>
    );
}