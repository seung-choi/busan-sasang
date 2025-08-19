import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDebounce } from 'react-use';
import { Input } from '@plug/ui';
import useSideMenuStore from '@plug/v1/app/stores/sideMenuStore';
import useStationStore from '@plug/v1/app/stores/stationStore';
import useDeviceModalStore from '@plug/v1/app/stores/deviceModalStore';
import * as Px from '@plug/engine/src';
import { clsx } from 'clsx';
import { useToastStore } from '@plug/v1/admin/components/hook/useToastStore';

interface SearchResult {
  id: string;
  name: string;
  categoryName: string;
  categoryId: string;
  categoryType: string;
  featureId: string;
  floorId: string;
}

const SearchPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  const { menuItems, isDevicePanelOpen, openMenuByDeviceId } = useSideMenuStore();
  const { setCurrentFloor, externalCode } = useStationStore();
  const { openModal } = useDeviceModalStore();
  const { addToast } = useToastStore();

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    300,
    [searchTerm]
  );

  useEffect(() => {
    if (selectedResult) {
      handleDeviceActions(selectedResult);
      setSelectedResult(null);
    }
  }, [selectedResult]);

  const allDevices = useMemo(() => {
    return menuItems.flatMap(category =>
      category.devices.map(device => ({
        id: device.id,
        name: device.name,
        categoryName: category.name,
        categoryId: category.id,
        categoryType: category.type,
        featureId: device.feature.id,
        floorId: device.feature.floorId
      }))
    );
  }, [menuItems]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const filteredResults = allDevices.filter(device =>
      device.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      device.categoryName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    setResults(filteredResults);
  }, [debouncedSearchTerm, allDevices]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        if (isExpanded && searchTerm.trim() === '') {
          setIsExpanded(false);
        }
        if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, searchTerm, isOpen]);

  useEffect(() => {
    if (!isExpanded) {
      setSearchTerm('');
      setResults([]);
      setIsOpen(false);
    }
  }, [isExpanded]);

  // const handleExpandClick = () => {
  //   setIsExpanded(true);
  //   setTimeout(() => {
  //     if (inputRef.current) {
  //       inputRef.current.focus();
  //     }
  //   }, 100);
  // };

  const clearSearchTerm = () => {
    setSearchTerm('');
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleDeviceActions = (device: SearchResult) => {
    try {
      console.log('디바이스 액션 실행:', device);
      setCurrentFloor(device.floorId);

      Px.Model.HideAll();
      if (device.floorId === 'ALL') {
        Px.Model.ShowAll();
      } else {
        Px.Model.Show(device.floorId);
      }

      openMenuByDeviceId(device.id);

      if (externalCode) {
        console.log('모달 열기:', {
          name: device.name,
          id: device.id,
          type: device.categoryType,
          stationId: String(externalCode)
        });
        openModal(device.name, device.id, device.categoryType, String(externalCode));
      }

      setTimeout(() => {
        console.log('카메라 이동:', device.featureId);
        Px.Camera.MoveToPoi(device.featureId, 1.5);

        const evt = {
          type: 'onPoiSelect',
          target: { id: device.featureId }
        };
        Px.EventDispatcher.InternalHandler.dispatchEvent(evt);
      }, 800);

      addToast({
        variant: 'normal',
        title: `${device.name} 선택`,
        description: `${device.name} 위치로 이동합니다`
      });
    } catch (error) {
      console.error('디바이스 선택 중 오류 발생:', error);
      addToast({
        variant: 'critical',
        title: '오류 발생',
        description: String(error)
      });
    }
  };

  const handleSelectDevice = (event: React.MouseEvent, device: SearchResult) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedResult(device);
    setIsOpen(false);
    setSearchTerm('');
    setIsExpanded(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isOpen) {
          setIsOpen(false);
        } else if (isExpanded) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isExpanded]);

  return (
    <div
      className={clsx(
        'fixed transition-all duration-300 ease-in-out top-20 z-20',
        isDevicePanelOpen ? 'left-[23rem]' : 'left-20',
      )}
      ref={panelRef}
    >
      <div
        className={clsx(
          'transition-all duration-300 ease-in-out relative w-80',
          // isExpanded ? 'w-80' : 'w-10',
        )}
      >
        {/*{isExpanded ? (*/}
        {/*  <div*/}
        {/*    className="backdrop-blur-md rounded-lg shadow-xl transition-opacity duration-300 opacity-100 relative"*/}
        {/*  >*/}
        {/*    <Input*/}
        {/*      type="text"*/}
        {/*      placeholder="디바이스 검색..."*/}
        {/*      value={searchTerm}*/}
        {/*      onChange={setSearchTerm}*/}
        {/*      onFocus={() => setIsOpen(true)}*/}
        {/*      className="w-full text-white pr-10"*/}
        {/*      autoComplete="off"*/}
        {/*      ref={inputRef}*/}
        {/*    />*/}
        {/*    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">*/}
        {/*      {searchTerm && (*/}
        {/*        <button*/}
        {/*          onClick={clearSearchTerm}*/}
        {/*          className="text-white/70 hover:text-white transition-colors"*/}
        {/*        >*/}
        {/*          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">*/}
        {/*            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />*/}
        {/*          </svg>*/}
        {/*        </button>*/}
        {/*      )}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*) : (*/}
        {/*  <button*/}
        {/*    onClick={handleExpandClick}*/}
        {/*    className="w-10 h-10 flex items-center justify-center bg-primary-900/40 backdrop-blur-md border border-primary-100/10 rounded-full shadow-xl text-white hover:bg-primary-800/80 transition-all duration-300"*/}
        {/*  >*/}
        {/*    <svg*/}
        {/*      xmlns="http://www.w3.org/2000/svg"*/}
        {/*      viewBox="0 0 20 20"*/}
        {/*      fill="currentColor"*/}
        {/*      className="w-5 h-5 text-gray-300"*/}
        {/*    >*/}
        {/*      <path*/}
        {/*        fillRule="evenodd"*/}
        {/*        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"*/}
        {/*        clipRule="evenodd"*/}
        {/*      />*/}
        {/*    </svg>*/}
        {/*  </button>*/}
        {/*)}*/}
        <div
          className="backdrop-blur-md rounded-lg shadow-xl transition-opacity duration-300 opacity-100 relative"
        >
          <Input
            type="text"
            placeholder="디바이스 검색..."
            value={searchTerm}
            onChange={setSearchTerm}
            onFocus={() => setIsOpen(true)}
            className="w-full text-white pr-10"
            autoComplete="off"
            ref={inputRef}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
            {searchTerm && (
              <button
                onClick={clearSearchTerm}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>


        {isOpen && results.length > 0 && (
          <div 
            ref={resultsRef}
            className="mt-2 absolute w-full left-0 max-h-80 overflow-y-auto custom-scrollbar bg-primary-900/60 backdrop-blur-lg border border-primary-100/10 rounded-lg shadow-xl"
          >
            {results.map((result) => (
              <div
                key={result.id}
                className="p-3 hover:bg-primary-800/50 cursor-pointer border-b border-primary-100/5 last:border-0"
                onClick={(e) => handleSelectDevice(e, result)}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="flex items-start justify-between">
                  <div className="font-medium text-white truncate">{result.name}</div>
                  <div className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-700/60 text-white/70 font-medium border border-white/5">
                    {result.categoryName}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">ID: {result.id}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;