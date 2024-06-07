"use client";

import { useState, useRef, Suspense } from "react";

import ImageViewer from "@/components/ImageViewer";
import SearchBox from "@/components/SearchBox";
export const dynamic = "force-dynamic";
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
  const [isFetching, setIsFetching] = useState(false);

  return (
    <div className="w-96 sm:w-3/4 md:w-4/5 lg:w-4/6 xl:w-1/3 box-border m-auto px-7 py-5">
      <p className="text-neutral-100 text-base font-medium md:text-lg lg:text-center">
        Paste your review’s link and click submit to get a pretty little image
        of your review.
      </p>
      <SearchBox isFetching={isFetching} />
      <div id="review">
        <Suspense>
          <ImageViewer
            isFetching={isFetching}
            setIsFetching={setIsFetching}
          />
        </Suspense>
      </div>
    </div>
  );
}
