'use client'
import { useSocket } from '@/providers/socket-provider';
import React, { useEffect, useRef, useState } from 'react';

interface VideoStreamProps {
  channelId: string;
}

const VideoStream: React.FC<VideoStreamProps> = ({ channelId }) => {
  const { socket, isConnected } = useSocket(); 
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const iceCandidatesBuffer = useRef<RTCIceCandidate[]>([]);

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Emitting ICE candidate', event.candidate);
        socket?.emit('ice-candidate', { channelId, candidate: event.candidate });
      }
    };
    peerConnection.current.ontrack = (event) => {
      console.log('Received remote track:', event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        console.log('Remote video stream set successfully.');
      } else {
        console.warn('Remote video element not available.');
      }
    };
    
    return peerConnection.current;
  };

  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    if (peerConnection.current?.remoteDescription) {
      await peerConnection.current.addIceCandidate(candidate);
    } else {
      iceCandidatesBuffer.current.push(candidate);
    }
  };

  useEffect(() => {
    if (!socket || !isConnected) return;

    const initializeMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        return stream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

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

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log('Emitting offer', offer);
      socket.emit('offer', { channelId, offer });
    });

    socket.on('offer', async ({ offer }) => {
      console.log(`Offer received:`, offer);
      const pc = createPeerConnection();
      const stream = await initializeMediaStream();
      stream?.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log('Emitting answer:', answer);
      socket.emit('answer', { channelId, answer });

      // Process buffered ICE candidates
      while (iceCandidatesBuffer.current.length) {
        const candidate = iceCandidatesBuffer.current.shift();
        await pc.addIceCandidate(candidate!);
      }
    });
    socket.on('answer', async ({ answer }) => {
      console.log(`Answer received:`, answer);
      if (peerConnection.current?.signalingState === 'have-remote-offer') {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      } else {
        console.warn('Ignoring answer because connection is in stable state.');
      }
    });
    

    socket.on('ice-candidate', async ({ candidate }) => {
      console.log('Received ICE candidate', candidate);
      await handleIceCandidate(new RTCIceCandidate(candidate));
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
  }, [socket, channelId, isConnected]);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted playsInline />
      <video ref={remoteVideoRef}  autoPlay playsInline muted />
    </div>
  );
};

export default VideoStream;