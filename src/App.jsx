import { ThemeProvider } from "./contexts/ThemeContext";
import { ModalProvider } from "./contexts/ModalContext";
import WindowsDesktop from "./components/WindowsDesktop";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <ModalProvider>
        <WindowsDesktop />
      </ModalProvider>
    </ThemeProvider>
  );
}

export default App;
