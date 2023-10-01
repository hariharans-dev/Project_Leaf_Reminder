import Login from "./mainpages/login";
import Dashboard from "./mainpages/dashboard";
import { useState } from "react";

function App() {
  var [servererror, setservererror] = useState(false);

  var [login, setlogin] = useState(true);
  return (
    <>
      {!servererror && (
        <Login
          error={(error) => {
            setservererror(error);
          }}
          loginauth={() => {
            setlogin(true);
          }}
        />
      )}
    </>
  );
}

export default App;
