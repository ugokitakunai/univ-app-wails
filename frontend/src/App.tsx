import {useEffect} from 'react'
import {WML} from "@wailsio/runtime";

// Show the actual Wails version this project was generated against.
const wailsVersion = "v3.0.0-alpha2.105";

function App() {
  useEffect(() => {
    // Reload WML so it picks up the wml tags
    WML.Reload();
  }, []);

  return (
    <div className="App">
      <h1>Wails v3 + React + TypeScript</h1>
      <p>Wails version: {wailsVersion}</p>
    </div>
  );
}

export default App
