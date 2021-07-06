import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import https from 'https'

export class HTTPClient {
    private axiosInstance: AxiosInstance

    constructor() {
        this.axiosInstance = axios.create({
			httpsAgent: new https.Agent({
				rejectUnauthorized: false,
			}),
		})
    }

    public async get<T>(url: string, config?: AxiosRequestConfig | undefined): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, config)
        return response.data
    }
}