import axios from 'axios';
import * as cheerio from 'cheerio';

import UrlValidationError from '@/app/api/utils/UrlValidationError';

import LetterboxdData from '@/utils/LetterboxdData';
import { AxiosResponse } from 'axios';
import ApiData from '@/utils/ApiData';

interface TmdbBackdrop {
    aspect_ratio: number,
    height: number,
    iso_639_1: string,
    file_path: string,
    vote_average: number,
    vote_count: number,
    width: number
}

function getScrapedData(res: AxiosResponse<any, any>) {
    const $ = cheerio.load(res.data);
    const scriptTagText = $('script[type="application/ld+json"]').text();
    const film_year_scrape = $('.film-title-wrapper > small').text();
    const { openBrace, closeBrace } = getOpenCloseBraces(scriptTagText);
    const data: LetterboxdData = makeJson(scriptTagText.slice(openBrace, closeBrace + 1));
    data.film_year = film_year_scrape;
    return { ...data, film_year: film_year_scrape };

}

async function getImages(url: string) {
    const API_KEY = process.env.TMDB_API_KEY;
    const images: Array<string> = [];
    const res = await axios({
        method: 'GET',
        headers: {
            accept: 'application/json'
        },
        url,
    });

    const $ = cheerio.load(res.data);
    const body = $('body');
    const content_type = body.attr('data-tmdb-type');
    const content_id = body.attr('data-tmdb-id');
    if (!content_id || !content_type) {
        let lbx_image = $('#backdrop').attr('data-backdrop2x');
        if (!lbx_image)
            lbx_image = $('#backdrop').attr('data-backdrop');
        if (lbx_image)
            images.push(lbx_image);
        return images;
    }
    const tmdbData = await axios({
        method: 'GET',
        headers: {
            accept: 'application/json'
        },
        url: `https://api.themoviedb.org/3/${content_type}/${content_id}/images?api_key=${API_KEY}`,
    });

    const IMAGES_BASE_URL = 'https://image.tmdb.org/t/p/original';
    if (tmdbData.data.backdrops.length > 0) {
        tmdbData.data.backdrops.forEach((item: TmdbBackdrop) => {
            images.push(IMAGES_BASE_URL + item.file_path)
        })
    }
    else if (tmdbData.data.posters.length > 0) {
        tmdbData.data.posters.forEach((item: TmdbBackdrop) => {
            images.push(IMAGES_BASE_URL + item.file_path)
        })
    }
    return images;
}

function getOpenCloseBraces(scriptTagText: string) {
    var openBrace = -1;
    var closeBrace = -1;
    for (var i = 0; i < scriptTagText.length; i++) {
        if (scriptTagText[i] == '{') {
            openBrace = i;
            break;
        }
    }
    for (var i = scriptTagText.length - 1; i >= 0; i--) {
        if (scriptTagText[i] == '}') {
            closeBrace = i;
            break;
        }
    }
    if (openBrace != -1 && closeBrace != -1)
        return { openBrace, closeBrace };
    throw new Error('scraping failed. braces issue');
}

function makeJson(data: string) {
    try {
        const obj: LetterboxdData = JSON.parse(data);
        return obj;
    } catch (err) {
        throw new Error('Cannot parse data to JSON');
    }
}

export default async function getReviewData(req_url: string) {
    const axios_options = {
        method: "get",
        url: req_url,
        timeout: 5 * 1000,
    };
    
    const res = await axios(axios_options);

    if (res.request.host !== 'letterboxd.com') {
        throw new UrlValidationError(
            `url does not resolve to 'letterboxd.com'. Resolves to: ${res.request.host}`,
            400,
        );
    }
    const data = getScrapedData(res);
    let ratingValue: number;
    if (!data.reviewRating) {
        ratingValue = 0
    }
    else {
        ratingValue = data.reviewRating.ratingValue
    }
    const images = await getImages(data.itemReviewed.sameAs);
    const apiData: ApiData = {
        reviewerId: data.author[0].sameAs.split('/')[3],
        reviewerName: data.author[0].name,
        reviewDesc: data.description,
        reviewContent: data.reviewBody,
        filmName: data.itemReviewed.name,
        filmYear: data.film_year,
        reviewRating: ratingValue,
        filmURL: data.itemReviewed.sameAs,
        url: data.url,
        datePublished: data.datePublished,
        images,
    };
    return apiData;
}