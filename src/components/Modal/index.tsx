import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import WindowBox from "../WindowBox";

type Props = {
  isOpen: boolean;
  className?: string;
  onRequestClose: (status: boolean) => void;
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
  const onClose = () => {
    onRequestClose(false);
  };
  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />
          </TransitionChild>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <WindowBox
              title={title}
              onClickClose={onClose}
              className={"w-full max-w-[800px] h-[80vh] " + className}
            >
              {children}
            </WindowBox>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
