import axios, { AxiosInstance, AxiosResponse } from "axios";

class AxiosRequest {
    public request: AxiosInstance;
    public self = axios;
    private BASE_URL: string = "https://trakteer.id/";

    constructor(auth: { XSRF_TOKEN: String, TRAKTEER_SESSION: String }) {
        this.request = axios.create({
            baseURL: this.BASE_URL,
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; Redmi Note 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Referer": "https://trakteer.id/",
                "Cookie": `XSRF-TOKEN=${auth.XSRF_TOKEN}; trakteer-sess=${auth.TRAKTEER_SESSION}`
            }
        });
    }

    get(endpoint: string, params: Object = {}): Promise<AxiosResponse | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.request.get(endpoint, { params: params });
                return resolve(response);
            } catch (err: any) {
                // if 403 bypass the cloudflare
                if (err.response.status === 403) {
                    const response = await this.__bypass(endpoint, "GET", this.request.defaults.headers, {}, params);
                    return resolve(response);
                }

                return reject(err);
            }
        });
    }

    private __bypass(endpoint: string, method: string, headers = {}, data = {}, params = {}): Promise<AxiosResponse | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const bs64 = Buffer.from(`${this.BASE_URL}${endpoint}?${new URLSearchParams(params).toString()}`).toString("base64");
                const response = await this.self({
                    url: `https://bypass.katowproject.dev/trakteer.php?q=${bs64}`,
                    method: method,
                    headers: headers,
                    data: data
                });

                return resolve(response);
            } catch (err) {
                return reject(err);
            }
        });
    }
}

export default AxiosRequest;