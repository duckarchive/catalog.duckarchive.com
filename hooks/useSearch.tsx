"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";

import { SearchRequest } from "@/app/api/search/route";

const useSearch = (): [SearchRequest, (val: SearchRequest) => void] => {
  const searchPrams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = (search: SearchRequest) => {
    const q = qs.stringify(search, { skipNulls: true });
    router.replace(`${pathname}?${q}`);
  };

  const parsed = qs.parse(searchPrams.toString());
  const params = {
    ...parsed,
    year: parsed.year ? Number(parsed.year) : undefined,
  };

  return [params, setSearchParams];
};

export default useSearch;
