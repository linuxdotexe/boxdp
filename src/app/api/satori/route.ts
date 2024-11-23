import NewTemplate from "@/components/NewTemplate";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import satori from "satori";
import fs from "node:fs/promises";
import sharp from "sharp";
import axios from "axios";
import { TemplateProps } from "@/utils/TemplateProps";

// Function to get image brightness
async function getImageBrightness(imageUrl: string): Promise<number> {
  try {
    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
    });

    const image = sharp(response.data).greyscale();
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    let totalBrightness = 0;
    for (let i = 0; i < data.length; i++) {
      totalBrightness += data[i];
    }

    const avgBrightness =
      totalBrightness / (info.width * info.height);
    const brightness = Math.round((avgBrightness / 255) * 100);
    return brightness;
  } catch (error) {
    console.error("Error processing image:", error);
    return -1;
  }
}

async function getPngBuffer(searchParams: URLSearchParams) {
  const brightness = await getImageBrightness(
    searchParams.get("image") as string
  );
  const props: TemplateProps = {
    image: searchParams.get("image") as string,
    imagePosition: searchParams.get("imagePosition") as string,
    filmName: searchParams.get("filmName") as string,
    filmYear: searchParams.get("filmYear") as string,
    reviewerName: searchParams.get("reviewerName") as string,
    reviewerId: searchParams.get("reviewerId") as string,
    reviewContent: searchParams.get("reviewContent") as string,
    reviewRating: Number(searchParams.get("reviewRating")) as number,
    userImage: searchParams.get("userImage") as string,
    haveAvatar:
      searchParams.get("haveAvatar") === "true" ? true : false,
    haveTitle:
      searchParams.get("haveTitle") === "true" ? true : false,
    haveBg: searchParams.get("haveBg") === "true" ? true : false,
    brightness: brightness as number,
    director: searchParams.get("director") as string,
  };
  const fontRegular = await fs.readFile(
    "./public/fonts/Karla-Regular.ttf"
  );
  const fontMedium = await fs.readFile(
    "./public/fonts/Karla-Medium.ttf"
  );
  const fontBold = await fs.readFile("./public/fonts/Karla-Bold.ttf");
  const svg = await satori(React.createElement(NewTemplate, props), {
    width: 1080,
    height: 1080,
    fonts: [
      {
        name: "Karla",
        data: fontRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Karla",
        data: fontMedium,
        weight: 500,
        style: "normal",
      },
      {
        name: "Karla",
        data: fontBold,
        weight: 700,
        style: "normal",
      },
    ],
  });

  return await sharp(Buffer.from(svg)).png().toBuffer();
}

export async function GET(request: NextRequest) {
  try {
    const pngBuffer = await getPngBuffer(
      request.nextUrl.searchParams
    );
    return new NextResponse(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (err) {
    return NextResponse.json({
      error: true,
      message: (err as { message?: string }).message ?? undefined,
    });
  }
}
