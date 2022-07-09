import create from 'zustand';
import produce from 'immer';
import Connection from '../services/connection';
import Initiator from '../services/initiator';


const connections = [];

const useHomeStore = create(set => ({
    connections: [],
    createConnection: () => {
        const connState = new ConnectionState({ 
            id: null, 
            loading: true, 
            status: 'CREATING', 
            connected: false,
        })
        createConnection(connState)
    }
}))


async function createConnection(connState: ConnectionState) {
    const connection = new Connection();
    connections.push(connection);
    try {
        await connection.create();
        const peer = connection.peer as Initiator;
        connState.update({ id: connection.id, loading: false, status: 'WAITING'  });
        console.log('hitttt');
        await peer.acceptAnswer();
        connState.update({ status: 'CONNECTED' });
    } catch (error) {
        connState.update({ status: 'FAILED', error  });
    }
}

// helper class to update connection state 
class ConnectionState {
    private index: number

    constructor(initial: any) {
        this.index = 0;
        useHomeStore.setState(produce((draft: any) => {
            const len = draft.connections.push({ ...initial });
            this.index = len - 1;
        }));
    }

    update(partial: any) {
        useHomeStore.setState(produce((draft: any) => {
            const conn = draft.connections[this.index];
            draft.connections[this.index] = { ...conn, ...partial }
        }));
    }
}

export default useHomeStore;
