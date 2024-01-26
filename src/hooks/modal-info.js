import { useState } from "react"

function useModalInfo () {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(undefined)
  const [modalProps, setModalProps] = useState({});

  const openModal = (type, props) => {
    setModalType(type);
    setModalProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setModalType(undefined);
    setModalProps({});
    setIsOpen(false);
  };

  return { 
    isOpen,
    modalType,
    modalProps,
    openModal,
    closeModal
  }
};

export default useModalInfo;