// @refresh reset
"use client";
import "leaflet/dist/leaflet.css";
import "../node_modules/@duckarchive/map/dist/style.css";

import { Modal, ModalContent, useDisclosure } from "@heroui/modal";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { NumberInput } from "@heroui/number-input";
import dynamic from "next/dynamic";
import { IoChevronDown } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Input } from "@heroui/input";

const UKRAINE_CENTER: [number, number] = [49.0139, 31.2858];

const GeoDuckMap = dynamic(() => import("@duckarchive/map").then((mod) => mod.default), {
  ssr: false,
});

interface Coordinates {
  lat?: string;
  lng?: string;
  radius_m?: number;
}

interface CoordinatesInputProps {
  isLoading?: boolean;
  value: Coordinates;
  year?: string;
  onChange: (value: Coordinates) => void;
}

const CoordinatesInput: React.FC<CoordinatesInputProps> = ({ value, onChange, year, isLoading }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [coordinates, setCoordinates] = useState<Coordinates>(value);
  const [debouncedCoordinates, setDebouncedCoordinates] = useState<Coordinates | undefined>();

  // Debounce coordinate changes to avoid excessive updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCoordinates(coordinates);
    }, 300);

    return () => clearTimeout(timer);
  }, [coordinates]);

  // When the modal is closed, propagate the debounced coordinates to the parent
  useEffect(() => {
    if (!isOpen && debouncedCoordinates) {
      onChange(debouncedCoordinates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, debouncedCoordinates]);

  const handleGeoChange = (position: [number, number]) => {
    setCoordinates({ ...coordinates, lat: position[0].toString(), lng: position[1].toString() });
  };

  const handleRadiusChange = (radius: number) => {
    setCoordinates({ ...coordinates, radius_m: radius });
  };

  const latLng: [number, number] = [+(coordinates.lat || UKRAINE_CENTER[0]), +(coordinates.lng || UKRAINE_CENTER[1])];
  const title =
    coordinates.lat && coordinates.lng
      ? `${coordinates.lat},${coordinates.lng}${coordinates.radius_m ? ` ±${coordinates.radius_m}м` : ""}`
      : "Оберіть місце на карті";
  return (
    <div className="h-64 flex flex-col gap-0">
      <div className="h-full" onClick={onOpen}>
        {!isOpen && (
          <GeoDuckMap
            key="static-geoduck-map"
            className="rounded-lg text-danger"
            position={latLng}
            center={latLng}
            onPositionChange={() => {}}
            year={+(year || 0) || undefined}
            radius={value.radius_m || 0}
            hideLayers={{ searchInput: true }}
            zoom={12}
          />
        )}
      </div>
      <Accordion isCompact className="p-0" variant="light">
        <AccordionItem
          key="map-help"
          className="flex flex-col"
          classNames={{
            trigger: `p-0 gap-1 w-auto`,
            content: "p-0 flex flex-col gap-2",
            title: "text-xs opacity-50",
            indicator: "leading-none",
          }}
          disableIndicatorAnimation
          indicator={({ isOpen }) => (
            <IoChevronDown className={`${isOpen ? "rotate-180" : ""} transition-transform inline`} />
          )}
          title={title}
        >
          <fieldset aria-label="Ручне введення координат" className="flex gap-2">
            <Input
              isDisabled={isLoading}
              label="Широта (lat)"
              isClearable
              value={coordinates.lat}
              onValueChange={(lat) => setCoordinates({ ...coordinates, lat })}
              onClear={() => setCoordinates({ ...coordinates, lat: undefined })}
            />
            <Input
              isDisabled={isLoading}
              label="Довгота (lng)"
              isClearable
              value={coordinates.lng}
              onValueChange={(lng) => setCoordinates({ ...coordinates, lng })}
              onClear={() => setCoordinates({ ...coordinates, lng: undefined })}
            />
            <NumberInput
              className="basis-1/4 shrink-0"
              isDisabled={isLoading}
              label="Радіус"
              isClearable
              formatOptions={{
                style: "unit",
                unit: "meter",
                unitDisplay: "short",
              }}
              maxValue={10000}
              value={coordinates.radius_m || 0}
              onValueChange={(r) => setCoordinates({ ...coordinates, radius_m: r })}
              onClear={() => setCoordinates({ ...coordinates, radius_m: undefined })}
            />
          </fieldset>
        </AccordionItem>
      </Accordion>

      <Modal isOpen={isOpen} size="5xl" onClose={onClose} title="Виберіть місце на карті">
        <ModalContent className="h-[90vh]">
          <GeoDuckMap
            key="geoduck-map"
            className="rounded-lg text-danger"
            position={latLng}
            onPositionChange={handleGeoChange}
            year={+(year || 0) || undefined}
            radius={coordinates.radius_m || 0}
            onRadiusChange={handleRadiusChange}
            center={latLng}
            zoom={12}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CoordinatesInput;
