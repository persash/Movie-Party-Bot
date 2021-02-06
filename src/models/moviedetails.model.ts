import { title } from "process";

export class MovieDetails {
    title: string;
    description?: string;
    imdbRating?: string;
    availableOn?: Array<string>
    ratings: Array<Ratings>
    releaseDate?: string;
    runTime?: string;
    actors?: string;
    director?: string;
    genre?: string;
    error?: string = "";
    
}

export class Ratings {
    source: string;
    score: string;

    constructor(source: string, score: string) {
        this.source = source;
        this.score = score;
    }
}