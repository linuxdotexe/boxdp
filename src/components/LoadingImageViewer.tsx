import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingImageViewer() {
  return (
    <SkeletonTheme
      width={300}
      height={300}
      borderRadius={5}
      enableAnimation={true}
      baseColor="#45556e"
      highlightColor="#9ed9b0">
      <Skeleton
        height={300}
        count={1}
        style={{ margin: 5 }}
      />
    </SkeletonTheme>
  );
}
