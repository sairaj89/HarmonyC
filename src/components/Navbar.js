import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from '@heroicons/react/outline';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ onGenerate, baseColor, additionalColors = [], setBaseColor, setAdditionalColors, baseLocked, setBaseLocked, diamondLocked, setDiamondLocked, extraLocked, setExtraLocked, fourthLocked, setFourthLocked }) => {
  const [openPickerIndex, setOpenPickerIndex] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (index, color) => {
    if (index === 0) {
      if (!baseLocked) setBaseColor(color);
    } else {
      setAdditionalColors((prevColors) => {
        const newColors = [...prevColors];
        if (index === 1 && !diamondLocked) newColors[index - 1] = color;
        if (index === 2 && !extraLocked) newColors[index - 1] = color;
        if (index === 3 && !fourthLocked) newColors[index - 1] = color;
        return newColors;
      });
    }
  };

  const handlePickerToggle = (index) => {
    if (openPickerIndex === index) {
      setOpenPickerIndex(null);
      setSelectedColorIndex(null);
    } else {
      setOpenPickerIndex(index);
      setSelectedColorIndex(index);
    }
    setShowPicker(false);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleBack = () => {
    console.log('Back button clicked');
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest('.relative')) {
      setOpenPickerIndex(null);
      setSelectedColorIndex(null);
    }
  };

  useEffect(() => {
    if (openPickerIndex !== null) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [openPickerIndex]);

  return (
    <header className="flex items-center h-16 px-4 shadow fixed top-0 w-full z-20" style={{ backgroundColor: '#07252d' }}>
      <div className="flex-grow"></div>
      <div className="flex items-center space-x-4">
        <ColorSelector
          color={baseColor}
          onChange={(color) => handleColorChange(0, color)}
          index={0}
          isOpen={openPickerIndex === 0}
          isSelected={selectedColorIndex === 0}
          onToggle={() => handlePickerToggle(0)}
          showPicker={showPicker}
          togglePicker={togglePicker}
          isLocked={baseLocked}
          toggleLock={() => setBaseLocked(!baseLocked)}
        />
        {additionalColors.map((color, index) => (
          <ColorSelector
            key={index}
            color={color}
            onChange={(color) => handleColorChange(index + 1, color)}
            index={index + 1}
            isOpen={openPickerIndex === index + 1}
            isSelected={selectedColorIndex === index + 1}
            onToggle={() => handlePickerToggle(index + 1)}
            showPicker={showPicker}
            togglePicker={togglePicker}
            isLocked={index === 0 ? diamondLocked : index === 1 ? extraLocked : fourthLocked}
            toggleLock={() => {
              if (index === 0) setDiamondLocked(!diamondLocked);
              if (index === 1) setExtraLocked(!extraLocked);
              if (index === 2) setFourthLocked(!fourthLocked);
            }}
          />
        ))}
        <div className="border-l border-gray-300 h-8 mx-4"></div>
        <button onClick={handleBack} className="back-button">
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <button onClick={onGenerate} className="ml-4 generate-button">
          Generate
        </button>
      </div>
    </header>
  );
};

const ColorSelector = ({ color, onChange, index, isOpen, onToggle, isSelected, showPicker, togglePicker, isLocked, toggleLock }) => {
  const [currentColor, setCurrentColor] = useState(color);

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  const handleChange = (color) => {
    setCurrentColor(color.hex);
    onChange(color.hex);
  };

  return (
    <div className="relative">
      <button
        className={`w-8 h-8 rounded-full border-0 cursor-pointer ${isLocked ? 'bg-opacity-50' : ''} color-button ${isSelected ? 'selected' : ''}`}
        style={{ backgroundColor: currentColor }}
        onClick={onToggle}
      >
        {isLocked && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 bg-opacity-75 lock-icon">
            <FontAwesomeIcon icon={faLock} className="text-white" />
          </div>
        )}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white p-3 rounded shadow-md w-48 border border-gray-300 menu-button">
          <button
            className="flex items-center mb-2 text-gray-700 hover:bg-gray-100 p-2 rounded"
            onClick={() => {
              toggleLock();
              onToggle();
            }}
          >
            {isLocked ? (
              <FontAwesomeIcon icon={faLock} className="h-5 w-5 mr-2" />
            ) : (
              <FontAwesomeIcon icon={faUnlock} className="h-5 w-5 mr-2" />
            )}
            <span>{isLocked ? 'Unlock' : 'Lock'}</span>
          </button>
          <hr className="border-t border-gray-300 my-2" />
          <button
            className="flex items-center mb-2 text-gray-700 hover:bg-gray-100 p-2 rounded menu-button"
            onClick={() => {
              navigator.clipboard.writeText(currentColor);
              onToggle();
            }}
          >
            <ClipboardIcon className="h-5 w-5 mr-2" />
            <span>Copy code</span>
          </button>
          <hr className="border-t border-gray-300 my-2" />
          <div className="relative">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => handleChange({ hex: e.target.value })}
              className="w-full h-8 cursor-pointer border border-gray-300 rounded"
            />
            <input
              type="text"
              value={currentColor}
              readOnly
              className="mt-2 p-1 border rounded w-full text-gray-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
