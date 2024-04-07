import { Rating } from "react-simple-star-rating";
import { ExportComponentReturn, Params } from "react-component-export-image";
import { GetStaticProps } from "next";

let exportComponentAsPNG: ((node: RefObject<ReactInstance>, params?: Params | undefined) => ExportComponentReturn) | undefined;

import ApiData from '@/utils/ApiData';
import { RefObject, ReactInstance, useState, ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import ApiDataError from "@/utils/ApiDataError";

interface ImageViewerProps {
    queryURL: string;
    myRef: React.MutableRefObject<HTMLElement | null>;
    BASE_URL?: string;
    IMAGE_URL: string;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
}

export default function ImageViewer({ setIsFetching, queryURL, myRef, IMAGE_URL }: ImageViewerProps) {
    const [numberInputValue, setNumberInputValue] = useState('1');
    const [apiData, setApiData] = useState<ApiData | null>(null);

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
                // setIsVisible(true);
            })
            .catch((error: ApiDataError) => {
                console.error(error);
            });
    }

    useEffect(() => {
        fetcher(queryURL);
        return () => {
            console.log("cleanup");
        }
    }, [queryURL]);

    function handleNumberInputChange(event: ChangeEvent<HTMLInputElement>) {
        const newValue = event.target.validity.valid ? event.target.value.replace(/\D/, '') : numberInputValue;
        setNumberInputValue(newValue);
    }
    // TODO: Set this style in handleSubmit inside fetcher.
    const divStyle: React.CSSProperties = {
        backgroundImage: `url("${IMAGE_URL}${apiData?.images[parseInt(numberInputValue) - 1]}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
    };
    return (
        <div className="flex flex-col justify-evenly" id="review">
            <article
                ref={myRef}
                className="m-auto flex h-[1080px] flex-col justify-end w-[1440px] bg-slate-800 select-none"
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
                        {apiData?.reviewContent}
                    </p>
                </div>
            </article>
            <div className="flex flex-row justify-around">
                <div className="flex flex-col m-10 h-50">
                    <label
                        className="bg-orange-600 rounded-t text-center m-0 p-0"
                        htmlFor="numberInput"
                    >
                        Pick an Image
                    </label>
                    <input
                        className="bg-orange-500 m-0 p-0 text-black font-bold text-2xl rounded-b justify-center text-center placeholder-gray-300"
                        id="numberInput"
                        name="numberInput"
                        type="number"
                        min={1}
                        max={apiData?.images.length}
                        value={numberInputValue}
                        onChange={handleNumberInputChange}
                        placeholder={"-" + String(apiData?.images.length) + "-"}
                    />
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
        </div>
    );
};
/*
width: number;
height: number;
*/