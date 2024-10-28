'use client'
import { useSocket } from '@/providers/socket-provider';
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface VideoStreamProps {
  channelId: string;
}

const VideoStream: React.FC<VideoStreamProps> = ({ channelId }) => {
  const { socket, isConnected } = useSocket();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [pendingICECandidates, setPendingICECandidates] = useState<RTCIceCandidate[]>([]);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add cleanup function
  const cleanup = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsStreamReady(false);
  }, [localStream]);

  const retryConnection = useCallback(() => {
    if (peerConnection.current?.iceConnectionState === 'disconnected') {
      console.log('ICE connection disconnected, attempting to reconnect...');
      // Close the existing connection and reinitialize
      peerConnection.current.close();
      peerConnection.current = createPeerConnection();
    }
  }, []);

  // Create peer connection and add retry logic for ICE candidates
  const createPeerConnection = useCallback(() => {
    console.log('Creating new RTCPeerConnection...');
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ],
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      iceCandidatePoolSize: 1
    });

   
    // Handle ICE candidate events
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate.candidate);
        socket?.emit('ice-candidate', { channelId, candidate: event.candidate });
      }
    };

    // Handle remote track event
    peerConnection.current.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind);
      setRemoteStream(event.streams[0]);
    };

    // Handle ICE connection state changes
    peerConnection.current.oniceconnectionstatechange = () => {
      if (peerConnection.current?.iceConnectionState === 'disconnected') {
        retryConnection();
      }
      console.log('ICE connection state:', peerConnection.current?.iceConnectionState);
    };

    // Process pending ICE candidates after setting remote description
    peerConnection.current.onsignalingstatechange = () => {
      console.log('Signaling state:', peerConnection.current?.signalingState);
      if (peerConnection.current?.signalingState === 'stable') {
        // Add any pending ICE candidates that couldn't be added before
        processPendingICECandidates();
      }
    };

    return peerConnection.current;
  }, [channelId, socket]);

  // Initialize media stream
  const initializeMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      setLocalStream(stream);
      setIsStreamReady(true);
      return stream;
    } catch (error: any) {
      setError(error.message);
      console.error('Media stream error:', error);
      return null;
    }
  }, []);

  // Function to handle ICE candidates and retry if necessary
  const handleIceCandidateRetry = async (candidate: RTCIceCandidate) => {
    if (peerConnection.current?.remoteDescription) {
      try {
        await peerConnection.current.addIceCandidate(candidate);
        console.log('Successfully added ICE candidate.');
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    } else {
      console.log('Remote description not set yet, buffering ICE candidate.');
      setPendingICECandidates((prev) => [...prev, candidate]);
    }
  };

  // Function to process all pending ICE candidates once remote description is set
  const processPendingICECandidates = async () => {
    if (pendingICECandidates.length > 0 && peerConnection.current?.remoteDescription) {
      console.log('Processing pending ICE candidates...');
      for (const candidate of pendingICECandidates) {
        try {
          await peerConnection.current.addIceCandidate(candidate);
          console.log('Successfully added pending ICE candidate.');
        } catch (error) {
          console.error('Error adding pending ICE candidate:', error);
        }
      }
      setPendingICECandidates([]); // Clear the queue once processed
    }
  };

  // Main socket event handling
  useEffect(() => {
    if (!socket || !isConnected) return;

    const joinChannel = () => {
      console.log(`Joining channel ${channelId}`);
      socket.emit('join-channel', channelId);
    };

    joinChannel();

    socket.on('user-joined', async () => {
      console.log('Another user joined, creating offer');
      const pc = createPeerConnection();
      const stream = await initializeMediaStream();
      stream?.getTracks().forEach((track) => pc.addTrack(track, stream));

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log('Emitting offer');
        socket.emit('offer', { channelId, offer });
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    });

    socket.on('offer', async ({ offer }:{ offer :any}) => {
      console.log('Offer received');
      const pc = createPeerConnection();
      const stream = await initializeMediaStream();
      stream?.getTracks().forEach((track) => pc.addTrack(track, stream));

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log('Emitting answer');
        socket.emit('answer', { channelId, answer });
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    });
    
    socket.on('answer', async ({ answer }: { answer: any }) => {
      console.log('Answer received');
      try {
        // Check if the signaling state allows setting a remote description
        if (peerConnection.current?.signalingState === 'have-local-offer') {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
          processPendingICECandidates(); // Retry adding any buffered candidates
        } else {
          console.log(`Cannot set remote description in signaling state: ${peerConnection.current?.signalingState}`);
        }
      } catch (error) {
        console.error('Error setting remote description:', error);
      }
    });
    

    socket.on('ice-candidate', async ({ candidate }:{candidate:any}) => {
      console.log('ICE candidate received');
      await handleIceCandidateRetry(new RTCIceCandidate(candidate)); // Retry handling ICE candidate
    });

    return () => {
      console.log(`Leaving channel ${channelId}`);
      socket.emit('leave-channel', channelId);
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      peerConnection.current?.close();
    };
  }, [socket, channelId, isConnected, createPeerConnection, initializeMediaStream]);

  // Update video elements with streams
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [remoteStream, localStream]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: window.innerWidth >= 768 ? 'row' : 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '0.5rem',
      gap: window.innerWidth >= 768 ? '1rem' : '0',
    }}  >
      <div className="w-full md:w-1/2 aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          onLoadedMetadata={() => {
            localVideoRef.current?.play().catch(console.error);
          }}
        />
      </div>

      <div className="w-full md:w-1/2  aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          onLoadedMetadata={() => {
            remoteVideoRef.current?.play().catch(console.error);
          }}
        />
      </div>
    </div>
  );
};

export default VideoStream;