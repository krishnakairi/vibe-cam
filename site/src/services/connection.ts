import API from "./api";
import Initiator from "./initiator";
import NonInitiator from "./non-initiator";
import { PollUntil } from 'poll-until-promise';
import { isString } from 'lodash';

export default class Connection {
    public peer: Initiator | NonInitiator | null;
    public id: string | null;
    private api: API;
    public connected: boolean;

    constructor() {
        this.api = new API();
        this.id = null
        this.connected = false;
        this.peer = null;
    }

    async create() {
        this.peer = new Initiator({})
        const offer = await this.peer.initate();
        const { connectionId } = await this.api.createConnection({
            peerId: this.peer.peerId,
            offer: offer
        }).then((resp: any) => resp.data);
        this.id = connectionId;
        this.peer.connectionId = connectionId;
    }

    async clone(connectionId: string, stream: any) {
        const connection = await this.api.getConnection(connectionId)
            .then((resp: any) => resp.data);
        this.id = connection.id as string;
        this.peer = new NonInitiator(this.id, connection.offer, { stream });
    }
}
