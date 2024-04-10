import ApiData from "@/utils/ApiData";
import { Rating } from "react-simple-star-rating";

interface DefaultReviewStyleProps {
    myRef: React.MutableRefObject<HTMLElement | null>;
    divStyle: React.CSSProperties;
    apiData: ApiData
}

export default function DefaultReviewStyle({myRef, divStyle, apiData}: DefaultReviewStyleProps) {
    return (
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
    );
}