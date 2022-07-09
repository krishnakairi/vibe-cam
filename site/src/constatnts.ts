export interface IInitiatorConfig {
    stream?: any;
    wrtc?: any;
}

export interface INonInitiatorConfig {
    stream?: any;
    wrtc?: any;
}

export interface IPeerConfig {
    stream?: any;
    initiator: boolean;
    wrtc?: any;
}

export interface IConnection {
    id?: string;
    peerId?: string;
    offer?: string;
    answer?: string;
}
