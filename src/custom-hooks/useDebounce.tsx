import { useRef } from "react";

export const useDebounce = (
  fn: (event: React.ChangeEvent<HTMLInputElement>) => void,
  delay: number = 500
) => {
  // A ref, so a re-render mid-typing can't orphan a pending call (each one costs a search)
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  return function (event: React.ChangeEvent<HTMLInputElement>) {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => fn(event), delay);
  };
};
