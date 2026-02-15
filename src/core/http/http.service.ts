import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { WorkerLogger } from '../logger/logger.service.js';
import { HttpClient } from './http.client.js';

@Injectable()
export class WorkerHttpService {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly logger: WorkerLogger
    ) {}

    async get<T>(
        client: string,
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        this.logger.debug(`[${client}] GET ${url}`);
        return this.httpClient.use(client).get<T>(url, config);
    }

    async post<T>(
        client: string,
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        this.logger.debug(`[${client}] POST ${url}`);
        return this.httpClient.use(client).post<T>(url, data, config);
    }

    async put<T>(
        client: string,
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        this.logger.debug(`[${client}] PUT ${url}`);
        return this.httpClient.use(client).put<T>(url, data, config);
    }

    async delete<T>(
        client: string,
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        this.logger.debug(`[${client}] DELETE ${url}`);
        return this.httpClient.use(client).delete<T>(url, config);
    }
}
