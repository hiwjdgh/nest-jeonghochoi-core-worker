import { Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { WorkerLogger } from '../logger/logger.service.js';

@Injectable()
export class WorkerHttpService {
    constructor(
        private readonly clients: Map<string, AxiosInstance>,
        private readonly logger: WorkerLogger
    ) {}

    private client(name: string): AxiosInstance {
        const client = this.clients.get(name);
        if (!client) {
            throw new Error(`HTTP client '${name}' is not registered`);
        }
        return client;
    }

    async get<T>(
        client: string,
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        this.logger.debug(`[${client}] GET ${url}`);
        const res = await this.client(client).get<T>(url, config);
        return res.data;
    }

    async post<T>(
        client: string,
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        this.logger.debug(`[${client}] POST ${url}`);
        const res = await this.client(client).post<T>(url, data, config);
        return res.data;
    }

    async put<T>(
        client: string,
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        this.logger.debug(`[${client}] PUT ${url}`);
        const res = await this.client(client).put<T>(url, data, config);
        return res.data;
    }

    async delete<T>(
        client: string,
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        this.logger.debug(`[${client}] DELETE ${url}`);
        const res = await this.client(client).delete<T>(url, config);
        return res.data;
    }

    /**
     * 🔥 필요하면 axios 인스턴스 직접 꺼내기
     * (stream, interceptor, cancel token 등)
     */
    raw(client: string): AxiosInstance {
        return this.client(client);
    }
}
