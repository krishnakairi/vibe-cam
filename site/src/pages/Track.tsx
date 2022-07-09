import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useTrackStore from '../store/track';
// import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

function Track() {
  let { id } = useParams();
  const connection = useTrackStore((state: any) => state.connection);
  const createConnection = useTrackStore((state: any) => state.createConnection);
  const sendMsg = useTrackStore((state: any) => state.sendMsg);

  const[value, setValue] = useState(''); 
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      console.log(stream)
      createConnection(id, stream);
    }).catch(() => {})
  }, [])

  const handle = () => {
    sendMsg(value);
  }

  return (
    <div>
      <h2>Track</h2>
      <p>{connection.id} - {connection.status}</p>
      <input value={value} onChange={(e) => {setValue(e.target.value)}} />
      <button onClick={handle}>Send</button>
      {/* <Webcam
        audio={false}
        videoConstraints={videoConstraints}
        onUserMedia={ (stream) => {
          createConnection(id, stream);
        }}
      /> */}
    </div>
  );
}

export default Track;