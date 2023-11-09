import axiosInstance from "./utils/axios";

function App() {
  async function createLinkToken() {
    const publicToken = await axiosInstance.post("/plaid/createLinkToken", {
      id: "uuid123842",
    });
    console.log(publicToken);
  }

  return <button onClick={createLinkToken}>Create Link Token</button>;
}

export default App;
