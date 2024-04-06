import { Rating } from "react-simple-star-rating";
import { ExportComponentReturn, Params } from "react-component-export-image";

let exportComponentAsPNG: ((node: RefObject<ReactInstance>, params?: Params | undefined) => ExportComponentReturn) | undefined;

import ApiData from '@/utils/ApiData';
import { RefObject, ReactInstance } from "react";

interface ImageViewerProps {
    apiData: ApiData | null;
    myRef: React.MutableRefObject<HTMLElement | null>;
    BASE_URL?: string;
    IMAGE_URL: string;
}
export default function ImageViewer({ apiData, myRef, IMAGE_URL }: ImageViewerProps) {
    if (apiData === null)
        return (<p>lamao</p>);

    // TODO: Set this style in handleSubmit inside fetcher.
    const divStyle: React.CSSProperties = {
        backgroundImage: `url("${IMAGE_URL}${apiData?.images[0]}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
    };
    return (
        <div className="flex flex-row justify-evenly" id="review">
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
                        {apiData?.reviewDesc}
                    </p>
                </div>
            </article>
            <button
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
                className="bg-sky-500 p-2 text-black font-bold text-2xl rounded m-auto justify-center items-center">
                Download
            </button>
        </div>
    );
};
/*
width: number;
height: number;
*/