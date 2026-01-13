import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const DeleteModal: React.FC<ModalProps> = ({
    isOpen,
    title ,
    description ,
    children,
  }) => {
    if (!isOpen) return null;
  
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
  
          {/* Render the children here */}
          {children}
  

        </div>
      </div>,
      document.body
    );
  };
  

export default DeleteModal;
