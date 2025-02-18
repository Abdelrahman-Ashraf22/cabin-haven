import { useRef } from "react";
import { useEffect } from "react";

// if the click is outside the side bar then close the side bar
export function useOutsideClickSidebar(handler, ...refs) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (
          refs.every((ref) => ref.current && !ref.current.contains(e.target))
        ) {
          handler();
        }
      }
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    },
    [handler, refs]
  );

  return ref;
}
