"use client";

import Image from "next/image";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  blink: string;
}

const BASE_URL =
  "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app";

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
      const reviewerName = res.reviewerName;
      const reviewRating = res.reviewRating;
      const reviewDesc = res.reviewDesc;
      const reviewContent = res.reviewContent;
      const filmName = res.filmName;
      const filmYear = res.filmYear;
      console.log(res);
    })
    .catch((error) => {
      error.json().then((res: object) => console.error(res));
    });
}
function validURL(blinkList: string[]) {
  var obj = { valid: false, uid: "", fid: "", vid: "" };
  for (var i = 0; i < blinkList.length; i++) {
    if (blinkList[i] == "letterboxd.com") {
      if (i + 3 < blinkList.length) {
        obj.uid = blinkList[i + 1];
        obj.fid = blinkList[i + 3];
        if (i + 4 < blinkList.length && blinkList[i + 4])
          obj.vid = blinkList[i + 4];
        obj.valid = true;
      }
      break;
    }
  }
  return obj;
}

const Home = () => {
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
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // You can perform any actions with the form data here (e.g., send it to an API, store in a database)
    console.log("Form data submitted:", formData.blink);
    const detailsObj = validURL(formData.blink.split("/"));
    if (detailsObj.valid) {
      fetcher(
        BASE_URL +
          `/review?uid=${detailsObj.uid}&fid=${detailsObj.fid}&vid=${detailsObj.vid}`
      );
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24 text-2xl">
      <h1 className="text-7xl font-bold italic">
        <span className="text-orange-400">box</span>
        <span className="text-green-400">d-p</span>
        <span className="text-sky-400">ics</span>
      </h1>
      <p className="text-center text-wrap w-96">
        Drop your review's link and click "Submit" to get a prettier version of
        it, in image form.
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
            className="bg-neutral-950 p-2 rounded focus:outline-none w-96 text-center"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-br from-orange-400 via-green-400 to-sky-400 p-2 text-black font-bold text-2xl rounded">
          Submit!
        </button>
      </form>
      {/* Generated picture in a new page*/}
    </main>
  );
};

export default Home;
