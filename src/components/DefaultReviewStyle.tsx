import ApiData from "@/utils/ApiData";
import { useEffect, useRef } from "react";

interface ReviewStyleProps {
  myRef: React.MutableRefObject<HTMLCanvasElement | null>;
  curImgNum: number;
  apiData: ApiData;
}

// ? back in the old days, we needed this.
// const IMAGE_URL =
//   "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app/image?blink=";

export default function DefaultReviewStyle({
  myRef,
  curImgNum,
  apiData,
}: ReviewStyleProps) {
  //   const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = myRef;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Variables and constants
    const footerH = 50;
    const titleFontSize = 40;
    const titleFontWeight = 600;
    const title = `${apiData?.filmName} (${apiData?.filmYear}), dir. ${apiData.directors[0]}`;
    let titleH: number;
    let titlePosition: number;
    let byPosition: number;
    let starsPosition: number;
    let contentPosition: number;
    const containerPadding = 75;
    const byFontSize = 25;
    const by = `Review by ${apiData?.reviewerName} (@${apiData?.reviewerId})`;
    const byH = 40;
    const contentFontSize = 35;
    const contentFontWeight = 375;
    let contentH: number;
    let containerH: number;
    let starsHeight = 50;
    const gaps = 10 * 4;
    const gapBetweenFooterAndContent = 60;
    let containerHeightStart: number;
    let content = `${apiData?.reviewContent}`;
    if (content === undefined || content === "undefined") {
      content = "";
    } else if (content.split(" ").length > 50) {
      if (content.includes("\n")) {
        content = content.split(" ").splice(0, 50).join(" ") + " [...]";
      } else {
        content = content.split(" ").splice(0, 70).join(" ") + " [...]";
      }
    }

    // Functions
    const wrapText = (
      context: CanvasRenderingContext2D,
      text: string,
      textType: string,
      x: number,
      y: number,
      lineWidth: number,
      lineHeight: number,
      fontWeight: number,
      dotsFill: string
    ): void => {
      let line = "";
      let totalHeight = 0;
      context.font = `${fontWeight} ${contentFontSize}px Karla`;
      const paragraphs = text.split("\n");
      for (let i = 0; i < paragraphs.length; i++) {
        const words = paragraphs[i].split(" ");
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > lineWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
            totalHeight += lineHeight;
          } else {
            line = testLine;
          }
        }
        if (line.trim() !== "") {
          if (line.includes("[...]")) {
            line = line.slice(0, line.length - 6);
            context.fillText(line, x, y);
            let lineMetric = context.measureText(line);
            let lineW = lineMetric.width;
            x += lineW;
            context.fillStyle = dotsFill;
            context.fillText("[...]", x, y);
            y += lineHeight;
            totalHeight += lineHeight;
          } else {
            context.fillText(line, x, y);
            y += lineHeight;
            totalHeight += lineHeight;
          }
        }
        if (textType === "title") {
          titleH = totalHeight;
        } else {
          contentH = totalHeight;
        }
        line = "";
      }
    };

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
      const x = canvas.width / 2 - newWidth / 2;
      const y = canvas.height / 2 - newHeight / 2;
      ctx.drawImage(img, x, y, newWidth, newHeight);
    };

    const contentContainer = (ctx: CanvasRenderingContext2D): void => {
      (ctx as any).roundRect = function (
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
      ): void {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, 0);
        this.arcTo(x, y + height, x, y, 0);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
      };

      containerH =
        titleH +
        byH +
        contentH +
        starsHeight +
        gaps +
        footerH +
        gapBetweenFooterAndContent;

      containerHeightStart = Math.max(1080 - containerH, 530);

      ctx.fillStyle = "#11101180";
      (ctx as any).roundRect(
        0,
        containerHeightStart,
        canvas.width,
        1080 - containerHeightStart,
        100
      );
      ctx.fill();
    };

    const fillTitle = (
      ctx: CanvasRenderingContext2D,
      titleText: string,
      isTransparent: boolean
    ): void => {
      ctx.font = `600 ${titleFontSize}px Karla`;
      ctx.fillStyle = isTransparent ? "#D9D9D900" : "#D9D9D9";
      let dots = isTransparent ? "#d9d9d900" : "#000000";
      titlePosition = containerHeightStart + containerPadding;
      // ctx.fillText(titleText, 50, titlePosition);
      wrapText(
        ctx,
        titleText,
        "title",
        50,
        titlePosition,
        980,
        titleFontSize + 5,
        titleFontWeight,
        dots
      );
    };

    const fillBy = (
      ctx: CanvasRenderingContext2D,
      byText: string,
      isTransparent: boolean
    ): void => {
      ctx.font = `300 ${byFontSize}px Karla`;
      ctx.fillStyle = isTransparent ? "#D9D9D900" : "#D9D9D9";
      byPosition = titlePosition + titleH;
      ctx.fillText(byText, 50, byPosition);
    };

    const fillContent = (
      ctx: CanvasRenderingContext2D,
      content: string,
      isTransparent: boolean
    ): void => {
      ctx.font = `475 ${contentFontSize}px Karla`;
      ctx.fillStyle = isTransparent ? "#D9D9D900" : "#D9D9D9";
      let dots = isTransparent ? "#d9d9d900" : "#a3a3a3";
      contentPosition = isTransparent ? 0 : starsPosition + 85;
      wrapText(
        ctx,
        content,
        "content",
        50,
        contentPosition,
        980,
        contentFontSize + 5,
        contentFontWeight,
        dots
      );
    };

    const fillFooter = (ctx: CanvasRenderingContext2D): void => {
      const tmdb = new Image();
      tmdb.crossOrigin = "anonymous";
      tmdb.onload = function () {
        ctx.drawImage(tmdb, 50, canvas.height - footerH);
      };
      tmdb.src = "/tmdb.svg";

      const box = new Image();
      box.crossOrigin = "anonymous";
      box.onload = function () {
        ctx.drawImage(box, canvas.width - 258.54, canvas.height - footerH);
      };
      box.src = "/letterboxd.svg";

      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.onload = function () {
        ctx.drawImage(logo, canvas.width / 2 - 30, canvas.height - 75);
      };
      logo.src = "/logo.svg";
    };

    const makeStars = (
      ctx: CanvasRenderingContext2D,
      count: number,
      isPartial: boolean
    ): void => {
      let initX = 50;
      if (count === 0) {
        starsHeight = 0;
        starsPosition = 0;
      }
      isPartial = count % 1 !== 0;
      starsPosition = byPosition + starsHeight / 2;
      for (let i = 0; i < count && count >= 1; i++) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function () {
          ctx.drawImage(img, initX, starsPosition);
          initX += 53;
        };
        img.src = "/star.svg";
      }
      if (isPartial) {
        const img = new Image();
        img.onload = function () {
          ctx.drawImage(img, initX, starsPosition + 5.5);
          initX += 40;
        };
        img.src = "/half_star.svg";
      }
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      fillBg(ctx, img);
      fillContent(ctx, content, true);
      fillTitle(ctx, title, true);
      contentContainer(ctx);
      fillTitle(ctx, title, false);
      fillBy(ctx, by, false);
      makeStars(ctx, apiData?.reviewRating, true);
      fillContent(ctx, content, false);
      fillFooter(ctx);
    };
    // img.src = `${IMAGE_URL}${apiData?.images[curImgNum - 1]}`;
    img.src = `${apiData?.images[curImgNum - 1]}`;
  }, [apiData, curImgNum]);

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
