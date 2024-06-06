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
      <>
        <img
          src="/preview.png"
          className="rounded-xl"></img>
      </>
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
      <DefaultReviewStyle
        apiData={apiData}
        myRef={myRef}
        curImgNum={curImgNum}
      />
      <button
        className="bg-blue-400 px-4 text-neutral-900 font-bold text-base rounded-full mt-5 w-fit py-3 self-center"
        onClick={async () => {
          if (!myRef.current) return;
          const link = document.createElement("a");
          link.download = `${apiData.filmName}-${apiData.reviewerId}.png`;
          link.href = myRef.current.toDataURL("image/png") as string; // Type assertion
          link.click();
        }}>
        Download!
      </button>
      <div className="mt-5">
        <p
          className="text-xl text-center"
          title={String(apiData?.images.length)}>
          Image Selector
        </p>
        <div className="flex flex-row gap-6 justify-center mt-2">
          <button
            className="px-6 rounded-full bg-blue-400 aspect-square text-neutral-900 font-black text-2xl disabled:bg-neutral-600 disabled:text-neutral-100"
            title="prev"
            disabled={curImgNum === 1}
            onClick={handleImgNumDecr}>
            {"<"}
          </button>
          <p className="text-center self-center border-2 px-3 py-3 border-blue-400 rounded-xl text-xl font-bold">
            {curImgNum} / {apiData.images.length}
          </p>
          <button
            className="px-6 rounded-full bg-blue-400 aspect-square text-neutral-900 font-black text-2xl disabled:bg-neutral-600 disabled:text-neutral-100"
            title="next"
            disabled={curImgNum === apiData.images.length}
            onClick={handleImgNumIncr}>
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
