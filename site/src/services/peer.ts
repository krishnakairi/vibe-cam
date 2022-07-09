// import SimplePeer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import { IPeerConfig } from './../constatnts';
import EventEmitter from 'eventemitter3';
import { get } from 'lodash';

export default class Peer {
    public peerId: string;
    public initiator: boolean;
    public peerInstance: any;
    public event: EventEmitter;

    constructor(config: IPeerConfig) {
        this.peerId = uuidv4();
        this.initiator = config.initiator;
        this.event = new EventEmitter();

        const SimplePeer = get(window, 'SimplePeer');

        this.peerInstance = new SimplePeer({
            initiator: this.initiator,
            // answerConstraints: {
            //     offerToReceiveAudio: false,
            //     offerToReceiveVideo: false
            // },
            stream: config.stream,
            trickle: false,
            wrtc: config.wrtc
        });

        this.event.emit('created', this);

        this.peerInstance.on('connect', () => {
            console.log('peer connected');
            this.event.emit('connect', this.peerInstance);
            var userAgent = navigator.userAgent || navigator.vendor;
            this.peerInstance.send('hello from client');
            // console.log(config.stream);
            // this.peerInstance.addStream(config.stream)
        })
    }

    public async destroy(): Promise<void> {
        this.peerInstance.removeAllListeners()
        await this.once('close');
        this.peerInstance.destroy();
        this.event.emit('close');
    }

    public async signal(data: any, waitForResponse?: boolean): Promise<any> {
        let response = null;
        this.peerInstance.signal(data);
        if (waitForResponse) {
            response = await this.once('signal')
        }
        return response;
    }

    public once(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.peerInstance.once(key, (response: any) => {
                resolve(response)
            });
            this.peerInstance.once('error', (error: any) => {
                reject(error);
                this.event.emit('error', error);
            });
        })
    }
}
