import ApiData from "@/utils/ApiData";
import FormData from "@/utils/FormData";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";

interface SearchBoxProps {
	// fetcher: (url: string) => void,
	apiData?: ApiData | null,
	setApiData?: Dispatch<SetStateAction<ApiData | null>>,
	setIsVisible?: Dispatch<SetStateAction<boolean>>,
	isFetching: boolean,
	BASE_URL?:	string,
	IMAGE_URL?: string,
	myRef?: React.MutableRefObject<HTMLElement | null>,
	setQueryURL?: Dispatch<SetStateAction<string>>,
}


export default function SearchBox({ isFetching }: SearchBoxProps) {
	const router = useRouter();

	const [formData, setFormData] = useState<FormData>({
		blink: "",
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const url = formData.blink.trim();
		const hasSpaces = /\s/g.test(url);
		if(hasSpaces){
			console.log("has spaces");
			// reject
			return;

		}
		router.push(`/?url=${url}&img=1#review`);
		// console.log(BASE_URL + url);
		// setQueryURL(BASE_URL + url);
		// fetcher(BASE_URL + formData.blink);
	};

	// Event handler to update form data on input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

	return (
		<div className="flex justify-center items-center min-h-screen z-10">
			<main>
				<div className="bg-neutral-900 border-solid border-2 border-sky-400 sm:w-min p-12 rounded-3xl items-center flex flex-col gap-4 w-80">
					<h1 className="text-7xl font-bold italic">
						<span className="text-orange-400">box</span>
						<span className="text-green-400">d-p</span>
						<span className="text-sky-400">ics</span>
					</h1>
					<p className="text-center text-wrap sm:w-96 w-72 text-2xl">
						Drop your review&apos;s link and click &quot;Submit&quot; to get a
						prettier image version of it.
					</p>
					{/* Input form */}
					<form
						className="flex flex-col items-center gap-4 sm:w-min w-72"
						onSubmit={handleSubmit}>
						<div className="w-full rounded-md bg-gradient-to-r from-orange-400 via-green-400 to-sky-400 p-0.5">
							<input
								className="bg-neutral-950 p-2 rounded focus:outline-none sm:w-80 w-72 text-center text-xl"
								value={formData.blink}
								onChange={handleInputChange}
								type="text"
								name="blink"
								required
								autoFocus
								placeholder="paste link here"
							/>
						</div>
						<div className="flex flex-row gap-4 justify-center items-center">
							<button
								className="disabled:bg-none disabled:bg-slate-500 disabled:cursor-wait bg-gradient-to-br from-orange-400 via-green-400 to-sky-400 p-2 text-black font-bold text-2xl rounded"
								type="submit"
								disabled={isFetching}
							>
								Submit!
							</button>
							<Link
								href="#review"
								className="bg-neutral-950 p-2 border-solid border-2 border-sky-400 text-2xl rounded animate-wiggle">
								View Review!
							</Link>
						</div>
					</form>
				</div>
			</main>
		</div>
	)
}