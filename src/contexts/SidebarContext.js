import React, { createContext, useState, useContext, useEffect } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [brandOpen, setBrandOpen] = useState(true);
  const [websiteOpen, setWebsiteOpen] = useState(false);
  const [illustrationOpen, setIllustrationOpen] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  return (
    <SidebarContext.Provider value={{ 
        brandOpen, setBrandOpen, 
        websiteOpen, setWebsiteOpen, 
        illustrationOpen, setIllustrationOpen, 
        isFirstRender
      }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
