"use client";

import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import qs from "qs";

const parseQ = (q: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, place, year, __, title] = q.match(/([а-яєіїґ\-.\s]{0,})\s{0,}((16|17|18|19|20)\d{2})?\s?(.+)?/i) || [];

  if (!year && !__ && !title) {
    return { title: place?.trim() };
  }

  return {
    place: place?.trim(),
    year: Number(year),
    title: title?.trim(),
  };
};

const SearchInput: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { place, year, title } = parseQ(search);
    const query = qs.stringify({ place, year, title }, { skipNulls: true });

    router.push(`/search?${query}`);
    setSearch("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    setSearch(raw);
  };

  return (
    <form className="flex flex-wrap" onSubmit={handleSearch}>
      <Input
        aria-label="Пошуковий запит"
        classNames={{
          inputWrapper: "py-4 h-auto",
          input: "text-xl md:text-4xl font-bold border-0 outline-0 w-full placeholder:text-gray-500/50 bg-transparent",
        }}
        isClearable={false}
        labelPlacement="outside"
        name="search-case"
        placeholder="Полонне 1825"
        size="md"
        type="search"
        value={search}
        onChange={handleChange}
      />
    </form>
  );
};

export default SearchInput;
