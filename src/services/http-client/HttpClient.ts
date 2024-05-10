import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";

export default class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get<T>(
      url,
      config
    );
    return response.data;
  }

  public async post<T, R>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    const response: AxiosResponse<R> = await this.axiosInstance.post<R>(
      url,
      data,
      config
    );
    return response.data;
  }

  public async put<T, R>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    const response: AxiosResponse<R> = await this.axiosInstance.put<R>(
      url,
      data,
      config
    );
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete<T>(
      url,
      config
    );
    return response.data;
  }

  // Add more methods for other HTTP request types as needed
}
