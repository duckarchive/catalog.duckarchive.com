"use client";

import { DuckTable } from "@duckarchive/framework";
import { ColDef } from "ag-grid-community";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface DuckTableProps<T> {
  columns: ColDef<T>[];
  rows: T[];
  isLoading?: boolean;
  loadingPage?: number;
}

const CatalogDuckTable = <T,>({
  columns,
  rows,
  isLoading,
  loadingPage,
}: DuckTableProps<T>) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("sizeColumnsToFit");
  //     gridRef.current?.api?.sizeColumnsToFit();
  //   }, 2000);
  // }, [columns]);

  useEffect(() => {
    setMounted(true);
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent;
      const firefoxMatch = ua.match(/Firefox\/(\d+)/);
      if (firefoxMatch && parseInt(firefoxMatch[1], 10) <= 115) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        import("ag-grid-community/styles/ag-grid.css");
      }
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DuckTable<T>
      appTheme={theme}
      columns={columns}
      setActiveFilterId={() => {}}
      rows={rows}
      isLoading={isLoading}
      loadingPage={loadingPage}
    />
  );
};

export default CatalogDuckTable;
