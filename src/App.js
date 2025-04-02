import Homepage from "./pages/Homepage";
import { useEffect } from "react";
import { useLocation } from "react-router";
import "./App.css";
import "preline/preline";
import { CartProvider } from "./contexts/CartContext";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);
  return (
    <CartProvider>
      <div className="App">
        <Homepage />
      </div>
    </CartProvider>
  );
}

export default App;
