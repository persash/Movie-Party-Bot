import * as cheerio from 'cheerio';
import Axios from 'axios';

export class UtilsService {

    static async fetchHTML(url) {
        const data = await Axios.get(url)
        return cheerio.load(data.data)
    }

}