import SimplePeer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import Pusher from './pusher';
import API from './api';

export default function Peer(connectionId, stream) {
    const peerId = uuidv4();
    const api = new API();
    const pusher = new Pusher(connectionId);

    const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream
    });

    peer.on('error', (err) => console.log('error', err));

    peer.on('signal', (data) => {
        console.log('PEER-SIGNAL', data)
        api.sendSignal(connectionId, data, peerId)
            .then(data => {
                console.log(data)
            })
            .catch(err => console.error);
    })

    pusher.on('signal', (data) => {
        console.log('PUSHER-SIGNAL', data)
        const { peerId: pId, signal } = data;
        if (peerId === pId) return; 
        peer.signal(signal);
    })
    
    return peer;
}
