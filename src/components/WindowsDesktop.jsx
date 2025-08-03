import { useModal } from "../contexts/ModalContext";
import { useTheme } from "../contexts/ThemeContext";
import Modal from "./Modal";
import Taskbar from "./Taskbar";
import DemoButtons from "./DemoButtons";

const WindowsDesktop = () => {
  const { getVisibleModals } = useModal();
  const { isDark } = useTheme();

  const visibleModals = getVisibleModals();

  return (
    <div
      className={`
        w-full h-screen overflow-hidden relative
        ${isDark ? "bg-gray-900" : "bg-gray-50"}
      `}
    >
      {/* Desktop Background */}
      <div className="absolute inset-0">
        {/* You can add wallpaper here */}
        <div
          className={`
          w-full h-full flex items-center justify-center
          ${isDark ? "text-gray-600" : "text-gray-400"}
        `}
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">React Windows</h1>
            <p className="text-lg">
              Click the Start button to open applications
            </p>
          </div>
        </div>
      </div>

      {/* Demo Buttons */}
      <DemoButtons />

      {/* Modals */}
      {visibleModals.map((modal) => (
        <Modal key={modal.id} modal={modal}>
          <ModalContent modal={modal} />
        </Modal>
      ))}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};

// Modal content component - you can customize this for different modal types
const ModalContent = ({ modal }) => {
  const { isDark } = useTheme();

  // Different content based on modal title
  const getModalContent = () => {
    switch (modal.title) {
      case "Document Editor":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Document Editor</h2>
            <textarea
              className={`
                w-full h-64 p-4 rounded-lg resize-none
                ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }
                border focus:ring-2 focus:ring-blue-500 focus:border-transparent
              `}
              placeholder="Start typing your document here..."
            />
          </div>
        );

      case "Image Viewer":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Image Viewer</h2>
            <div
              className={`
              w-full h-64 rounded-lg border-2 border-dashed flex items-center justify-center
              ${
                isDark
                  ? "border-gray-600 text-gray-400"
                  : "border-gray-300 text-gray-500"
              }
            `}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">🖼️</div>
                <p>Drop an image here or click to browse</p>
              </div>
            </div>
          </div>
        );

      case "Data Analytics":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Data Analytics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`
                p-4 rounded-lg
                ${isDark ? "bg-gray-700" : "bg-gray-100"}
              `}
              >
                <h3 className="font-semibold mb-2">Sales</h3>
                <div className="text-2xl font-bold text-green-500">$12,450</div>
                <div className="text-sm text-gray-500">
                  +12% from last month
                </div>
              </div>
              <div
                className={`
                p-4 rounded-lg
                ${isDark ? "bg-gray-700" : "bg-gray-100"}
              `}
              >
                <h3 className="font-semibold mb-2">Users</h3>
                <div className="text-2xl font-bold text-blue-500">1,234</div>
                <div className="text-sm text-gray-500">+5% from last month</div>
              </div>
            </div>
          </div>
        );

      case "Web Browser":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Web Browser</h2>
            <div
              className={`
              w-full p-3 rounded-lg mb-4
              ${isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"}
              border
            `}
            >
              <div className="flex items-center space-x-2">
                <span>🌐</span>
                <input
                  type="text"
                  placeholder="Enter URL..."
                  className={`
                    flex-1 bg-transparent outline-none
                    ${
                      isDark
                        ? "text-white placeholder-gray-400"
                        : "text-gray-900 placeholder-gray-500"
                    }
                  `}
                />
              </div>
            </div>
            <div
              className={`
              w-full h-48 rounded-lg border-2 border-dashed flex items-center justify-center
              ${
                isDark
                  ? "border-gray-600 text-gray-400"
                  : "border-gray-300 text-gray-500"
              }
            `}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">🌍</div>
                <p>Browser content will appear here</p>
              </div>
            </div>
          </div>
        );

      case "Music Player":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Music Player</h2>
            <div className="text-center">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-lg font-semibold mb-2">Now Playing</h3>
              <p className="text-gray-500 mb-4">No track selected</p>
              <div className="flex justify-center space-x-4">
                <button
                  className={`
                  p-2 rounded-full
                  ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }
                `}
                >
                  ⏮️
                </button>
                <button
                  className={`
                  p-2 rounded-full
                  ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }
                `}
                >
                  ▶️
                </button>
                <button
                  className={`
                  p-2 rounded-full
                  ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }
                `}
                >
                  ⏭️
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{modal.title}</h2>
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>
              This is a sample modal content. You can customize this for your
              specific needs.
            </p>
          </div>
        );
    }
  };

  return getModalContent();
};

export default WindowsDesktop;
