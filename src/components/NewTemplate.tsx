import { TemplateProps } from "@/utils/TemplateProps";

export default function NewTemplate({
  image,
  imagePosition,
  filmName,
  filmYear,
  reviewerName,
  reviewRating,
  reviewContent,
  reviewerId,
  userImage,
  haveAvatar,
  haveTitle,
  haveBg,
  brightness,
  director,
}: TemplateProps) {
  const fullStars = Math.floor(reviewRating);
  const hasHalfStar = reviewRating % 1 !== 0;

  const stars = [
    ...Array.from({ length: fullStars }, (_, index) => (
      <img
        key={`full-${index}`}
        src="http://localhost:3000/star.svg"
        alt="full star"
        style={{ width: "35px", height: "35px", marginRight: "7px" }}
      />
    )),
    hasHalfStar && (
      <img
        key="half-star"
        src="http://localhost:3000/half_star.svg"
        alt="half star"
        style={{ width: "20px", height: "30px", top: "4px" }}
      />
    ),
  ];
  const bgProps: {
    backgroundImage?: `url(${string})`;
    backgroundColor?: "transparent";
  } = {};
  haveBg ? (bgProps.backgroundImage = `url(${image})`) : null;
  !haveBg ? (bgProps.backgroundColor = "transparent") : null;
  return (
    <div
      style={{
        height: "1080px",
        width: "1080px",
        backgroundSize: "1920px 1080px",
        // 0 to -840px. why? idk. mid point will be -420px
        backgroundPosition: "-420px 0px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        letterSpacing: "-2px",
        ...bgProps,
      }}
    >
      <footer
        style={{
          display: "flex",
          padding: "50px 50px",
          justifyContent: "space-between",
          alignItems: "center",
          background:
            "linear-gradient(to bottom, #000000BF, transparent)",
        }}
      >
        <img
          src="http://localhost:3000/logo.svg"
          alt="logo"
          style={{ width: "60px", height: "60px" }}
        />
        {haveTitle && (
          <span
            style={{
              color: `${brightness > 50 ? "#ffffff" : "#d9d9d9"}`,
              fontSize: "40px",
              fontWeight: "700",
            }}
          >
            {filmName} ({filmYear}), dir. {director}
          </span>
        )}
      </footer>
      <div
        style={{
          background:
            "linear-gradient(to top, #000000BF, #00000080, transparent)",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: `${brightness > 50 ? "#ffffff" : "#d9d9d9"}`,
            margin: "50px 50px",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "15px",
              alignContent: "center",
            }}
          >
            {haveAvatar && (
              <img
                src={userImage}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "100%",
                }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "40px",
                  fontWeight: "700",
                  color: `${brightness > 50 ? "#ffffff" : "#d9d9d9"}`,
                }}
              >
                {reviewerName} (@{reviewerId})
              </span>
              {reviewRating > 0 && <span>{stars}</span>}
            </div>
          </div>
          <span
            style={{
              fontSize: "35px",
              fontWeight: "400",
              color: `${brightness > 50 ? "#ffffff" : "#d9d9d9"}`,
            }}
          >
            {reviewContent}
          </span>
        </div>
      </div>
    </div>
  );
}
