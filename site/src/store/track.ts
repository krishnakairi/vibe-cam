import create from 'zustand';
import produce from 'immer';
import Connection from '../services/connection';
import NonInitiator from '../services/non-initiator';

let connection: Connection;

async function createConnection(connectionId: string, stream: any) {
    try {
        connection = new Connection();
        await connection.clone(connectionId, stream);
        connState({ status: 'WAITING', loading: false, id: connectionId});
        const peer = connection.peer as NonInitiator;
        await peer.acceptOffer();
        connState({ status: 'CONNECTED'});
    } catch (error) {
        console.log(error);
        connState({ status: 'FAILED', error  });
    }
}

const useTrackStore = create(set => ({
    connection: { 
        id: null, 
        loading: true, 
        status: 'CLONING', 
        connected: false,
    },
    createConnection: (connectionId: string, stream: any) => createConnection(connectionId, stream)
}))

function connState(partial: any) {
    useTrackStore.setState(produce((draft: any) => {
        const conn = draft.connection;
        draft.connection = { ...conn, ...partial }
    }));
}

export default useTrackStore;
