import { NextPage } from "next";

import { title, subtitle } from "@/components/primitives";
import getCountries from "@/data/countries";
import getStates from "@/data/states";
// import getChurchAdministrations from "@/data/church-administrations";
// import getConfessions from "@/data/confessions";
// import getRecordTypes from "@/data/record-types";
import SearchPlace from "@/components/search-place";

const SearchPage: NextPage = async () => {
  const countries = await getCountries();
  // const states = await getStates();
  // const churchAdministrations = await getChurchAdministrations();
  // const confessions = await getConfessions();
  // const recordTypes = await getRecordTypes();

  return (
    <div className="flex flex-col gap-6">
      <h1 className={title()}>Шукати за населеним пунктом:</h1>
      <SearchPlace
        countries={countries}
        states={[
          "Катеринославська губернія",
          "Херсонська губернія",
          "Волинська губернія",
        ]}
      />
    </div>
  );
};

export default SearchPage;
