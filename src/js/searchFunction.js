import axios from 'axios';

export const search = (url, query, apiKey, numberPage) => {
    return axios.get(`${url}`, {
        params: {
            key: apiKey,
            q: query,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: numberPage,
            per_page: 40
        }
    });
};