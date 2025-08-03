// Modal state management utilities
export const MODAL_STORAGE_KEY = 'react-windows-modals';

// Generate unique modal ID
export const generateModalId = () => `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Default modal configuration
export const getDefaultModalConfig = (title = 'New Window', icon = '📄') => ({
  id: generateModalId(),
  title,
  icon,
  position: { x: 100, y: 100 },
  size: { width: 600, height: 400 },
  isMinimized: false,
  isMaximized: false,
  zIndex: 1000,
  isFocused: false,
  dockPosition: null,
  createdAt: Date.now(),
});

// Save modals to localStorage
export const saveModalsToStorage = (modals) => {
  try {
    localStorage.setItem(MODAL_STORAGE_KEY, JSON.stringify(modals));
  } catch (error) {
    console.error('Failed to save modals to localStorage:', error);
  }
};

// Load modals from localStorage
export const loadModalsFromStorage = () => {
  try {
    const stored = localStorage.getItem(MODAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load modals from localStorage:', error);
    return [];
  }
};

// Get next available z-index
export const getNextZIndex = (modals) => {
  if (modals.length === 0) return 1000;
  return Math.max(...modals.map(modal => modal.zIndex)) + 1;
};

// Focus a modal (bring to front)
export const focusModal = (modals, modalId) => {
  const nextZIndex = getNextZIndex(modals);
  return modals.map(modal => ({
    ...modal,
    zIndex: modal.id === modalId ? nextZIndex : modal.zIndex,
    isFocused: modal.id === modalId
  }));
};

// Calculate modal position when maximized
export const getMaximizedPosition = () => ({
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight - 60, // Account for taskbar height
});

// Validate modal position and size
export const validateModalBounds = (modal) => {
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight - 60;
  
  return {
    ...modal,
    position: {
      x: Math.max(0, Math.min(modal.position.x, maxWidth - modal.size.width)),
      y: Math.max(0, Math.min(modal.position.y, maxHeight - modal.size.height)),
    },
    size: {
      width: Math.min(Math.max(200, modal.size.width), maxWidth),
      height: Math.min(Math.max(150, modal.size.height), maxHeight),
    }
  };
}; 