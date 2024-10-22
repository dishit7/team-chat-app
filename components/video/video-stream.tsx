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

  const createPeerConnection = useCallback(() => {
    console.log('Creating new RTCPeerConnection...');
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate.candidate);
        socket?.emit('ice-candidate', { channelId, candidate: event.candidate });
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind);
      setRemoteStream(event.streams[0]);
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', peerConnection.current?.iceConnectionState);
    };

    peerConnection.current.onsignalingstatechange = () => {
      console.log('Signaling state:', peerConnection.current?.signalingState);
    };

    return peerConnection.current;
  }, [channelId, socket]);

  const initializeMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }, []);

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

    socket.on('offer', async ({ offer }) => {
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

    socket.on('answer', async ({ answer }) => {
      console.log('Answer received');
      try {
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error setting remote description:', error);
      }
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      console.log('ICE candidate received');
      try {
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
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

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted playsInline />
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
};

export default VideoStream;