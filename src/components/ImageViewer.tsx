import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import ApiData from "@/utils/ApiData";
import {
  RefObject,
  ReactInstance,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import ApiDataError from "@/utils/ApiDataError";
import LoadingImageViewer from "./LoadingImageViewer";
import ErrorImageViewer from "./ErrorImageViewer";
import DefaultReviewStyle from "./DefaultReviewStyle";

interface ImageViewerProps {
  queryURL?: string | null;
  myRef?: React.MutableRefObject<HTMLCanvasElement | null>;
  BASE_URL?: string;
  IMAGE_URL?: string;
  isFetching?: boolean;
  setIsFetching: Dispatch<SetStateAction<boolean>>;
}

const BASE_URL = "/api/review?url=";

// -------- FUNCTION ---------
export default function ImageViewer({
  isFetching,
  setIsFetching,
}: ImageViewerProps) {
  const [apiData, setApiData] = useState<ApiData | ApiDataError | null>(null);
  const myRef = useRef<HTMLCanvasElement | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryURL = searchParams.get("url");

  const [sliderValue, setSliderValue] = useState<number>(0);
  const [accordionToggle, setAccordionToggle] = useState<boolean>(false);
  console.log(accordionToggle);

  function fetcher(url: string) {
    return new Promise<ApiData | ApiDataError>((resolve, reject) => {
      setIsFetching(true);
      fetch(url, { method: "GET" })
        .then((response) => {
          return response.json();
        })
        .then((res: ApiData | ApiDataError) => {
          if ("error" in res) {
            throw res;
          }
          setIsFetching(false);
          resolve(res as ApiData);
        })
        .catch((error: ApiDataError) => {
          console.error(error);
          setIsFetching(false);
          reject(error as ApiDataError);
        });
    });
  }

  useEffect(() => {
    if (queryURL === null) {
      return () => {
        console.log("none happened");
      };
    }
    setApiData(null);
    fetcher(BASE_URL + queryURL)
      .then((res) => {
        setApiData(res);
        console.log("fetch success");
      })
      .catch((err) => {
        setApiData(err);
        console.error("fetchfail:", err);
      });

    return () => {
      console.log("cleanup");
    };
  }, [queryURL]);

  if (isFetching) {
    return <LoadingImageViewer />;
  }
  if (apiData === null) {
    return (
      <div className="flex flex-col justify-center w-auto">
        <h3 className="text-2xl md:text-4xl font-bold text-center mb-5">
          Hello!
        </h3>
        <img
          src="/preview.png"
          className="rounded-xl"></img>
      </div>
    );
  }
  if ("error" in apiData) {
    return <ErrorImageViewer />;
  }

  const parsedImgNum = parseInt(searchParams.get("img") as string);
  let curImgNum = !Number.isNaN(parsedImgNum)
    ? apiData?.images.length
      ? Math.max(1, Math.min(parsedImgNum, apiData.images.length))
      : 1
    : 1; // please make this nicer

  // if (!searchParams.get('url'))
  //     return (<h1>Boo Hoo!</h1>);

  const handleImgNumDecr = () => {
    router.push(`/?url=${queryURL}&img=${Math.max(curImgNum - 1, 1)}`, {
      scroll: false,
    });
  };
  const handleImgNumIncr = () => {
    router.push(
      `/?url=${queryURL}&img=${Math.min(
        curImgNum + 1,
        apiData?.images.length || 1
      )}`,
      { scroll: false }
    );
  };

  // --------- LOADING UI -----------

  // TODO: Set this style in handleSubmit inside fetcher
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl md:text-4xl font-bold text-center mb-5">
        Result
      </h3>
      <DefaultReviewStyle
        apiData={apiData}
        myRef={myRef}
        curImgNum={curImgNum}
        sliderValue={sliderValue}
      />
      <div className="mt-5">
        <p
          className="text-lg text-center md:text-2xl font-medium text-neutral-200"
          title={String(apiData?.images.length)}>
          Pick an Image
        </p>
        <div className="flex flex-row gap-6 justify-center items-center mt-2">
          <button
            className="px-8 py-2 rounded-full bg-blue-400
            disabled:bg-neutral-600 "
            title="prev"
            disabled={curImgNum === 1}
            onClick={handleImgNumDecr}>
            <img
              src="/chevron-right-solid.svg"
              className="w-4 rotate-180"></img>
          </button>
          <p className="text-center self-center border-2 px-3 py-3 border-blue-400 text-neutral-300 rounded-xl text-xl font-bold md:text-2xl">
            {curImgNum} / {apiData.images.length}
          </p>
          <button
            className="px-8 py-2 rounded-full bg-blue-400 disabled:bg-neutral-600 "
            title="next"
            disabled={curImgNum === apiData.images.length}
            onClick={handleImgNumIncr}>
            <img
              src="/chevron-right-solid.svg"
              className="w-4"></img>
          </button>
        </div>
      </div>
      <button
        className="bg-blue-400 px-4 text-neutral-900 font-bold text-base rounded-full mt-5 w-fit py-3 self-center md:text-xl"
        onClick={async () => {
          if (!myRef.current) return;
          const link = document.createElement("a");
          link.download = `${apiData.filmName}-${apiData.reviewerId}.png`;
          link.href = myRef.current.toDataURL("image/png") as string; // Type assertion
          link.click();
        }}>
        Download!
      </button>
      <button
        className={`bg-neutral-900 w-full text-left py-4 px-6 mt-5
        cursor-pointer ${accordionToggle ? "rounded-3xl" : "rounded-full"}`}
        onClick={(e) => setAccordionToggle(!accordionToggle)}>
        <div className="flex justify-between items-center">
          <p className="text-base font-medium md:text-lg text-neutral-200">
            More options (Pick an Image, Change Image Position)
          </p>
          <img
            src="/chevron-light.svg"
            className={`w-4 md:w-5 transform origin-center transition duration-300 ease-out
                ${accordionToggle && "rotate-180"}
                `}
          />
        </div>
        <div
          className={`h-fit justify-between items-center mt-5 gap-5 flex-col sm:flex-row
          ${accordionToggle ? "flex" : "hidden"}
          }`}>
          <p className="grow-0 shrink-0 text-neutral-200 text-base md:text-lg">
            Change Image Position
          </p>
          <input
            type="range"
            min={-1}
            max={1}
            value={sliderValue}
            onChange={(e) => setSliderValue(parseFloat(e.target.value))}
            step={0.01}
            className="grow shrink w-full accent-blue-400"
          />
        </div>
      </button>
    </div>
  );
}
