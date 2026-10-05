import { FC, ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

const Modal: FC<Props> = ({ children }) => {
  return (
    <section className="bg-black bg-opacity-50 fixed inset-0 z-50 flex justify-center items-center w-full h-full">
      {children}
    </section>
  );
};

export default Modal;
