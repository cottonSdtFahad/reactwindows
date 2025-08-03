import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getDefaultModalConfig,
  saveModalsToStorage,
  loadModalsFromStorage,
  focusModal,
  getNextZIndex,
  validateModalBounds,
} from '../utils/modalUtils';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);
  const [focusedModalId, setFocusedModalId] = useState(null);

  // Load modals from localStorage on mount
  useEffect(() => {
    const savedModals = loadModalsFromStorage();
    if (savedModals.length > 0) {
      setModals(savedModals);
      // Focus the most recently created modal
      const mostRecent = savedModals.reduce((prev, current) => 
        current.createdAt > prev.createdAt ? current : prev
      );
      setFocusedModalId(mostRecent.id);
    }
  }, []);

  // Save modals to localStorage whenever they change
  useEffect(() => {
    if (modals.length > 0) {
      saveModalsToStorage(modals);
    }
  }, [modals]);

  // Open a new modal
  const openModal = useCallback((title = 'New Window', icon = '📄') => {
    const newModal = getDefaultModalConfig(title, icon);
    const nextZIndex = getNextZIndex(modals);
    newModal.zIndex = nextZIndex;
    newModal.isFocused = true;
    
    setModals(prev => {
      const updated = prev.map(modal => ({ ...modal, isFocused: false }));
      return [...updated, newModal];
    });
    setFocusedModalId(newModal.id);
  }, [modals]);

  // Close a modal
  const closeModal = useCallback((modalId) => {
    setModals(prev => prev.filter(modal => modal.id !== modalId));
    if (focusedModalId === modalId) {
      setFocusedModalId(null);
    }
  }, [focusedModalId]);

  // Focus a modal (bring to front)
  const focusModalById = useCallback((modalId) => {
    setModals(prev => focusModal(prev, modalId));
    setFocusedModalId(modalId);
  }, []);

  // Update modal state
  const updateModal = useCallback((modalId, updates) => {
    setModals(prev => prev.map(modal => 
      modal.id === modalId ? { ...modal, ...updates } : modal
    ));
  }, []);

  // Minimize a modal
  const minimizeModal = useCallback((modalId) => {
    updateModal(modalId, { isMinimized: true, isFocused: false });
    setFocusedModalId(null);
  }, [updateModal]);

  // Restore a minimized modal
  const restoreModal = useCallback((modalId) => {
    updateModal(modalId, { isMinimized: false, isFocused: true });
    focusModalById(modalId);
  }, [updateModal, focusModalById]);

  // Maximize/Restore a modal
  const toggleMaximize = useCallback((modalId) => {
    setModals(prev => prev.map(modal => {
      if (modal.id === modalId) {
        return {
          ...modal,
          isMaximized: !modal.isMaximized,
          isFocused: true,
        };
      }
      return { ...modal, isFocused: false };
    }));
    setFocusedModalId(modalId);
  }, []);

  // Update modal position
  const updateModalPosition = useCallback((modalId, position) => {
    updateModal(modalId, { position });
  }, [updateModal]);

  // Update modal size
  const updateModalSize = useCallback((modalId, size) => {
    updateModal(modalId, { size });
  }, [updateModal]);

  // Handle modal click (focus)
  const handleModalClick = useCallback((modalId) => {
    focusModalById(modalId);
  }, [focusModalById]);

  // Get visible modals (not minimized)
  const getVisibleModals = useCallback(() => {
    return modals.filter(modal => !modal.isMinimized);
  }, [modals]);

  // Get minimized modals
  const getMinimizedModals = useCallback(() => {
    return modals.filter(modal => modal.isMinimized);
  }, [modals]);

  const value = {
    modals,
    focusedModalId,
    openModal,
    closeModal,
    focusModalById,
    updateModal,
    minimizeModal,
    restoreModal,
    toggleMaximize,
    updateModalPosition,
    updateModalSize,
    handleModalClick,
    getVisibleModals,
    getMinimizedModals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}; 