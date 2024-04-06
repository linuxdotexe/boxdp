"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import ApiData from "@/utils/ApiData";
import ApiDataError from "@/utils/ApiDataError";
import React from "react";
import Link from "next/link";
import ImageViewer from "@/components/ImageViewer";

interface FormData {
  blink: string;
}

const BASE_URL =
  "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app/review?blink=";
const IMAGE_URL =
  "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app/image?blink=";
const DEFAULT_REVIEW =
  "https://letterboxd.com/raybean/film/puss-in-boots-the-last-wish/";

function fetcher(url: string, setApiData: (arg0: ApiData) => void, setIsVisible: (arg0: boolean) => void) {
  fetch(url, { method: "GET" })
    .then((response) => {
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

export default function Home() {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const myRef = useRef<HTMLElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    blink: "",
  });
  // Event handler to update form data on input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Event handler to handle form submission
  const [isVisible, setIsVisible] = useState(false);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVisible(false);
    fetcher(BASE_URL + formData.blink, (arg0) => setApiData(arg0), (arg0) => setIsVisible(arg0));
  };
  const fallBackImageUrl: string =
    "https://a.ltrbxd.com/resized/sm/upload/b0/iz/eb/dq/fight-club-1920-1920-1080-1080-crop-000000.jpg?v=1e6ef6695e";
  return (
    <div>
      {/* <div className="opacity-50 blur bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 w-full h-24 top-[-5px] z-0 absolute"></div>
      <div className="absolute bg-gradient-to-t from-black w-full top-5 h-20"></div> */}
      {/* <div className="absolute blur w-screen h-screen z-[-10]"></div> */}
      <main className="bg-gradient-to-r from-orange-950 via-green-950 to-blue-950 flex justify-center items-center min-h-screen z-10">
        <div className="bg-neutral-900 border-solid border-2 border-sky-400 w-min p-12 rounded-3xl items-center flex flex-col gap-4">
          <h1 className="text-7xl font-bold italic">
            <span className="text-orange-400">box</span>
            <span className="text-green-400">d-p</span>
            <span className="text-sky-400">ics</span>
          </h1>
          <p className="text-center text-wrap w-96 text-2xl">
            Drop your review&apos;s link and click &quot;Submit&quot; to get a
            prettier image version of it.
          </p>
          {/* Input form */}
          <form
            className="flex flex-col items-center gap-4"
            onSubmit={handleSubmit}>
            <div className="w-full rounded-md bg-gradient-to-r from-orange-400 via-green-400 to-sky-400 p-0.5">
              <input
                value={formData.blink}
                onChange={handleInputChange}
                type="text"
                name="blink"
                required
                autoFocus
                placeholder="paste link here"
                className="bg-neutral-950 p-2 rounded focus:outline-none w-80 text-center text-xl"
              />
            </div>
            <div className="flex flex-row gap-4 justify-center items-center">
              <button
                type="submit"
                className="bg-gradient-to-br from-orange-400 via-green-400 to-sky-400 p-2 text-black font-bold text-2xl rounded">
                Submit!
              </button>
              <Link
                href="#review"
                className="bg-neutral-950 p-2 border-solid border-2 border-sky-400 text-2xl rounded animate-wiggle">
                View Review!
              </Link>
            </div>
          </form>
        </div>
      </main>
      {isVisible && <ImageViewer apiData={apiData} myRef={myRef} IMAGE_URL={IMAGE_URL} />}
    </div>
  );
};
