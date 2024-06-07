import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingImageViewer() {
  return (
    <div className="flex flex-col justify-center w-auto">
      <h3 className="text-2xl md:text-4xl font-bold text-center mb-5">
        Please wait...
      </h3>
      <img
        src="/loading.gif"
        className="w-full rounded-xl"></img>
    </div>
  );
}
