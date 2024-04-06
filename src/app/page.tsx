"use client";

import { useState, useRef } from "react";

import ApiData from "@/utils/ApiData";
import ApiDataError from "@/utils/ApiDataError";

import ImageViewer from "@/components/ImageViewer";
import SearchBox from "@/components/SearchBox";

const BASE_URL =
  "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app/review?blink=";
const IMAGE_URL =
  "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app/image?blink=";
const DEFAULT_REVIEW =
  "https://letterboxd.com/raybean/film/puss-in-boots-the-last-wish/";


export default function Home() {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const myRef = useRef<HTMLElement | null>(null);

  function fetcher(url: string) {
    setApiData(null);
    setIsFetching(true);
    fetch(url, { method: "GET" })
      .then((response) => {
        setIsFetching(false);
        return response.json();
      })
      .then((res: ApiData | ApiDataError) => {
        if ("error" in res) {
          throw res;
        }
        setApiData(res);
        setIsVisible(true);
      })
      .catch((error: ApiDataError) => {
        console.error(error);
      });
  }

  return (
    <div className="flex-1 bg-gradient-to-r from-orange-950 via-green-950 to-blue-950">

      <SearchBox isFetching={isFetching} setIsVisible={setIsVisible} fetcher={fetcher} BASE_URL={BASE_URL} />

      {isVisible &&
        (apiData ?

          <ImageViewer apiData={apiData} myRef={myRef} IMAGE_URL={IMAGE_URL} /> :

          <div className="flex justify-center p-10">
            <h1 className="text-7xl bg-transparent font-bold">
              {isFetching ?
                "Holup! We're cooking..." :
                "Looks like you messed up the url..."}
            </h1>
          </div>
        )
      }
    </div>
  );
};
