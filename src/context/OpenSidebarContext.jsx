import { createContext, useState, useRef } from "react";
import { useOutsideClickSidebar } from "../hooks/useOutsideClickSidebar";

const OpenSidebarContext = createContext();

function OpenSidebarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarRef = useRef(null);
  const headerRef = useRef(null);

  // If we click outside the side-bar it will closes
  useOutsideClickSidebar(() => setIsSidebarOpen(false), sidebarRef, headerRef);

  // The toggle function to handle the useState hook
  function toggleSidebar() {
    setIsSidebarOpen((isSidebarOpen) => !isSidebarOpen);
  }

  return (
    <OpenSidebarContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        sidebarRef,
        headerRef,
      }}
    >
      {children}
    </OpenSidebarContext.Provider>
  );
}

export { OpenSidebarContext, OpenSidebarProvider };
