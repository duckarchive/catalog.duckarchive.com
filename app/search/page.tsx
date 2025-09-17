import { NextPage } from "next";

// import getChurchAdministrations from "@/data/church-administrations";
// import getConfessions from "@/data/confessions";
// import getRecordTypes from "@/data/record-types";
import Search from "@/components/search";
import { getArchives } from "@/data/archives";

const SearchPage: NextPage = async () => {
  const archives = await getArchives();

  // const churchAdministrations = await getChurchAdministrations();
  // const confessions = await getConfessions();
  // const recordTypes = await getRecordTypes();

  return (
    <div className="flex flex-col">
      <h1 className="text-lg font-bold">Пошук:</h1>
      <Search archives={archives} />
    </div>
  );
};

export default SearchPage;
