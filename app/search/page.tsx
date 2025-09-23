import { NextPage } from "next";

// import getChurchAdministrations from "@/data/church-administrations";
// import getConfessions from "@/data/confessions";
// import getRecordTypes from "@/data/record-types";
import Search from "@/components/search";
import { getArchives } from "@/data/archives";
import getTags from "@/data/tags";
import { Suspense } from "react";

const SearchPage: NextPage = async () => {
  const archives = await getArchives();
  const tags = await getTags();

  // const churchAdministrations = await getChurchAdministrations();
  // const confessions = await getConfessions();
  // const recordTypes = await getRecordTypes();

  return (
    <div className="flex flex-col">
      <h1 className="text-lg font-bold">Пошук:</h1>
      <Suspense fallback={<span>...</span>}>
        <Search archives={archives} tags={tags} />
      </Suspense>
    </div>
  );
};

export default SearchPage;
