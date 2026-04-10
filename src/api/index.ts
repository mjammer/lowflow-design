import axios, {
  type AxiosInstance,
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse
} from 'axios'
import { notification } from 'antd'

export interface Result {
  code: number
  success: boolean
  message: string
}

export interface ResultData<T = any> extends Result {
  data: T
}

const config = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000
}

class RequestHttp {
  service: AxiosInstance

  public constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config)
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response
        return data
      },
      (error: AxiosError) => {
        const { response, message } = error
        const data = response?.data as ResultData
        const errMsg = data ? data.message : message
        notification.error({ message: errMsg || '未知错误' })
        return Promise.reject(response?.data || error)
      }
    )
  }

  get<T>(url: string, params?: object, config = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ...config })
  }

  post<T>(url: string, data?: object, config = {}): Promise<ResultData<T>> {
    return this.service.post(url, data, config)
  }

  request<T>(config: AxiosRequestConfig): Promise<ResultData<T>> {
    return this.service.request(config)
  }

  download(url: string, data?: object, config = {}): Promise<BlobPart> {
    return this.service.post(url, data, { ...config, responseType: 'blob' })
  }
}

export default new RequestHttp(config)
