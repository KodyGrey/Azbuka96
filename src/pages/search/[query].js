import { useRouter } from "next/router";
import Catalogue from "../catalogue";

const SearchPage = (props) => {
  const router = useRouter();
  const query = router.query.query;

  return <Catalogue searchQuery={query} {...props} />;
};

export default SearchPage;

export async function getServerSideProps(ctx) {
  return {
    props: {
      url: process.env.RESOURCE_URL,
    },
  };
}
