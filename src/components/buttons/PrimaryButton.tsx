import { ReactNode, useCallback } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  label?: string;
  callback: () => void;
};

const PrimaryButton = ({ children, className = "", label, callback }: Props) => {
  const handleClick = useCallback(() => {
    callback();
  }, [callback]);

  return (
    <button
      aria-label={label}
      className={`${className} p-[0.8rem] hover-bg`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
