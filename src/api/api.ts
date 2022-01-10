import axios, {Method} from "axios";
import {FileEntity} from "./fileApi";

export const axiosInstance = axios.create({
    baseURL: `/api`
});

axiosInstance.interceptors.response.use(value => {
    return value.data
})

type RequestParam = {
    method: Method;
    url?: string
    data?: any
    params?: any
}

export abstract class Api {
    abstract path: string

    async request({url, data, params, method}: RequestParam) {
        url = url ? `${this.path}/${url}` : this.path;
        return await axiosInstance.request<any, FileEntity[]>({
            url,
            data,
            params,
            method
        })
    }
}
