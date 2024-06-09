import ApiData from "@/utils/ApiData";
import FormData from "@/utils/FormData";

import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";

interface SearchBoxProps {
  // fetcher: (url: string) => void,
  apiData?: ApiData | null;
  setApiData?: Dispatch<SetStateAction<ApiData | null>>;
  setIsVisible?: Dispatch<SetStateAction<boolean>>;
  isFetching: boolean;
  BASE_URL?: string;
  IMAGE_URL?: string;
  myRef?: React.MutableRefObject<HTMLElement | null>;
  setQueryURL?: Dispatch<SetStateAction<string>>;
}

export default function SearchBox({ isFetching }: SearchBoxProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    blink: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = formData.blink.trim();
    const hasSpaces = /\s/g.test(url);
    if (hasSpaces) {
      console.log("has spaces");
      // reject
      return;
    }
    router.push(`/?url=${url}&img=1#review`, { scroll: true });
    setSubmitted(true);

    // console.log(BASE_URL + url);
    // setQueryURL(BASE_URL + url);
    // fetcher(BASE_URL + formData.blink);
  };

  const handleClear = () => {
    setFormData({ blink: "" });
    setSubmitted(false);
  };

  // Event handler to update form data on input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (value.trim() === "") {
      setSubmitted(false);
    }
  };

  return (
    <form
      className="flex w-full font-medium m-auto items-center"
      onSubmit={handleSubmit}>
      <input
        className="w-full rounded-full rounded-r-none my-5 py-3 pl-5 
        bg-neutral-900 active:bg-neutral-900 placeholder:text-neutral-400 
        text-neutral-100 text-base md:text-lg focus:outline-none h-fit"
        value={formData.blink}
        onChange={handleInputChange}
        type="text"
        name="blink"
        required
        // autoFocus
        placeholder="Paste your link here."
      />
      <button
        className="bg-neutral-900 text-neutral-400 font-medium pr-10 pl-5 py-3 md:py-3.5 text-xl md:text-2xl"
        type="button"
        onClick={handleClear}
        disabled={isFetching}>
        <img
          src="/xmark-solid.svg"
          alt="clear"
          className="h-6 w-6"
        />
      </button>
      <button
        className="bg-blue-400 text-neutral-900 font-bold px-5
        py-3 rounded-full text-base md:text-lg  right-3 md:right-5
        relative disabled:bg-neutral-600 disabled:text-neutral-100"
        type="submit"
        disabled={isFetching}>
        Submit!
      </button>
      {/* ! remove after verifying working of the new clear button */}
      {/* {submitted ? (
        <button
          className="bg-red-400 text-neutral-900 font-bold px-5 h-[49.5px]
          py-3 rounded-full text-base md:text-lg md:top-[21px] top-[19px] right-3 md:right-5 relative"
          type="button"
          onClick={handleClear}>
          Clear
        </button>
      ) : (
        <button
          className="bg-blue-400 text-neutral-900 font-bold px-5 h-[49.5px]
          py-3 rounded-full text-base md:text-lg md:top-[21px] top-[19px] right-3 md:right-5 relative disabled:bg-neutral-600 disabled:text-neutral-100"
          type="submit"
          disabled={isFetching}>
          Submit!
        </button>
      )} */}
    </form>
  );
}
