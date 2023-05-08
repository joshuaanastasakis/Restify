import axios from "axios";
import { setupInterceptorsTo, API_URL } from "./interceptors";

export const headerContent = {
    "json": {headers: {"Content-Type": "application/json"}},
    "image": {headers: {"content-type": "multipart/form-data"}},
}

const api = setupInterceptorsTo(
    axios.create({
        baseURL: API_URL,
        method: 'HEAD',
        crossdomain: true,
        // headers: {"Content-Type": "application/json",},
    })
);

export default api;