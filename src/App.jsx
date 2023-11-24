import { useState } from "react";
import Credentials from "./LandingPage/Credentials";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Credentials />
    </>
  );
}

export default App;
