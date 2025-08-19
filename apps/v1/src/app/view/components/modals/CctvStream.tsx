import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CCTV } from '@plug/v1/app/api';

export enum StreamErrorType {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  MEDIA_ERROR = 'MEDIA_ERROR',
  ICE_FAILED = 'ICE_FAILED',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

export interface StreamError extends Error {
  type: StreamErrorType;
  details?: unknown;
}

interface CctvStreamProps {
  cctv: CCTV
  className?: string;
  onStreamError?: (error: StreamError) => void;
  autoReconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  connectionTimeout?: number;
}

const CctvStream: React.FC<CctvStreamProps> = ({
  cctv, 
  className = '', 
  onStreamError,
  autoReconnect = true,
  reconnectAttempts = 3,
  reconnectInterval = 5000,
  connectionTimeout = 15000
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState<StreamErrorType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [reconnectCount, setReconnectCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const createTimeoutError = useCallback((): StreamError => {
    const error = new Error('CCTV 스트림 연결 시간 초과') as StreamError;
    error.type = StreamErrorType.TIMEOUT;
    return error;
  }, []);

  const handleError = useCallback((error: unknown, type: StreamErrorType = StreamErrorType.UNKNOWN) => {
    const streamError = error as StreamError;
    streamError.type = type;
    
    setErrorType(type);
    setErrorMessage(streamError.message || '알 수 없는 오류가 발생했습니다');
    setHasError(true);
    setIsLoading(false);
    
    console.error(`[CCTV Stream Error] Type: ${type}, Message: ${streamError.message}`, error);
    
    onStreamError?.(streamError);

    if (autoReconnect && reconnectCount < reconnectAttempts) {
      console.log(`[CCTV Stream] 재연결 시도 ${reconnectCount + 1}/${reconnectAttempts}`);
      setTimeout(() => {
        setReconnectCount(prev => prev + 1);
        cleanupStream();
        connectWebRTC();
      }, reconnectInterval);
    }
  }, [onStreamError, autoReconnect, reconnectCount, reconnectAttempts, reconnectInterval]);

  const cleanupStream = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const connectWebRTC = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorType(null);
      setErrorMessage('');

      timeoutRef.current = window.setTimeout(() => {
        const timeoutError = createTimeoutError();
        handleError(timeoutError, StreamErrorType.TIMEOUT);
      }, connectionTimeout);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
      });
      
      peerConnectionRef.current = pc;

      const stream = new MediaStream();
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;

      streamRef.current = stream;

      pc.addTransceiver('video', { direction: 'recvonly' });

      pc.ontrack = (event) => {
        stream.addTrack(event.track);
      };

      pc.oniceconnectionstatechange = () => {
        console.log(`[CCTV Stream] ICE 상태 변경: ${pc.iceConnectionState}`);
        
        if (pc.iceConnectionState === 'failed') {
          const iceError = new Error('ICE 연결 실패') as StreamError;
          handleError(iceError, StreamErrorType.ICE_FAILED);
          pc.close();
        } else if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setReconnectCount(0);
        }
      };

      pc.onnegotiationneeded = async () => {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          const response = await fetch(
            'http://101.254.21.220:8083/stream',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sdp64: btoa(pc.localDescription?.sdp || ''),
                url: cctv.streamAddress,
                streamType: 'live',
                start: '',
                end: '',
              }),
              signal: controller.signal
            }
          );
          
          clearTimeout(timeoutId);

          if (!response.ok) {
            const serverError = new Error(`서버 오류: ${response.status} ${response.statusText}`) as StreamError;
            handleError(serverError, StreamErrorType.SERVER_ERROR);
            return;
          }

          const json = await response.json();
          
          if (!json.sdp64) {
            const dataError = new Error('서버 응답 데이터 오류: SDP 데이터 없음') as StreamError;
            handleError(dataError, StreamErrorType.SERVER_ERROR);
            return;
          }
          
          const answer = new RTCSessionDescription({
            type: 'answer',
            sdp: atob(json.sdp64),
          });
          
          await pc.setRemoteDescription(answer);
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            const timeoutError = new Error('서버 응답 시간 초과') as StreamError;
            handleError(timeoutError, StreamErrorType.TIMEOUT);
          } else {
            handleError(error, StreamErrorType.CONNECTION_FAILED);
          }
        }
      };
    } catch (error) {
      handleError(error, StreamErrorType.CONNECTION_FAILED);
    }
  }, [cctv.streamAddress, handleError, createTimeoutError, connectionTimeout]);

  const handleReconnect = useCallback(() => {
    setReconnectCount(0);
    cleanupStream();
    connectWebRTC();
  }, [cleanupStream, connectWebRTC]);

  useEffect(() => {
    connectWebRTC();
    return () => {
      cleanupStream();
    };
  }, [connectWebRTC, cleanupStream]);

  const getErrorMessage = () => {
    switch (errorType) {
      case StreamErrorType.CONNECTION_FAILED:
        return "WebRTC 연결 실패";
      case StreamErrorType.MEDIA_ERROR:
        return "미디어 스트림 오류";
      case StreamErrorType.ICE_FAILED:
        return "ICE 연결 실패";
      case StreamErrorType.SERVER_ERROR:
        return "서버 통신 오류";
      case StreamErrorType.TIMEOUT:
        return "연결 시간 초과";
      default:
        return "스트림 오류 발생";
    }
  };

  return (
    <div className={`bg-primary-950/40 rounded-lg border border-primary-700/30 ${className}`}>
      <div className="p-3 border-b border-primary-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-primary-100 font-medium">{cctv.cctvName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary-400">{cctv.cctvId}</span>
            <div className="flex items-center gap-1 text-xs text-primary-400">
              <div
                className={`w-1.5 h-1.5 rounded-full ${hasError ? 'bg-red-500' : isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}
              />
              {hasError ? '연결 실패' : isLoading ? '연결 중' : '연결됨'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="aspect-video bg-gray-900 rounded border border-gray-700/50 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-primary-200 text-sm">스트림 연결 중...</span>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-center">
                <svg
                  className="w-12 h-12 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-red-400 font-medium">{getErrorMessage()}</p>
                  <p className="text-gray-400 text-sm mb-2">
                    {errorMessage
                      ? '관리자에게 문의해주시기 바랍니다.'
                      : 'CCTV 스트림을 확인해주세요'}
                  </p>
                  <p className="text-gray-500 text-xs">에러 원인: {errorMessage}</p>
                  {autoReconnect && reconnectCount > 0 && reconnectCount < reconnectAttempts && (
                    <p className="text-yellow-400 text-xs mt-2">
                      자동 재연결 시도 중... ({reconnectCount}/{reconnectAttempts})
                    </p>
                  )}
                </div>
                <button
                  onClick={handleReconnect}
                  className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  다시 연결
                </button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded"
            autoPlay
            muted
            playsInline
            onLoadStart={() => setIsLoading(true)}
            onLoadedData={() => setIsLoading(false)}
            onError={(e) => {
              const mediaError = new Error(
                `비디오 요소 오류: ${e.currentTarget.error?.message || '알 수 없는 미디어 오류'}`,
              ) as StreamError;
              handleError(mediaError, StreamErrorType.MEDIA_ERROR);
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReconnect}
              className="p-2 bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 rounded-lg transition-colors"
              title="다시 연결"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <button
              onClick={() => videoRef.current?.requestFullscreen?.()}
              className="p-2 bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 rounded-lg transition-colors"
              title="전체화면"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-400">
            <span>WebRTC 스트림</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CctvStream;