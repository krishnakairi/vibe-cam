import axios, { AxiosInstance } from 'axios';
import { IConnection } from '../constatnts';

export default class API {
    private apiClient: AxiosInstance;

    constructor() {
        this.apiClient = axios.create({
            baseURL: 'https://g9fl28dkx2.execute-api.us-east-1.amazonaws.com/dev',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    getConnection(connectionId: string): Promise<IConnection> {
        return this.apiClient.get(`/connections/${connectionId}`)
    }

    createConnection(connection: IConnection): Promise<{ connectionId: string }> {
        return this.apiClient.post('/connections', connection);
    }

    updateConnection(connectionId: string, connection: IConnection): Promise<IConnection> {
        return this.apiClient.put(`/connections/${connectionId}`, connection)
    }
}
