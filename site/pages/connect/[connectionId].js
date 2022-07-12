import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Peer from './../../services/peer';
import Webcam from "react-webcam";


const Connect = () => {
  console.log(process.env.NEXT_PUBLIC_PUSHER_KEY)
  const router = useRouter()
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const { connectionId } = router.query
  const [isConnected, setConnected] = useState(false)

  const createConnection = (stream) => {
    const peer = Peer(connectionId, stream);
    peer.on('connect', () => {
      setConnected(true);
    })
  }

  return (
    <div>
      <h2>Connection</h2>
      <p>{connectionId} - {(isConnected)? 'true' : 'false'}</p>
      <Webcam
        audio={false}
        videoConstraints={videoConstraints}
        onUserMedia={ (stream) => {
          createConnection(stream);
        }}
      />
    </div>
  );
}

export default Connect
