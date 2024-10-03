"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

interface VideoStreamProps {
  channelId: string;
}

const VideoStream = ({ channelId }: VideoStreamProps) => {
  const [peers, setPeers] = useState<RTCPeerConnection[]>([]);
  const videoRefs = useRef<{[key:string]:HTMLVideoElement | null}>({});
  const socketRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null); // Ref for local video

  useEffect(() => {
    // Setup socket connection
    socketRef.current = io("/");

    const joinRoom = async () => {
      try {
        // Get media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;

        // Show local stream in the local video element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Emit event to join the room
        socketRef.current.emit("join-room", channelId);

        socketRef.current.on("user-joined", (userId: string) => {
          // Handle new peer joining
          const peer = createPeer(userId, socketRef.current.id, stream);
          setPeers((prevPeers) => [...prevPeers, peer]);
        });

        socketRef.current.on("receive-signal", (data: any) => {
          // Handle receiving a signal from another peer
          const peer = addPeer(data.signal, data.callerId, stream);
          setPeers((prevPeers) => [...prevPeers, peer]);
        });

        socketRef.current.on("ice-candidate", (data: any) => {
          const candidate = new RTCIceCandidate(data.candidate);
          peers.forEach((peer) => peer.addIceCandidate(candidate));
        });
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    joinRoom();

    return () => {
      // Clean up
      socketRef.current.disconnect();
      peers.forEach((peer) => peer.close());
    };
  }, [channelId,peers]); // Add `peers` to the dependency array

  const createPeer = (
    userToSignal: string,
    callerId: string,
    stream: MediaStream
  ) => {
    const peer = new RTCPeerConnection();
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("send-ice-candidate", {
          recipient: userToSignal,
          candidate: event.candidate,
        });
      }
    };
    peer.ontrack = (event) => {
      const videoElement = videoRefs.current[userToSignal];
      if (videoElement) { // Check if videoElement is not null
        videoElement.srcObject = event.streams[0];
      } else {
        console.warn(`Video element for user ${userToSignal} is not found.`);
      }
    
    };

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.createOffer().then((offer) => {
      peer.setLocalDescription(offer).then(() => {
        socketRef.current.emit("send-signal", {
          recipient: userToSignal,
          signal: offer,
          callerId,
        });
      });
    });

    return peer;
  };

  const addPeer = (
    incomingSignal: RTCSessionDescriptionInit,
    callerId: string,
    stream: MediaStream
  ) => {
    const peer = new RTCPeerConnection();
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("send-ice-candidate", {
          recipient: callerId,
          candidate: event.candidate,
        });
      }
    };
    peer.ontrack = (event) => {
      const videoElement = videoRefs.current[callerId];
      if(videoElement){
        videoElement.srcObject = event.streams[0];
      }else{
        console.warn(`Video element for user ${callerId} is not found.`);
      }
    };

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.setRemoteDescription(incomingSignal).then(() => {
      peer.createAnswer().then((answer) => {
        peer.setLocalDescription(answer).then(() => {
          socketRef.current.emit("send-signal", {
            recipient: callerId,
            signal: answer,
          });
        });
      });
    });

    return peer;
  };

  return (
    <div className="video-container">
      {/* Render local video */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "100%", height: "auto" }}
      />

      {/* Dynamically render video elements for each peer */}
      {peers.map((_, index) => (
        <video
          key={index}
          ref={(el) => {
            videoRefs.current[index] = el; // Assign the video element for the peer
          }}
          autoPlay
          playsInline
          style={{ width: "100%", height: "auto" }}
        />
      ))}
    </div>
  );
};

export default VideoStream;
