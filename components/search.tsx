"use client";

import { useState, useEffect } from "react";

import { usePost } from "@/hooks/useApi";
import useSearch from "@/hooks/useSearch";
import { SearchRequest, SearchResponse } from "@/app/api/search/route";
import CatalogDuckTable from "@/components/table";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import dynamic from "next/dynamic";

const GeoDuckMap = dynamic(() => import("@duckarchive/map").then((mod) => mod.default), {
  ssr: false,
});

type TableItem = SearchResponse[number];

const Search: React.FC = () => {
  const [defaultValues, setQueryParams] = useSearch();
  const [searchValues, setSearchValues] = useState<SearchRequest>(defaultValues);
  const { trigger, isMutating, data: searchResults } = usePost<SearchResponse, SearchRequest>(`/api/search`);

  useEffect(() => {
    trigger(searchValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (key: keyof SearchRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValues({ ...searchValues, [key]: value });
  };

  const handleYearChange = (value: number) => {
    setSearchValues({ ...searchValues, year: value });
  };

  const handleGeoChange = (value: [number, number]) => {
    setSearchValues({ ...searchValues, lat: value[0], lng: value[1] });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQueryParams(searchValues);
    trigger(searchValues);
  };

  return (
    <>
      <form className="flex gap-2 items-start" onSubmit={handleSubmit}>
        <Input
          value={searchValues.place || ""}
          onChange={handleInputChange("place")}
          pattern="[\u0400-\u04FF\u0500-\u052F]+"
          label="Населений пункт"
          labelPlacement="inside"
        />
        <NumberInput
          type="number"
          className="basis-32 shrink-0"
          value={searchValues.year || 1800}
          onValueChange={handleYearChange}
          label="Рік"
          labelPlacement="inside"
          formatOptions={{
            useGrouping: false,
            unitDisplay: "short",
          }}
          minValue={1400}
          maxValue={2000}
        />
        <div className="h-64 basis-1/2 shrink-0">
          <GeoDuckMap className="rounded-lg" position={[searchValues.lat ?? 0, searchValues.lng ?? 0]} onPositionChange={handleGeoChange} />
        </div>
      </form>
      <CatalogDuckTable<TableItem>
        isLoading={isMutating}
        columns={[
          {
            headerName: "Реквізити",
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
