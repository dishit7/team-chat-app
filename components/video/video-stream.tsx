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

  useEffect(() => {
    if (!isConnected || !socket) {
      console.log('Socket is not connected yet.');
      return;
    }

    console.log('Socket connected, initializing video stream logic.');
  }, [isConnected]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const initializePeerConnection = async () => {
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Emitting ICE candidate', event.candidate);
          socket.emit('ice-candidate', { channelId, candidate: event.candidate });
        }
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      console.log('Emitting offer', offer);
      socket.emit('offer', { channelId, offer });
    };

    const joinChannel = () => {
      console.log(`Joining channel ${channelId}`);
      socket.emit('join-channel', channelId);
    };

    const leaveChannel = () => {
      console.log(`Leaving channel ${channelId}`);
      socket.emit('leave-channel', channelId);
    };

 
    joinChannel();
    socket.on('user-joined', async () => {
      console.log('Another user joined, creating offer');
      await initializePeerConnection();
    });
     
    
    socket.on('offer', async ({ offer }) => {
      console.log(`offer happened ${offer}`)
      if (!peerConnection.current) await initializePeerConnection();
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer);
      socket.emit('answer', { channelId, answer });
    });

    socket.on('answer', async ({ answer }) => {
      console.log(`answer happened ${answer}`)
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async ({ candidate }) => {

    console.log('Received ICE candidate', candidate);

      console.log(`ice-candidate happened ${answer}`)

      await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

     
    return () => {
      leaveChannel();
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      peerConnection.current?.close();
    };
  }, [socket, channelId, isConnected]);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted playsInline />
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
};

export default VideoStream;
