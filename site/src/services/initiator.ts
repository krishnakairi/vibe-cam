import { IInitiatorConfig } from "./../constatnts";
import Peer from "./peer";
import { PollUntil } from 'poll-until-promise';
import { isString } from 'lodash';
import API from "./api";

export default class Initiator extends Peer {
    public connectionId: string | null;
    private api: API;
    private offer: string | null;
    private answer: string | null;

    constructor(config: IInitiatorConfig) {
        super({ ...config, initiator: true });
        this.api = new API();
        this.offer = null;
        this.connectionId = null;
        this.answer = null;
    }

    public async initate(): Promise<string> {
        const { sdp } = await this.once('signal');
        if (sdp === null) {
            throw new Error('Unable to get offer');
        }
        this.offer = sdp as string;
        this.event.emit('offer', this.offer);
        return this.offer;
    }

    async acceptAnswer() {
        const pollUntil = new PollUntil();
        await pollUntil
            .stopAfter(5 * 60 * 1000)    // Stop trying after 5mins
            .tryEvery(15000)          // Tries every 10secs
            .execute(async () => {
                if (this.connectionId === null) {
                    throw new Error('Empty connectionId');
                }
                const connection = await this.api.getConnection(this.connectionId)
                    .then((resp: any) => resp.data);
                if(!isString(connection.answer)) {
                    throw new Error('No answer found!')
                }
                this.answer = connection.answer;
                this.signal({ sdp: connection.answer, type:'answer' }, false);
                this.event.emit('accept', connection.answer);
            });
    }
}
