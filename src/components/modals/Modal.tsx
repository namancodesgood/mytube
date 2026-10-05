import { FC, ReactNode, useEffect } from "react";

type Props = {
  children?: ReactNode;
  onClose: () => void;
};

const Modal: FC<Props> = ({ children, onClose }) => {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <section
      role="dialog"
      aria-modal="true"
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center p-[1.6rem]"
    >
      {children}
    </section>
  );
};

export default Modal;
