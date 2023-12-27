"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { Rating } from "react-simple-star-rating";
import React from "react";

interface FormData {
  blink: string;
}

interface UrlItem {
  url: string;
}

interface ApiData {
  reviewerName: string;
  reviewRating: number;
  reviewDesc: string;
  reviewContent: string;
  filmName: string;
  filmYear: string;
  url: string;
  images: UrlItem[];
}

const BASE_URL =
  "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app/review?blink=";
const IMAGE_URL =
  "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app/image?blink=";

const Home = () => {
  const [apiData, setApiData] = useState<ApiData>();
  // TODO: Set this style in handleSubmit inside fetcher.
  const divStyle: React.CSSProperties = {
    backgroundImage: `url("${IMAGE_URL}${apiData?.images[0]}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  function fetcher(url: string) {
    fetch(url, { method: "GET" })
      .then((response) => {
        if (response.ok) {
          console.log(response.url);
          return response.json();
        }
        return Promise.reject(response);
      })
      .then((res) => {
        setApiData(res);
        setIsVisible(!isVisible);
        // console.log(apiData?.filmName);
      })
      .catch((error) => {
        error.json().then((res: object) => console.error(res));
      });
  }
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
    fetcher(BASE_URL + formData.blink);
  };
  const fallBackImageUrl: string =
    "https://a.ltrbxd.com/resized/sm/upload/b0/iz/eb/dq/fight-club-1920-1920-1080-1080-crop-000000.jpg?v=1e6ef6695e";
  const myRef = useRef<HTMLElement | null>(null);
  return (
    <div>
      {/* <div className="opacity-50 blur bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 w-full h-24 top-[-5px] z-0 absolute"></div>
      <div className="absolute bg-gradient-to-t from-black w-full top-5 h-20"></div> */}
      <div className="absolute blur w-screen h-screen z-[-10]"></div>
      <main className="flex flex-col justify-center items-center min-h-screen z-10">
        <div className="bg-neutral-900 border-solid border-2 border-sky-400 w-auto p-12 rounded-3xl items-center flex flex-col gap-4">
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
      {isVisible && (
        <div className="flex flex-row justify-evenly">
          <article
            ref={myRef}
            className="m-auto flex min-h-screen flex-col justify-end w-[1440px] bg-slate-800 select-none"
            style={divStyle}
            id="review">
            <div className="bg-black bg-opacity-40 w-full p-12 h-[540px]">
              <p className="text-5xl font-bold pb-3">
                {apiData?.filmName}
                <sup className="pl-3 text-3xl">{apiData?.filmYear}</sup>
              </p>
              <p className="font-semibold text-3xl pb-3">
                Review by {apiData?.reviewerName} (@{apiData?.url.split("/")[3]}
                )
              </p>
              {/* <p>{apiData?.reviewDesc}</p> */}
              {apiData?.reviewRating !== 0 && (
                <Rating
                  initialValue={apiData?.reviewRating}
                  size={35}
                  readonly={true}
                  allowFraction={true}
                  allowHover={false}
                  emptyColor="#00000000"
                  className=""
                />
              )}
              <p className="font-semibold text-3xl w-[810px] pt-3">
                {apiData?.reviewDesc}
              </p>
            </div>
          </article>
          <button
            // onClick={(e) => {
            //   e.preventDefault();
            //   exportComponentAsPNG(myRef, {
            //     html2CanvasOptions: { backgroundColor: null },
            //   });
            // }}
            onClick={async () => {
              const { exportComponentAsPNG } = await import(
                "react-component-export-image"
              );
              exportComponentAsPNG(myRef);
            }}
            className="bg-sky-500 p-2 text-black font-bold text-2xl rounded m-auto justify-center items-center">
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
