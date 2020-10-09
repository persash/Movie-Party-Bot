
import Axios from 'axios';


let cfg = require('../../config.json')


export class YoutubeService {

    static async search(term: string, limit: number) {
        const { data } = await Axios.get(`${cfg.youtubeApiBaseUrl}/search?part=snippet,id&q=${term.replace('&', '%26').replace("#", "%23")}&maxResults=${limit}&key=${cfg.youtubeApiKey}`)
        return data;
    }

}