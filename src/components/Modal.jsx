import { useState, useRef, useEffect, useCallback } from "react";
import { Resizable } from "re-resizable";
import { X, Minus, Square, Maximize2, GripVertical } from "lucide-react";
import { useModal } from "../contexts/ModalContext";
import { useTheme } from "../contexts/ThemeContext";
import { getMaximizedPosition, validateModalBounds } from "../utils/modalUtils";

const Modal = ({ modal, children }) => {
  const {
    closeModal,
    minimizeModal,
    toggleMaximize,
    updateModalPosition,
    updateModalSize,
    handleModalClick,
    focusedModalId,
  } = useModal();

  const { isDark } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);
  const headerRef = useRef(null);

  const isFocused = focusedModalId === modal.id;

  // Handle modal click to focus
  const handleClick = (e) => {
    if (e.target.closest(".modal-controls")) return;
    handleModalClick(modal.id);
  };

  // Handle drag start
  const handleDragStart = useCallback(
    (e) => {
      if (modal.isMaximized) return;

      setIsDragging(true);
      handleModalClick(modal.id);

      const rect = headerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      e.preventDefault();
    },
    [modal.isMaximized, handleModalClick, modal.id]
  );

  // Handle drag move
  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging || modal.isMaximized) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Constrain to viewport
      const maxX = window.innerWidth - modal.size.width;
      const maxY = window.innerHeight - 60 - modal.size.height; // Account for taskbar

      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      updateModalPosition(modal.id, { x: constrainedX, y: constrainedY });
    },
    [
      isDragging,
      modal.isMaximized,
      dragOffset,
      modal.size,
      updateModalPosition,
      modal.id,
    ]
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleDragEnd);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Handle resize start
  const handleResizeStart = () => {
    setIsResizing(true);
    handleModalClick(modal.id);
  };

  // Handle resize stop
  const handleResizeStop = (e, direction, ref, delta, position) => {
    setIsResizing(false);
    if (!modal.isMaximized) {
      updateModalSize(modal.id, {
        width: ref.style.width,
        height: ref.style.height,
      });
      updateModalPosition(modal.id, position);
    }
  };

  // Handle control buttons
  const handleClose = () => closeModal(modal.id);
  const handleMinimize = () => minimizeModal(modal.id);
  const handleMaximize = () => toggleMaximize(modal.id);

  // Calculate modal styles
  const getModalStyles = () => {
    const baseStyles = {
      position: "absolute",
      zIndex: modal.zIndex,
      transition: isDragging || isResizing ? "none" : "all 0.2s ease-in-out",
    };

    if (modal.isMaximized) {
      const maxPos = getMaximizedPosition();
      return {
        ...baseStyles,
        left: maxPos.x,
        top: maxPos.y,
        width: maxPos.width,
        height: maxPos.height,
      };
    }

    return {
      ...baseStyles,
      left: modal.position.x,
      top: modal.position.y,
      width: modal.size.width,
      height: modal.size.height,
    };
  };

  // Don't render if minimized
  if (modal.isMinimized) return null;

  return (
    <div
      ref={modalRef}
      className={`
        fixed shadow-2xl rounded-lg overflow-hidden
        ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
        ${
          isFocused
            ? isDark
              ? "ring-2 ring-blue-500 ring-opacity-50"
              : "ring-2 ring-blue-400 ring-opacity-30"
            : isDark
            ? "ring-1 ring-gray-600"
            : "ring-1 ring-gray-300"
        }
        transition-all duration-200 ease-in-out
      `}
      style={getModalStyles()}
      onClick={handleClick}
    >
      {/* Modal Header */}
      <div
        ref={headerRef}
        className={`
          modal-header flex items-center justify-between px-4 py-2
          ${modal.isMaximized ? "" : "cursor-grab active:cursor-grabbing"}
          ${isDark ? "bg-gray-700" : "bg-gray-100"}
          ${isFocused ? (isDark ? "bg-gray-600" : "bg-gray-200") : ""}
          transition-colors duration-200
        `}
        onMouseDown={handleDragStart}
      >
        {/* Title and Icon */}
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <span className="text-lg">{modal.icon}</span>
          <span className="font-medium truncate">{modal.title}</span>
        </div>

        {/* Control Buttons */}
        <div className="modal-controls flex items-center space-x-1">
          <button
            onClick={handleMinimize}
            className={`
              p-1 rounded hover:bg-opacity-80 transition-colors
              ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-300"}
            `}
            title="Minimize"
          >
            <Minus size={16} />
          </button>

          <button
            onClick={handleMaximize}
            className={`
              p-1 rounded hover:bg-opacity-80 transition-colors
              ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-300"}
            `}
            title={modal.isMaximized ? "Restore" : "Maximize"}
          >
            {modal.isMaximized ? <Square size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            onClick={handleClose}
            className={`
              p-1 rounded hover:bg-red-500 hover:text-white transition-colors
              ${isDark ? "hover:bg-red-600" : "hover:bg-red-500"}
            `}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Modal Content */}
      <Resizable
        size={{
          width: modal.isMaximized ? "100%" : modal.size.width,
          height: modal.isMaximized ? "100%" : modal.size.height,
        }}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        enable={{
          top: false,
          right: !modal.isMaximized,
          bottom: !modal.isMaximized,
          left: false,
          topRight: false,
          bottomRight: !modal.isMaximized,
          bottomLeft: false,
          topLeft: false,
        }}
        minWidth={300}
        minHeight={200}
        maxWidth={modal.isMaximized ? "100%" : window.innerWidth}
        maxHeight={modal.isMaximized ? "100%" : window.innerHeight - 60}
        className="modal-content"
      >
        <div
          className={`
            w-full h-full overflow-auto
            ${isDark ? "bg-gray-800" : "bg-white"}
          `}
        >
          {children}
        </div>
      </Resizable>
    </div>
  );
};

export default Modal;
