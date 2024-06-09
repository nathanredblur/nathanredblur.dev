import { useEffect, useState } from "react";
import WindowBox from "../WindowBox";

type Props = {
  isOpen: boolean;
  className?: string;
  onRequestClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const Modal = ({
  isOpen = false,
  onRequestClose,
  title,
  children,
  className,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const closeModal = () => {
    setIsModalOpen(false);
    onRequestClose();
  };

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  if (!isModalOpen) return null;

  const onModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    closeModal();
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-[100]"
        onClick={closeModal}
      ></div>
      <div
        className="fixed z-[101] flex items-center justify-center inset-0"
        onClick={onModalClick}
      >
        <WindowBox
          title={title}
          onClickClose={onModalClick}
          className={"w-full max-w-[800px] h-[80vh] " + className}
        >
          {children}
        </WindowBox>
      </div>
    </>
  );
};

export default Modal;
