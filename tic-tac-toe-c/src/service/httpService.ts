import axios, { AxiosInstance, AxiosResponse } from "axios";

const instance: AxiosInstance = axios.create({
});

instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        const expectedError: boolean =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;

        if (!expectedError) {
            console.log("Logging the error", error);
            alert("An unexpected error occurred");
        }

        return Promise.reject(error);
    }
);

export default {
    get: instance.get,
    post: instance.post,
    put: instance.put,
    delete: instance.delete,
};
