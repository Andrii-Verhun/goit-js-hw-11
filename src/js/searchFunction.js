import axios from 'axios';

export const search = (url, query, apiKey) => {
    return axios.get(`${url}`, {
        params: {
            key: apiKey,
            q: query,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: 1,
            per_page: 40
        }
    });
};