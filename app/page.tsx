import { NextPage } from "next";

import SearchInput from "@/components/search-input";
// import getTags from "@/data/tags";

const Home: NextPage = async () => {
  // const tags = await getTags();

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-bold">Введіть ваш запит:</h1>
      <SearchInput />
    </div>
  );
};

export default Home;
