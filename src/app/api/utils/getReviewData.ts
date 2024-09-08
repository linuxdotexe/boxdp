import axios from "axios";
import * as cheerio from "cheerio";

import UrlValidationError from "@/app/api/utils/UrlValidationError";

import LetterboxdData from "@/utils/LetterboxdData";
import { AxiosResponse } from "axios";
import ApiData from "@/utils/ApiData";

interface TmdbBackdrop {
  aspect_ratio: number;
  height: number;
  iso_639_1: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

function getScrapedData(res: AxiosResponse<any, any>) {
  const $ = cheerio.load(res.data);
  const scriptTagText = $('script[type="application/ld+json"]').text();
  const film_year = $(".film-title-wrapper > small").text();
  const { openBrace, closeBrace } = getOpenCloseBraces(scriptTagText);
  const data: LetterboxdData = makeJson(
    scriptTagText.slice(openBrace, closeBrace + 1)
  );
  const avatar_url = new URL($("a.avatar.-a24 > img").attr("src") as string);
  avatar_url.searchParams.delete("v");
  let avatar = "";
  if (avatar_url.hostname !== "s.ltrbxd.com") {
    // not static avatar i.e. not default pic
    let path_parts = avatar_url.pathname.split("/");
    path_parts.pop();
    path_parts.push("avtr-0-220-0-220-crop.jpg");
    avatar_url.pathname = path_parts.join("/");
  }
  avatar = avatar_url.toString();
  return { ...data, film_year, avatar, };
}

async function getImages(url: string) {
  const API_KEY = process.env.TMDB_API_KEY;
  if (!API_KEY) throw new Error("missing: tmdb api key");
  const images: Array<string> = [];
  const res = await axios({
    method: "GET",
    headers: {
      accept: "application/json",
    },
    url,
  });

  const $ = cheerio.load(res.data);
  const body = $("body");
  let content_type = body.attr("data-tmdb-type");
  let content_id = body.attr("data-tmdb-id");

  // if body tag doesn't have tmdb attributes
  if (!content_id || !content_type) {
    const tmdb_url = $('a[data-track-action="TMDb"]').attr("href");
    if (tmdb_url) {
      const tmdb_url_obj = new URL(tmdb_url);
      if (
        tmdb_url_obj.hostname === "www.themoviedb.org" &&
        tmdb_url_obj.pathname !== ""
      ) {
        const tmdb_pathname_split = tmdb_url_obj.pathname.split("/");
        content_id = tmdb_pathname_split[2];
        content_type = tmdb_pathname_split[1];
      }
    }
    if (!content_id || !content_type) {
      let lbx_image = $("#backdrop").attr("data-backdrop2x");
      if (!lbx_image) lbx_image = $("#backdrop").attr("data-backdrop");
      if (lbx_image) images.push(lbx_image);
      return images;
    }
  }

  const tmdbData = await axios({
    method: "GET",
    headers: {
      accept: "application/json",
    },
    url: `https://api.themoviedb.org/3/${content_type}/${content_id}/images?api_key=${API_KEY}`,
  });

  const IMAGES_BASE_URL = "https://image.tmdb.org/t/p/original";
  if (tmdbData.data.backdrops.length > 0) {
    tmdbData.data.backdrops.forEach((item: TmdbBackdrop) => {
      images.push(IMAGES_BASE_URL + item.file_path);
    });
  } else if (tmdbData.data.posters.length > 0) {
    tmdbData.data.posters.forEach((item: TmdbBackdrop) => {
      images.push(IMAGES_BASE_URL + item.file_path);
    });
  }
  return images;
}

function getOpenCloseBraces(scriptTagText: string) {
  var openBrace = -1;
  var closeBrace = -1;
  for (var i = 0; i < scriptTagText.length; i++) {
    if (scriptTagText[i] == "{") {
      openBrace = i;
      break;
    }
  }
  for (var i = scriptTagText.length - 1; i >= 0; i--) {
    if (scriptTagText[i] == "}") {
      closeBrace = i;
      break;
    }
  }
  if (openBrace != -1 && closeBrace != -1) return { openBrace, closeBrace };
  throw new Error("scraping failed. braces issue");
}

function makeJson(data: string) {
  try {
    const obj: LetterboxdData = JSON.parse(data);
    return obj;
  } catch (err) {
    throw new Error("Cannot parse data to JSON");
  }
}

const letterboxdReviewRegex =
  /^https:\/\/letterboxd\.com\/([a-zA-Z0-9_-]+)\/film\/([a-zA-Z0-9_-]+)\/?(\d*)\/?$/;

export default async function getReviewData(req_url: string) {
  const axios_options = {
    method: "get",
    url: req_url,
    timeout: 5 * 1000,
  };

  const res = await axios(axios_options);
  if (!res) {
    throw new UrlValidationError(`could not get a response`, 500);
  }
  if (res.request.host !== "letterboxd.com") {
    throw new UrlValidationError(
      `url does not resolve to 'letterboxd.com'. Resolves to: ${res.request.host}`,
      400
    );
  }
  if (!letterboxdReviewRegex.test(res.request.res.responseUrl)) {
    throw new UrlValidationError(
      `url is not a review url.`,
      400,
      res.request.res.responseUrl
    );
  }
  const data = getScrapedData(res);
  let ratingValue: number;
  if (!data.reviewRating) {
    ratingValue = 0;
  } else {
    ratingValue = data.reviewRating.ratingValue;
  }
  const images = await getImages(data.itemReviewed.sameAs);
  const apiData: ApiData = {
    reviewerId: data.author[0].sameAs.split("/")[3],
    reviewerName: data.author[0].name,
    reviewDesc: data.description ? data.description : "",
    reviewContent: data.reviewBody ? data.reviewBody : "",
    filmName: data.itemReviewed.name,
    filmYear: data.film_year,
    reviewRating: ratingValue,
    filmURL: data.itemReviewed.sameAs,
    url: data.url,
    datePublished: data.datePublished,
    directors: data.itemReviewed.director.map((item) => item.name),
    images,
    avatar: data.avatar,
  };
  return apiData;
}
