import { Rating } from "react-simple-star-rating";
import { ExportComponentReturn, Params } from "react-component-export-image";
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";

let exportComponentAsPNG: ((node: RefObject<ReactInstance>, params?: Params | undefined) => ExportComponentReturn) | undefined;

import ApiData from '@/utils/ApiData';
import { RefObject, ReactInstance, useState, Dispatch, SetStateAction, useEffect, useRef } from "react";
import ApiDataError from "@/utils/ApiDataError";
import LoadingImageViewer from "./LoadingImageViewer";
import ErrorImageViewer from "./ErrorImageViewer";
import DefaultReviewStyle from "./DefaultReviewStyle";

interface ImageViewerProps {
    queryURL?: string | null;
    myRef?: React.MutableRefObject<HTMLElement | null>;
    BASE_URL?: string;
    IMAGE_URL?: string;
    isFetching?: boolean;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
}

const BASE_URL =
    "/api/review?url=";
const IMAGE_URL =
    "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app/image?blink=";

// -------- FUNCTION ---------
export default function ImageViewer({ isFetching, setIsFetching }: ImageViewerProps) {
    const [apiData, setApiData] = useState<ApiData | ApiDataError | null>(null);
    const myRef = useRef<HTMLElement | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const queryURL = searchParams.get('url');

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
            }
        }
        setApiData(null);
        fetcher(BASE_URL + queryURL)
            .then(res => {
                setApiData(res);
                console.log('fetch success')
            })
            .catch(err => {
                setApiData(err)
                console.error('fetchfail:', err)
            });

        return () => {
            console.log("cleanup");
        }
    }, [queryURL]);

    if (isFetching) {
        return (<LoadingImageViewer />);
    }
    if(apiData === null) {
        return (<></>)
    }
    if ("error" in apiData) {
        return (<ErrorImageViewer />);
    }
    
    const parsedImgNum = parseInt(searchParams.get('img') as string);
    let curImgNum = !Number.isNaN(parsedImgNum) ? (apiData?.images.length ? Math.max(1, Math.min(parsedImgNum, apiData.images.length)) : 1) : 1;   // please make this nicer



    // if (!searchParams.get('url'))
    //     return (<h1>Boo Hoo!</h1>);

    const handleImgNumDecr = () => {
        router.push(`/?url=${queryURL}&img=${Math.max(curImgNum - 1, 1)}`, { scroll: false });
    }
    const handleImgNumIncr = () => {
        router.push(`/?url=${queryURL}&img=${Math.min(curImgNum + 1, apiData?.images.length || 1)}`, { scroll: false });
    }

    // --------- LOADING UI -----------
    
    // TODO: Set this style in handleSubmit inside fetcher.
    return (
        <>
            <DefaultReviewStyle 
                apiData={apiData}
                myRef={myRef}
                curImgNum={curImgNum}
            />
            <div className="flex flex-row justify-around">

                <div className="flex flex-col m-10 h-50 max-w-max">
                    <p
                        className="bg-orange-600 rounded-t text-center m-0 p-2"
                        title={String(apiData?.images.length)}
                    >
                        Pick an Image
                    </p>
                    <div className="flex bg-orange-500 p-0 text-black font-bold text-2xl rounded-b m-0 justify-between text-center h-50 shadow-2xl">
                        <button
                            className="bg-orange-300 p-2 rounded-bl w-10"
                            title="prev"
                            onClick={handleImgNumDecr}
                        >
                            {'<'}
                        </button>
                        <p className="text-center justify-center flex flex-col">
                            {curImgNum}
                        </p>
                        <button
                            className="bg-orange-300 p-2 rounded-br w-10"
                            title="next"
                            onClick={handleImgNumIncr}
                        >
                            {'>'}
                        </button>
                    </div>
                </div>

                <button
                    className="bg-sky-500 p-2 text-black font-bold text-2xl rounded max-w-max m-10 justify-center text-center h-50 shadow-2xl"
                    onClick={async () => {
                        if (!exportComponentAsPNG) {
                            exportComponentAsPNG = (await import("react-component-export-image")).exportComponentAsPNG;
                        }
                        /*
                        exportComponentAsPNG(myRef, {
                            html2CanvasOptions: {
                                width: 1440,
                                height: 1080,
                            }
                        });
                        */
                        exportComponentAsPNG(myRef);
                    }}
                >
                    Download
                </button>
            </div>
        </>
    );
};
/*
width: number;
height: number;
*/
/*
<article
ref={myRef}
className="m-auto flex 2xl:h-[1080px] 2xl:w-[1440px] h-[720px] w-[960px] flex-col justify-end bg-slate-800 select-none"
style={divStyle}>
<div className="bg-black bg-opacity-50 w-full p-12 h-1/2">
    <p className="text-5xl font-bold pb-3">
        {apiData?.filmName}
        <sup className="pl-3 text-3xl">{apiData?.filmYear}</sup>
    </p>
    <p className="font-semibold text-3xl pb-3">
        Review by {apiData?.reviewerName} (@{apiData?.url.split("/")[3]}
        )
    </p>
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
        {apiData?.reviewContent}
    </p>
</div>
</article>
*/