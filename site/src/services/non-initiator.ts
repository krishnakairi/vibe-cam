import { INonInitiatorConfig } from "./../constatnts";
import API from "./api";
import Peer from "./peer";

export default class NonInitiator extends Peer {
    public connectionId: string;
    private api: API;
    private offer: string;
    private answer: string | null;

    constructor(connectionId: string, offer: string, config: INonInitiatorConfig) {
        super({ ...config, initiator: false });
        this.api = new API();
        this.connectionId = connectionId;
        this.offer = offer;
        this.answer = null;
    }

    public async acceptOffer(): Promise<string> {
        const { sdp } = await this.signal({ sdp: this.offer, type: 'offer' }, true);
        if (sdp === null) {
            throw new Error('Unable to request');
        }
        this.answer = sdp as string;
        this.event.emit('answer', this);
        await this.api.updateConnection(this.connectionId, { answer: this.answer })
        return this.answer;
    }
}
