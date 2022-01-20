import axios, {Method} from "axios";
import {FileEntity} from "./fileApi";
import {errorMessage} from "../util/common";

export const axiosInstance = axios.create({
    baseURL: `/api`
});

axiosInstance.interceptors.response.use(value => {
    return value.data
}, error => {
    if (error.response) {
        errorMessage(error.response.data.message)
    }
})

type RequestParam = {
    method: Method;
    url?: string
    data?: any
    params?: any
}

export abstract class Api<Entity> {
    abstract path: string

    async request({url, data, params, method}: RequestParam) {
        url = url ? `${this.path}${url}` : this.path;
        return await axiosInstance.request<any, Entity[]>({
            url,
            data,
            params,
            method
        })
    }
}
