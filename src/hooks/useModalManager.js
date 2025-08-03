import { useCallback } from 'react';
import { useModal } from '../contexts/ModalContext';

export const useModalManager = () => {
  const { openModal, closeModal, focusModalById, updateModal } = useModal();

  // Create a new modal with custom content
  const createModal = useCallback((title, icon, content) => {
    const modalId = openModal(title, icon);
    
    // You can extend this to store custom content
    // For now, we'll use the title to determine content type
    return modalId;
  }, [openModal]);

  // Create specific modal types
  const createDocumentEditor = useCallback(() => {
    return createModal('Document Editor', '📄');
  }, [createModal]);

  const createImageViewer = useCallback(() => {
    return createModal('Image Viewer', '🎨');
  }, [createModal]);

  const createDataAnalytics = useCallback(() => {
    return createModal('Data Analytics', '📊');
  }, [createModal]);

  const createWebBrowser = useCallback(() => {
    return createModal('Web Browser', '🌐');
  }, [createModal]);

  const createMusicPlayer = useCallback(() => {
    return createModal('Music Player', '🎵');
  }, [createModal]);

  // Create a custom modal with any title and icon
  const createCustomModal = useCallback((title, icon) => {
    return createModal(title, icon);
  }, [createModal]);

  // Update modal properties
  const updateModalTitle = useCallback((modalId, newTitle) => {
    updateModal(modalId, { title: newTitle });
  }, [updateModal]);

  const updateModalIcon = useCallback((modalId, newIcon) => {
    updateModal(modalId, { icon: newIcon });
  }, [updateModal]);

  const updateModalPosition = useCallback((modalId, position) => {
    updateModal(modalId, { position });
  }, [updateModal]);

  const updateModalSize = useCallback((modalId, size) => {
    updateModal(modalId, { size });
  }, [updateModal]);

  return {
    // Creation methods
    createModal,
    createDocumentEditor,
    createImageViewer,
    createDataAnalytics,
    createWebBrowser,
    createMusicPlayer,
    createCustomModal,
    
    // Management methods
    closeModal,
    focusModalById,
    updateModalTitle,
    updateModalIcon,
    updateModalPosition,
    updateModalSize,
  };
}; 