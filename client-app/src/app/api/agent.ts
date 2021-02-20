import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { IActivity } from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

//const responseBody = (response: AxiosResponse) => response.data;
const responseBody = (response: AxiosResponse) => response ? response.data : [];
axios.interceptors.response.use(undefined, error => {
    console.log(error.message);
    console.log(error.response);
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network error - make sure API is running!');
    }

    const { status, data, config } = error.response;
    if (status === 404) {
        history.push('/notfound');
    }
    if (status === 400 && config.methor === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notfound');
    }
    if (status === 500) {
        toast.error('Server error - check the terminal for more info!');
    }
})
const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));


const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
}

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities/'),
    detail: (id: string) => requests.get(`/Activities/${id}`),
    create: (activity: IActivity) => requests.post('/Activities/', activity),
    update: (activity: IActivity) => requests.put(`/Activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/Activities/${id}`)
}

export default {
    Activities
}