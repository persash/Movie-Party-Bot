import Axios from 'axios';

import { MovieDetails, Ratings } from '../models/moviedetails.model';
import { GifService } from './gif.service';

import { UtilsService } from './utils.service'
import { YoutubeService } from './youtube.service'

let cfg = require('../../config.json')

export class MovieService {

    async getMovieDetails(title: string) : Promise<MovieDetails> {
        
        const data = await UtilsService.fetchHTML(`${cfg.thatMovieInfoSite}/search?q=${title.replace(' ', '%20').replace('&', '%26').replace("#", "%23")}`);

        let html = data.html();

        if(!data || !html)
            return null;
        
        let showUrlIndex = html.indexOf('/movie/');

        if(showUrlIndex == -1)
            return null;


        let details = new MovieDetails();

        details.title = title;

        let imdbIndex = html.indexOf('imdb_rating":');
        let imdbRating = html.substr(imdbIndex + 13, 3);
        //var showUrl = html.substr(showUrlIndex, 6);
        const maxAttempts = 100;
        let i = 1;
        let showUrlRest = "";
        if (showUrlIndex > -1) {
            while (i < maxAttempts) {
                let tempChar = html.substr((showUrlIndex + 5) + i, 1);
                if (tempChar === '"')
                    break;
                showUrlRest += tempChar;
                i++;
            }
        }

        details.imdbRating = imdbRating.replace(',"', "") || "None";

        const movieData = await UtilsService.fetchHTML(cfg.thatMovieInfoSite + `/movie${showUrlRest}`);

        let movieHtml = movieData.html();

        if(movieData && movieHtml) {
            let movieDescriptionIndex = movieHtml.indexOf('"description">');

            if(movieDescriptionIndex > -1) {
                const maxDescAttempts = 1000;
                let j = 1;
                var descRest = "";
                while(j < maxDescAttempts) {
                    let tempChar = movieHtml.substr((movieDescriptionIndex + 13) + j, 1);
                    if(tempChar === '<')
                        break;
                    descRest += tempChar;
                    j++;
                }
            }

            const hboMaxIndex = movieHtml.indexOf('subscription on HBO Max');
            const rentOrBuyIndex =  movieHtml.indexOf('Available to rent or buy');
            //const rentOrPurchaseIndex = movieHtml.indexOf('rent or purchase');
            const netflixIndex = movieHtml.indexOf('subscription on Netflix')
            const primeVideo = movieHtml.indexOf('subscription on Prime Video');
            const showtimeIndex = movieHtml.indexOf('streaming on Showtime');
            const starzIndex = movieHtml.indexOf('streaming on Starz');
            const disneyplusIndex = movieHtml.indexOf('subscription on Disney+');

            if (movieDescriptionIndex > -1 && descRest !== "") {
                // const escapeHTML = str => str.replace(/[&<>'"]/g,
                //     tag => ({
                //         '&': '&amp;',
                //         '<': '&lt;',
                //         '>': '&gt;',
                //         "'": '&#39;',
                //         '"': '&quot;'
                //     }[tag]));
                details.description = descRest;
            }
            else {
                details.description = 'No Description'
            }

            let someArray = [];

            if (hboMaxIndex > -1) {
                someArray.push('HBO Max')
            }
            if (rentOrBuyIndex > -1) {
                someArray.push('Rent or Buy')
            }
            if (netflixIndex > -1) {
                someArray.push('Netflix')
            }
            if (primeVideo > -1) {
                someArray.push('Prime Video')
            }
            if (showtimeIndex > -1) {
                someArray.push('Showtime')
            }
            if (starzIndex > -1) {
                someArray.push('Starz')
            }
            if (disneyplusIndex > -1) {
                someArray.push('Disney+')
            }
            if (someArray.length > 0) {

                details.availableOn = someArray;
            }
        }

        return details;

    }

    async getMovieInfo(title: string) : Promise<MovieDetails> {
        let details = new MovieDetails();
        const { data } = await Axios.get(`${cfg.movieInfoApi}/?t=${title.replace(' ', '%20').replace('&', '%26').replace("#", "%23")}&apikey=${cfg.movieInfoApiKey}`)

        if(data === undefined)
            return null;

        if(data && data.Response === "False")
            details.error = data.Error;

        
        details.title = data.Title;
        if(data.Ratings) {
            details.ratings = data.Ratings.map(r => new Ratings(r.Source, r.Value));
        }

        details.director = data.Director;
        details.actors = data.Actors;
        details.description = data.Plot;
        details.genre = data.Genre;
        details.runTime = data.Runtime;
        details.releaseDate = data.Released;

        return details;
    }

    async findTrailer(title: string) {

        const results = await YoutubeService.search(title, 5);

        if(!results || !results.items || results.items.length == 0)
            return null;

        const trailer = results.items.find(item => {
            let details = item.snippet;
            if (details.title.indexOf('Trailer') > -1 || details.title.indexOf('trailer') > -1) {
                return item;
            }
        });

        if(!trailer)
            return null;

        return trailer;

    }

    async getRandomMovieFact() : Promise<any> {
        const results = await Axios.get(`https://www.reddit.com/r/MovieDetails/random.json`);

        if(!results || !results.data || !results.data[0].data.children)
            return null;

        const randomFact = results.data[0].data.children[0].data;
        return {
            title: randomFact.title,
            url:randomFact.url
        }

    }

    async getMovieFact(movie: string) : Promise<any> {

        const results = await Axios.get(`https://www.reddit.com/r/MovieDetails/search.json?q=${movie.replace('&', '%26').replace("#", "%23")}&restrict_sr=1`);

        if(!results || !results.data.data.children[0].data.title)
            return null;

        const movieSplit = movie.split(' ');
        let capMovie = '';
        movieSplit.forEach(m => {
            capMovie += m.trim().charAt(0).toUpperCase() + m.slice(1) + ' ';
        });

        capMovie = capMovie.trim();

        let filter = results.data.data.children.filter(c => {
            const title = c.data.title as string;
            if(title.indexOf(capMovie) > -1) {
                return c;
            }
        });

        let randomFact = filter[Math.floor(Math.random() * filter.length)];

        if(!randomFact)
            randomFact = results.data.data.children[Math.floor(Math.random() * results.data.data.children.length)];

        return {
            title: randomFact.data.title,
            url:randomFact.data.url
        }

    }

    async getMovieGif(movie: string) {
        const results = await GifService.search(movie, 25);

        if(!results || !results.results || results.results.length == 0)
            return null;

        const randomGif = results.results[Math.floor(Math.random() * results.results.length)];

        return randomGif;
    }

}