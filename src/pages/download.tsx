import Image from "next/image";

const BASE_URL =
  "https://letterboxd-review-api-abhishekyelleys-projects.vercel.app";

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

export default function Download() {
  // const detailsObj = validURL(formData.blink.split("/"));
  // console.log(BASE_URL);

  // if (detailsObj.valid) {
  //   fetcher(
  //     BASE_URL +
  //       `/review?uid=${detailsObj.uid}&fid=${detailsObj.fid}&vid=${detailsObj.vid}`
  //   );
  // }
  return <p></p>;
}
