export interface WebRTCOptions {
  host: 'http://101.254.21.220:8083';
  content: string;
  start?: string;
  end?: string;
  streamType?: 'live' | 'vod';
}

export async function createWebRTCConnection(
  video: HTMLVideoElement,
  options: WebRTCOptions
): Promise<MediaStream> {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
  });

  const stream = new MediaStream();
  video.srcObject = stream;

  pc.addTransceiver('video', { direction: 'recvonly' });

  pc.ontrack = (event) => {
    stream.addTrack(event.track);
  };

  pc.oniceconnectionstatechange = () => {
    const state = pc.iceConnectionState;
    if (state === 'failed' || state === 'disconnected') {
      pc.close();
    }
  };

  pc.onnegotiationneeded = async () => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const res = await fetch(options.content,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sdp64: btoa(pc.localDescription?.sdp || ''),
          url: options.content,
          streamType: options.streamType,
          start: options.start ?? '',
          end: options.end ?? '',
        }),
      }
    );

    const json = await res.json();

    const answer = new RTCSessionDescription({
      type: 'answer',
      sdp: atob(json.sdp64),
    });
    await pc.setRemoteDescription(answer);
  };

  return stream;
}
