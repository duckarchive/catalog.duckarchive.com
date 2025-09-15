import { NextPage } from "next";

import { title, subtitle } from "@/components/primitives";
import getCountries from "@/data/countries";
import getStates from "@/data/states";
// import getChurchAdministrations from "@/data/church-administrations";
// import getConfessions from "@/data/confessions";
// import getRecordTypes from "@/data/record-types";
import SearchPlace from "@/components/search-place";

const Home: NextPage = async () => {
  const countries = await getCountries();
  const states = await getStates();
  // const churchAdministrations = await getChurchAdministrations();
  // const confessions = await getConfessions();
  // const recordTypes = await getRecordTypes();

  // eslint-disable-next-line no-console
  console.log(countries, states);

  return (
    <main className="container flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <h1 className={title()}>Catalog Duck Archive</h1>
        <SearchPlace
          countries={countries}
          states={states}
        />
      </div>
    </main>
  );
};

export default Home;
