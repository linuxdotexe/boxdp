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
  const [isFetching, setIsFetching] = useState(false);




  return (
    <div className="flex-1 flex flex-col align-center items-center justify-center bg-gradient-to-r from-orange-950 via-green-950 to-blue-950">

      <SearchBox isFetching={isFetching} />

      <ImageViewer setIsFetching={setIsFetching} />
    </div>
  );
};
