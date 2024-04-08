"use client";

import { useState, useRef, Suspense } from "react";

import ImageViewer from "@/components/ImageViewer";
import SearchBox from "@/components/SearchBox";
export const dynamic = 'force-dynamic';
/*
import dynamic from "next/dynamic";
const ImageViewer = dynamic(() => import('@/components/ImageViewer'), {
  loading: () => <p>ImageViewer Loading...</p>,
});
const SearchBox = dynamic(() => import('@/components/SearchBox'), {
  loading: () => <p>SearchBox Loading...</p>,
});
*/

const BASE_URL =
  "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app/review?blink=";
const IMAGE_URL =
  "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app/image?blink=";
const DEFAULT_REVIEW =
  "https://letterboxd.com/raybean/film/puss-in-boots-the-last-wish/";


export default function Home() {
  // const [apiData, setApiData] = useState<ApiData | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [queryURL, setQueryURL] = useState("");




  return (
    <div className="flex-1 bg-gradient-to-r from-orange-950 via-green-950 to-blue-950">

      <SearchBox setQueryURL={setQueryURL} isFetching={isFetching} />

      {(isVisible ?
        <Suspense fallback={<h1 className="text-7xl bg-transparent font-bold">HELLO BRO</h1>}>
          <ImageViewer setIsFetching={setIsFetching} />
        </Suspense> :

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
