import axios from 'axios';

export default class API {
    constructor() {
        this.apiClient = axios.create({
            baseURL: 'https://vibe-cam.vercel.app/api',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    sendSignal(connectionId, signal, peerId){
        return this.apiClient.post('/signal', { connectionId, signal, peerId });
    }
}
