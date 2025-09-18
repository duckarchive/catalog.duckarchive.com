"use client";
import "leaflet/dist/leaflet.css";
import "../node_modules/@duckarchive/map/dist/style.css";

import { useState, useEffect } from "react";

import { usePost } from "@/hooks/useApi";
import useSearch from "@/hooks/useSearch";
import { SearchRequest, SearchResponse } from "@/app/api/search/route";
import CatalogDuckTable from "@/components/table";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Button } from "@heroui/button";
import { Modal, ModalContent, useDisclosure } from "@heroui/modal";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { FaSearch } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Archives } from "@/data/archives";
import SelectArchive from "@/components/select-archive";
import dynamic from "next/dynamic";
import { IoMap } from "react-icons/io5";
import TagChip from "@/components/tag-chip";

const UKRAINE_CENTER: [number, number] = [49.8397, 24.0297];

const GeoDuckMap = dynamic(() => import("@duckarchive/map").then((mod) => mod.default), {
  ssr: false,
});

type TableItem = SearchResponse[number];

interface SearchProps {
  archives: Archives;
}

const Search: React.FC<SearchProps> = ({ archives }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [defaultValues, setQueryParams] = useSearch();
  const [searchValues, setSearchValues] = useState<SearchRequest>(defaultValues);
  const { trigger, isMutating, data: searchResults } = usePost<SearchResponse, SearchRequest>(`/api/search`);

  useEffect(() => {
    trigger(searchValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setQueryParams(searchValues);
  }, [searchValues]);

  const handleInputChange = (key: keyof SearchRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValues({ ...searchValues, [key]: value });
  };

  const handleYearChange = (value: number) => {
    setSearchValues({ ...searchValues, year: value });
  };

  const handleGeoChange = (position: [number, number]) => {
    setSearchValues({ ...searchValues, lat: position[0], lng: position[1] });
  };

  const handleLatInputChange = (value: number) => {
    setSearchValues({ ...searchValues, lat: value });
  };

  const handleLngInputChange = (value: number) => {
    setSearchValues({ ...searchValues, lng: value });
  };

  const handlePlaceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchValues.lat || searchValues.lng) {
      const isConfirmed = window.confirm("Поля 'Широта' та 'Довгота' будуть очищені. Продовжити?");
      if (!isConfirmed) {
        return;
      }
    }
    const value = e.target.value;
    setSearchValues({ ...searchValues, lat: undefined, lng: undefined, place: value });
  };

  const handleOpenMap = () => {
    if (searchValues.place) {
      const isConfirmed = window.confirm("Поле 'Населений пункт' буде очищено. Продовжити?");
      if (!isConfirmed) {
        return;
      }
    }
    setSearchValues({ ...searchValues, place: undefined });
    onOpen();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trigger(searchValues);
  };

  return (
    <>
      <form className="flex flex-col gap-2 items-start" onSubmit={handleSubmit}>
        <div className="flex gap-2 w-full">
          <Input label="Заголовок справи" value={searchValues.title || ""} onChange={handleInputChange("title")} />
          <NumberInput
            type="number"
            className="basis-32 shrink-0"
            value={searchValues.year}
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
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <fieldset className="flex gap-2 basis-1/2 shrink-0">
            <Button
              aria-label="Switch between map and input mode"
              className="h-auto"
              variant="flat"
              color={searchValues.lat && searchValues.lng ? "primary" : "default"}
              onPress={handleOpenMap}
            >
              <IoMap size={20} />
            </Button>
            <NumberInput
              label="Широта (lat)"
              type="number"
              isClearable
              color={searchValues.lat && searchValues.lng ? "primary" : "default"}
              value={searchValues.lat || undefined}
              onValueChange={handleLatInputChange}
              onClear={() => setSearchValues({ ...searchValues, lat: undefined })}
            />
            <NumberInput
              label="Довгота (lng)"
              type="number"
              isClearable
              color={searchValues.lat && searchValues.lng ? "primary" : "default"}
              value={searchValues.lng || undefined}
              onValueChange={handleLngInputChange}
              onClear={() => setSearchValues({ ...searchValues, lng: undefined })}
            />
          </fieldset>
          <div className="flex items-center justify-center shrink-0">або</div>
          <Input
            isClearable
            className="basis-1/2 shrink-0"
            color={searchValues.place ? "primary" : "default"}
            value={searchValues.place || ""}
            onChange={handlePlaceInputChange}
            onClear={() => setSearchValues({ ...searchValues, place: undefined })}
            pattern="[\u0400-\u04FF\u0500-\u052F]+"
            label="Населений пункт"
            labelPlacement="inside"
          />
        </div>
        <Accordion isCompact className="p-0" variant="light">
          <AccordionItem
            key="map-help"
            aria-label="Open map to select location"
            className="flex flex-col"
            classNames={{
              trigger: `p-0 gap-1 w-auto`,
              content: "p-0 flex flex-col gap-2",
              title: "text-sm opacity-50",
            }}
            disableIndicatorAnimation
            indicator={({ isOpen }) => (
              <IoChevronDown className={`${isOpen ? "rotate-180" : ""} transition-transform inline`} />
            )}
            title="Розгорніть для вводу архівних реквізитів"
          >
            <SelectArchive
              archives={archives}
              value={searchValues.archive_id}
              onChange={(v) => setSearchValues({ ...searchValues, archive_id: v?.toString() || undefined })}
            />
            <div className="flex gap-2">
              <Input label="Фонд" value={searchValues.fund || ""} onChange={handleInputChange("fund")} />
              <Input label="Опис" value={searchValues.description || ""} onChange={handleInputChange("description")} />
              <Input label="Справа" value={searchValues.case || ""} onChange={handleInputChange("case")} />
            </div>
          </AccordionItem>
        </Accordion>
        <Button
          type="submit"
          color="primary"
          size="lg"
          className="w-full font-bold text-lg"
          startContent={<FaSearch />}
        >
          Пошук
        </Button>
      </form>
      <Modal isOpen={isOpen} size="full" onClose={onClose} title="Виберіть місце на карті">
        <ModalContent className="pt-10">
            <GeoDuckMap
              key="geoduck-map"
              className="rounded-lg"
              position={[searchValues.lat ?? UKRAINE_CENTER[0], searchValues.lng ?? UKRAINE_CENTER[1]]}
              onPositionChange={handleGeoChange}
            />
        </ModalContent>
      </Modal>
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
          { headerName: "Рік", field: "year" },
          {
            headerName: "Теги",
            field: "tags",
            cellRenderer: (row: { value: string[] }) => (
              <>
                {row.value.map((tag) => (
                  <TagChip key={tag} label={tag} />
                ))}
              </>
            ),
          },
        ]}
        rows={searchResults || []}
      />
    </>
  );
};

export default Search;
