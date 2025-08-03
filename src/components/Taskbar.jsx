import { useState, useRef, useEffect } from 'react';
import { 
  Monitor, 
  Settings, 
  Sun, 
  Moon,
  MoreHorizontal,
  X
} from 'lucide-react';
import { useModal } from '../contexts/ModalContext';
import { useTheme } from '../contexts/ThemeContext';

const Taskbar = () => {
  const { 
    modals, 
    focusedModalId, 
    restoreModal, 
    closeModal,
    openModal 
  } = useModal();
  const { isDark, toggleTheme } = useTheme();
  
  const [contextMenu, setContextMenu] = useState(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const contextMenuRef = useRef(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle right-click on taskbar item
  const handleContextMenu = (e, modal) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      modal
    });
  };

  // Handle taskbar item click
  const handleTaskbarItemClick = (modal) => {
    if (modal.isMinimized) {
      restoreModal(modal.id);
    } else {
      // Focus the modal
      restoreModal(modal.id);
    }
  };

  // Context menu actions
  const handleContextMenuAction = (action, modal) => {
    switch (action) {
      case 'restore':
        restoreModal(modal.id);
        break;
      case 'close':
        closeModal(modal.id);
        break;
      default:
        break;
    }
    setContextMenu(null);
  };

  // Start menu items
  const startMenuItems = [
    { icon: '📄', title: 'Document Editor', action: () => openModal('Document Editor', '📄') },
    { icon: '🎨', title: 'Image Viewer', action: () => openModal('Image Viewer', '🎨') },
    { icon: '📊', title: 'Data Analytics', action: () => openModal('Data Analytics', '📊') },
    { icon: '🌐', title: 'Web Browser', action: () => openModal('Web Browser', '🌐') },
    { icon: '🎵', title: 'Music Player', action: () => openModal('Music Player', '🎵') },
  ];

  return (
    <>
      {/* Taskbar */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 h-14 z-50
          ${isDark ? 'bg-gray-900 border-t border-gray-700' : 'bg-gray-100 border-t border-gray-300'}
          flex items-center justify-between px-2
        `}
      >
        {/* Start Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStartMenu(!showStartMenu)}
            className={`
              p-2 rounded-lg transition-colors
              ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}
              ${showStartMenu ? (isDark ? 'bg-gray-800' : 'bg-gray-200') : ''}
            `}
            title="Start"
          >
            <Monitor size={20} />
          </button>
        </div>

        {/* Taskbar Items */}
        <div className="flex items-center space-x-1 flex-1 justify-center">
          {modals.map((modal) => (
            <button
              key={modal.id}
              onClick={() => handleTaskbarItemClick(modal)}
              onContextMenu={(e) => handleContextMenu(e, modal)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
                ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}
                ${focusedModalId === modal.id 
                  ? isDark 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : ''
                }
                ${modal.isMinimized ? 'opacity-60' : 'opacity-100'}
              `}
              title={modal.title}
            >
              <span className="text-sm">{modal.icon}</span>
              <span className="text-sm font-medium truncate max-w-24">
                {modal.title}
              </span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className={`
              p-2 rounded-lg transition-colors
              ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}
            `}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <button
            className={`
              p-2 rounded-lg transition-colors
              ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}
            `}
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Start Menu */}
      {showStartMenu && (
        <div
          className={`
            fixed bottom-16 left-2 w-64 rounded-lg shadow-2xl z-40
            ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'}
          `}
        >
          <div className="p-4">
            <h3 className={`
              font-semibold mb-3
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              Applications
            </h3>
            <div className="space-y-1">
              {startMenuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    setShowStartMenu(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg
                    transition-colors text-left
                    ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className={`
            fixed z-50 w-48 rounded-lg shadow-2xl
            ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'}
          `}
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <div className="py-1">
            <button
              onClick={() => handleContextMenuAction('restore', contextMenu.modal)}
              className={`
                w-full px-4 py-2 text-left text-sm transition-colors
                ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}
              `}
            >
              Restore
            </button>
            <button
              onClick={() => handleContextMenuAction('close', contextMenu.modal)}
              className={`
                w-full px-4 py-2 text-left text-sm transition-colors
                ${isDark ? 'hover:bg-red-600 text-red-200' : 'hover:bg-red-100 text-red-700'}
              `}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Backdrop for start menu */}
      {showStartMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowStartMenu(false)}
        />
      )}
    </>
  );
};

export default Taskbar; 