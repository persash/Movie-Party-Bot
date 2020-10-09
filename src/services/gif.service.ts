

import Axios from 'axios';


let cfg = require('../../config.json')

export class GifService {

    static async search(term: string, limit: number) {
        const { data } = await Axios.get(`${cfg.tenorBaseUrl}/search?key=${cfg.tenorApiKey}&q=${term.replace('&', '%26').replace("#", "%23")}&limit=${limit}`)
        return data;
    }

}