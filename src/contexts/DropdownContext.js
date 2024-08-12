import React, { createContext, useState } from 'react';

const DropdownContext = createContext();

const DropdownProvider = ({ children }) => {
  const [brandOpen, setBrandOpen] = useState(true);
  const [websiteOpen, setWebsiteOpen] = useState(false);
  const [illustrationOpen, setIllustrationOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('2 colors');

  const value = {
    brandOpen,
    setBrandOpen,
    websiteOpen,
    setWebsiteOpen,
    illustrationOpen,
    setIllustrationOpen,
    selectedOption,
    setSelectedOption,
  };

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  );
};

export { DropdownContext, DropdownProvider };
