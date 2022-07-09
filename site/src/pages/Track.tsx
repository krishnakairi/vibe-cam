import React, { useEffect } from 'react';
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

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      console.log(stream)
      createConnection(id, stream);
    }).catch(() => {})
  }, [])

  return (
    <div>
      <h2>Track</h2>
      <p>{connection.id} - {connection.status}</p>
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