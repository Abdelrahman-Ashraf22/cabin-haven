import { useRef } from "react";
import { useEffect } from "react";

// This custom hook is to detect the click if it is outside to close the menu or the Modal
export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }
      document.addEventListener("click", handleClick, listenCapturing);
      return () => document.removeEventListener("click", handleClick, true);
    },
    [handler, listenCapturing]
  );

  return ref;
}
