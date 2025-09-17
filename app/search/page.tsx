import { NextPage } from "next";

// import getChurchAdministrations from "@/data/church-administrations";
// import getConfessions from "@/data/confessions";
// import getRecordTypes from "@/data/record-types";
import Search from "@/components/search";

const SearchPage: NextPage = async () => {
  // const churchAdministrations = await getChurchAdministrations();
  // const confessions = await getConfessions();
  // const recordTypes = await getRecordTypes();

  return (
    <div className="flex flex-col">
      <h1 className="text-lg font-bold">Пошук:</h1>
      <Search />
    </div>
  );
};

export default SearchPage;
