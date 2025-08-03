import { useModalManager } from '../hooks/useModalManager';
import { useTheme } from '../contexts/ThemeContext';

const DemoButtons = () => {
  const {
    createDocumentEditor,
    createImageViewer,
    createDataAnalytics,
    createWebBrowser,
    createMusicPlayer,
    createCustomModal,
  } = useModalManager();
  
  const { isDark } = useTheme();

  const demoButtons = [
    {
      title: 'Document Editor',
      icon: '📄',
      action: createDocumentEditor,
      description: 'Create and edit documents',
    },
    {
      title: 'Image Viewer',
      icon: '🎨',
      action: createImageViewer,
      description: 'View and manage images',
    },
    {
      title: 'Data Analytics',
      icon: '📊',
      action: createDataAnalytics,
      description: 'Analyze data and charts',
    },
    {
      title: 'Web Browser',
      icon: '🌐',
      action: createWebBrowser,
      description: 'Browse the web',
    },
    {
      title: 'Music Player',
      icon: '🎵',
      action: createMusicPlayer,
      description: 'Play your favorite music',
    },
  ];

  const handleCustomModal = () => {
    const customTitle = prompt('Enter modal title:', 'Custom Modal');
    const customIcon = prompt('Enter modal icon (emoji):', '🚀');
    
    if (customTitle && customIcon) {
      createCustomModal(customTitle, customIcon);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-40">
      <div className={`
        p-4 rounded-lg shadow-lg
        ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'}
      `}>
        <h3 className={`
          text-lg font-semibold mb-3
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Quick Launch
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {demoButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className={`
                p-3 rounded-lg text-left transition-all
                ${isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }
                hover:scale-105 transform
              `}
              title={button.description}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">{button.icon}</span>
                <div>
                  <div className="font-medium text-sm">{button.title}</div>
                  <div className={`
                    text-xs
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    {button.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          <button
            onClick={handleCustomModal}
            className={`
              p-3 rounded-lg text-left transition-all
              ${isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
              hover:scale-105 transform
            `}
            title="Create a custom modal"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">🚀</span>
              <div>
                <div className="font-medium text-sm">Custom Modal</div>
                <div className="text-xs opacity-80">
                  Create your own
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoButtons; 