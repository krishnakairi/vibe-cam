import PusherJs from 'pusher-js';
import EventEmitter from 'eventemitter3';

PusherJs.logToConsole = true;

export default class Pusher extends EventEmitter {
    constructor(connectionId) {
        super()
        this.connectionId = connectionId;
        this.pusher = new PusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
        });
        this.initChannel()
    }

    initChannel() {
        const channelName = 'vibe-cam-' + this.connectionId;
        this.channel = this.pusher.subscribe(channelName);
        this.channel.bind('signal', (data) => {
            this.emit('signal', data);
        }, this)
    }
}
