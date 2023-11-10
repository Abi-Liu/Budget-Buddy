import { useEffect, useState } from "react";
import PlaidLink from "./components/PlaidLink";
import axiosInstance from "./utils/axios";
import Login from "./pages/Login";

function App() {
  const [linkToken, setLinkToken] = useState(null);
  console.log(linkToken);

  useEffect(() => {
    async function createLinkToken() {
      const response = await axiosInstance.post("/plaid/createLinkToken", {
        id: "123842",
      });
      setLinkToken(response.data.link_token);
    }

    createLinkToken();
  }, []);

  return linkToken != null ? (
    <>
      <Login />
      <PlaidLink linkToken={linkToken} userId={123421} />
    </>
  ) : (
    <></>
  );
}

export default App;
