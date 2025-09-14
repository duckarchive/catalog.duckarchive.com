import { NextPage } from "next";

import { title, subtitle } from "@/components/primitives";
import getCountries from "@/data/countries";
import getStates from "@/data/states";
import getChurchAdministrations from "@/data/church-administrations";
import getConfessions from "@/data/confessions";
import getRecordTypes from "@/data/record-types";

const Home: NextPage = async () => {
  const countries = await getCountries();
  const states = await getStates();
  const churchAdministrations = await getChurchAdministrations();
  const confessions = await getConfessions();
  const recordTypes = await getRecordTypes();

  // eslint-disable-next-line no-console
  console.log(countries, states, churchAdministrations, confessions, recordTypes);

  return (
    <main className="container flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <h1 className={title()}>Catalog Duck Archive</h1>
        <p className={subtitle()}>A searchable catalog of archival records.</p>
      </div>
    </main>
  );
};

export default Home;
