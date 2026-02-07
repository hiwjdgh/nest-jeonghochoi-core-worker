import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { Injectable } from '@nestjs/common';
import { HttpClientOptions } from './http.types.js';
import { HttpError } from './http.error.js';
import { WorkerLogger } from '../logger/logger.service.js';

@Injectable()
export class HttpClient {
    private client: AxiosInstance;

    constructor(
        options: HttpClientOptions,
        private readonly logger: WorkerLogger
    ) {
        this.client = axios.create({
            baseURL: options.baseURL,
            timeout: options.timeoutMs ?? 5000,
            headers: options.headers,
        });

        axiosRetry(this.client, {
            retries: options.retries ?? 3,
            retryCondition: (error) =>
                axiosRetry.isNetworkError(error) ||
                axiosRetry.isRetryableError(error),
        });

        this.client.interceptors.response.use(
            (res) => res,
            (err) => {
                const status = err.response?.status;
                const data = err.response?.data;

                this.logger.error(
                    {
                        status,
                        data,
                        url: err.config?.url,
                    },
                    'HTTP request failed'
                );

                throw new HttpError(
                    `HTTP request failed: ${err.message}`,
                    status,
                    data
                );
            }
        );
    }

    get<T = any>(url: string, params?: any) {
        return this.client.get<T>(url, { params }).then((r) => r.data);
    }

    post<T = any>(url: string, body?: any) {
        return this.client.post<T>(url, body).then((r) => r.data);
    }

    put<T = any>(url: string, body?: any) {
        return this.client.put<T>(url, body).then((r) => r.data);
    }

    delete<T = any>(url: string) {
        return this.client.delete<T>(url).then((r) => r.data);
    }
}
