import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

export default function LoadingImageViewer() {
    return (
        <div className="flex flex-col justify-evenly">
            <SkeletonTheme
                width={1440}
                height={1080}
                borderRadius={5}
                enableAnimation={true}
                baseColor="#45556e"
                highlightColor="#9ed9b0"
            >
                <Skeleton height={540} width={1440} />
                <Skeleton height={80} width={800} style={{ marginTop: 10, marginBottom: 22 }} />
                <Skeleton height={40} width={800} style={{ marginTop: 4, marginBottom: 10 }} />
                <Skeleton height={14} count={3} style={{ marginTop: 4 }} />
                <div className="flex flex-row justify-around">

                    <div className="flex flex-col m-10 h-50 max-w-max">
                        <label
                            className="bg-gray-600 rounded-t text-center m-0 p-2"
                        >
                            Pick an Image
                        </label>
                        <div className="flex bg-gray-500 p-0 text-white font-bold text-2xl rounded-b m-0 justify-between text-center h-50 shadow-2xl">
                            <button
                                className="bg-gray-300 p-2 rounded-bl w-10"
                                title="prev"
                                disabled={true}
                            >
                                {'<'}
                            </button>
                            <p className="text-center justify-center flex flex-col">
                                {'-'}
                            </p>
                            <button
                                className="bg-gray-300 p-2 rounded-br w-10"
                                title="next"
                                disabled={true}
                            >
                                {'>'}
                            </button>
                        </div>
                    </div>

                    <button
                        className="bg-gray-500 p-2 text-white font-bold text-2xl rounded max-w-max m-10 justify-center text-center h-50 shadow-2xl"
                        disabled={true}
                    >
                        Download
                    </button>
                </div>
            </SkeletonTheme>

        </div>
    );
}