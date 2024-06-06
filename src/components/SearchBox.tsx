import ApiData from "@/utils/ApiData";
import FormData from "@/utils/FormData";

import Link from "next/link";
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
    <form className="flex w-full font-medium" onSubmit={handleSubmit}>
      <input
        className="w-full rounded-full rounded-r-none my-5 py-3 pl-5 
        bg-neutral-900 active:bg-neutral-900 placeholder:text-neutral-400 
        text-neutral-100 text-base focus:outline-none h-fit"
        value={formData.blink}
        onChange={handleInputChange}
        type="text"
        name="blink"
        required
        // autoFocus
        placeholder="Paste your link here."
      />
      <button
        className="bg-blue-400 text-neutral-900 font-bold px-5 h-[49.5px]
        py-3 rounded-full text-base top-[19px] right-3 relative"
        type="submit"
        disabled={isFetching}>
        Submit!
      </button>
    </form>
  );
}
