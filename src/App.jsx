import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import MemoryGame from "./components/memory-game";
import TailwindTest from "./components/TailwindTest";

function App() {
  return (
    <div>
      {/* <TailwindTest /> */}
      <div className="App">
        <MemoryGame />;
      </div>
      <Analytics />
    </div>
  );
}

export default App;
