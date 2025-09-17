"use client";

import { useState, useEffect } from "react";
import { AutocompleteProps } from "@heroui/autocomplete";

import { usePost } from "@/hooks/useApi";
import useSearch from "@/hooks/useSearch";
import { SearchRequest, SearchResponse } from "@/app/api/search/route";
import AutocompletePlace from "@/components/autocomplete-place";
import CatalogDuckTable from "@/components/table";

type TableItem = SearchResponse[number];

const Search: React.FC = () => {
  const [defaultValues, setQueryParams] = useSearch();
  const [searchValues, setSearchValues] = useState<SearchRequest>(defaultValues);
  const { trigger, isMutating, data: searchResults } = usePost<SearchResponse, SearchRequest>(`/api/search`);

  useEffect(() => {
    console.log(searchValues);
    trigger(searchValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectChange = (key: keyof SearchRequest) => (value: AutocompleteProps["selectedKey"]) => {
    setSearchValues({ ...searchValues, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQueryParams(searchValues);
    trigger(searchValues);
  };

  return (
    <>
      <form className="flex flex-col gap-2 items-center" onSubmit={handleSubmit}>
          <AutocompletePlace
            value={searchValues.place}
            onChange={handleSelectChange("place")}
          />
      </form>
      <CatalogDuckTable<TableItem>
        isLoading={isMutating}
        columns={[
          {
            headerName: "Запис",
            colId: "full_code",
            cellRenderer: (row: { value: number }) => (
              <a
                href={`https://inspector.duckarchive.com/search?q=${row.value}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {row.value}
              </a>
            ),
            valueGetter: (params) =>
              [params.data?.archive?.code, params.data?.fund, params.data?.description, params.data?.case]
                .filter(Boolean)
                .join("-"),
          },
          { headerName: "Нас.пункт", field: "place" },
        ]}
        rows={searchResults || []}
      />
    </>
  );
};

export default Search;
