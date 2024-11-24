import ApiData from "@/utils/ApiData";
import { SatoriParams } from "@/utils/TemplateProps";
import { useEffect } from "react";

interface ReviewStyleProps {
  myRef: React.MutableRefObject<HTMLCanvasElement | null>;
  curImgNum: number;
  apiData: ApiData;
  sliderValue: number;
}

export default function DefaultReviewStyle({
  myRef,
  curImgNum,
  apiData,
  sliderValue,
}: ReviewStyleProps) {
  const canvasRef = myRef;
  const params: SatoriParams = {
    director: apiData.directors.join(", "),
    filmName: apiData.filmName,
    filmYear: apiData.filmYear,
    image: apiData.images[curImgNum],
    reviewerId: apiData.reviewerId,
    reviewerName: apiData.reviewerName,
    reviewRating: apiData.reviewRating,
    reviewContent: apiData.reviewContent,
    haveAvatar: false,
    haveBg: false,
    haveTitle: true,
  };
  const searchParams = new URLSearchParams(
    Object.keys(params).map((item) => [
      item,
      String(params[item as keyof SatoriParams]),
    ])
  );

  const topGurl = "/api/satori?" + searchParams.toString();

  useEffect(() => {
    const drawCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Functions
      const fillBg = (
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement
      ): void => {
        const scaleFactor = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const newWidth = img.width * scaleFactor;
        const newHeight = img.height * scaleFactor;
        // const x = canvas.width / 2 - newWidth / 2;
        const maxOffset = Math.max(0, newWidth - canvas.width) / 2;

        const x = canvas.width / 2 - newWidth / 2 + sliderValue * maxOffset;
        const y = canvas.height / 2 - newHeight / 2;
        // ctx.drawImage(img, -sliderValue * 720, y, newWidth, newHeight);
        ctx.drawImage(img, x, y, newWidth, newHeight);
      };

      const fillContent = (ctx: CanvasRenderingContext2D): void => {
        const content = new Image();
        content.crossOrigin = "anonymous";
        content.onload = function () {
          ctx.drawImage(content, 0, 0);
        };
        content.src = topGurl;
      };

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        fillBg(ctx, img);
        fillContent(ctx);
      };
      img.src = `${apiData?.images[curImgNum - 1]}`;
    };

    drawCanvas();
  }, [curImgNum, apiData, canvasRef, sliderValue]);
  return (
    <div className="w-full aspect-square m-auto rounded-xl overflow-hidden">
      <canvas
        id="canvas"
        ref={canvasRef}
        width={1080}
        height={1080}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
