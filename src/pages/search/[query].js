import { useRouter } from "next/router";
import Head from "next/head";
import Catalogue from "../catalogue";

const SearchPage = (props) => {
  const router = useRouter();
  const query = router.query.query;

  return (
    <>
      <Head>
        <title>Азбука96 - Поиск по запросу: {query}</title>
      </Head>
      <Catalogue searchQuery={query} {...props} />;
    </>
  );
};

export default SearchPage;

export async function getServerSideProps(ctx) {
  return {
    props: {
      url: process.env.RESOURCE_URL,
    },
  };
}
