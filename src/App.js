import Homepage from "./pages/Homepage";
import { useEffect } from "react";
import { useLocation } from "react-router";
import "./App.css";
import "preline/preline";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);
  return (
    <div className="App">
      <Homepage />
    </div>
  );
}

export default App;
