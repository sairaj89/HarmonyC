import React, { useState, useEffect, useRef } from 'react';
import { ClipboardIcon } from '@heroicons/react/outline';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';

const NavbarOneColor = ({
  onGenerate,
  onBack,
  baseColor,
  additionalColors,
  setBaseColor,
  setAdditionalColors,
  isBaseColorLocked,
  setIsBaseColorLocked,
  isAdditionalColorLocked,
  setIsAdditionalColorLocked,
  isBackButtonDisabled,
  loading
}) => {
  const [openPickerIndex, setOpenPickerIndex] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const basePickerRef = useRef(null);
  const diamondPickerRef = useRef(null);

  const handleColorChange = (index, color) => {
    if (index === 0) {
      setBaseColor(color);
    } else {
      setAdditionalColors((prevColors) => {
        const newColors = [...prevColors];
        newColors[index - 1] = color;
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

  const handleOutsideClick = (event) => {
    if (basePickerRef.current && !basePickerRef.current.contains(event.target)) {
      setOpenPickerIndex(null);
      setSelectedColorIndex(null);
    }
    if (diamondPickerRef.current && !diamondPickerRef.current.contains(event.target)) {
      setOpenPickerIndex(null);
      setSelectedColorIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const toggleLock = (index) => {
    if (index === 0) {
      setIsBaseColorLocked(!isBaseColorLocked);
    } else {
      setIsAdditionalColorLocked((prevLocks) => {
        const newLocks = [...prevLocks];
        newLocks[index - 1] = !newLocks[index - 1];
        return newLocks;
      });
    }
  };

  return (
    <header className="flex items-center h-16 px-4 shadow fixed top-0 w-full z-20" style={{ backgroundColor: '#07252d' }}>
      <div className="flex-grow"></div>
      <div className="flex items-center space-x-4">
        <ColorSelector
          color={loading ? '#FFFFFF' : baseColor}
          onChange={(color) => handleColorChange(0, color)}
          index={0}
          isOpen={openPickerIndex === 0}
          isSelected={selectedColorIndex === 0}
          onToggle={() => handlePickerToggle(0)}
          showPicker={showPicker}
          togglePicker={togglePicker}
          isLocked={isBaseColorLocked}
          toggleLock={() => toggleLock(0)}
          pickerRef={basePickerRef}
        />
        {additionalColors.map((color, index) => (
          <ColorSelector
            key={index}
            color={loading ? '#FFFFFF' : color}
            onChange={(color) => handleColorChange(index + 1, color)}
            index={index + 1}
            isOpen={openPickerIndex === index + 1}
            isSelected={selectedColorIndex === index + 1}
            onToggle={() => handlePickerToggle(index + 1)}
            showPicker={showPicker}
            togglePicker={togglePicker}
            isLocked={isAdditionalColorLocked[index]}
            toggleLock={() => toggleLock(index + 1)}
            pickerRef={diamondPickerRef}
          />
        ))}
        <div className="border-l border-gray-300 h-8 mx-4"></div>
        <button onClick={onBack} className={`back-button ${isBackButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isBackButtonDisabled}>
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <button onClick={onGenerate} className="ml-4 generate-button">
          Generate
        </button>
      </div>
    </header>
  );
};

const ColorSelector = ({
  color,
  onChange,
  index,
  isOpen,
  onToggle,
  isSelected,
  showPicker,
  togglePicker,
  isLocked,
  toggleLock,
  pickerRef
}) => {
  const [lockText, setLockText] = useState('Lock');

  useEffect(() => {
    setLockText(isLocked ? 'Unlock' : 'Lock');
  }, [isLocked]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
  };

  const handleChange = (event) => {
    if (!isLocked) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="relative">
      <button
        className={`w-8 h-8 rounded-full border-0 cursor-pointer ${isLocked ? 'bg-opacity-50' : ''} color-button ${isSelected ? 'selected' : ''}`}
        style={{ backgroundColor: color }}
        onClick={onToggle}
      >
        {isLocked && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 bg-opacity-75 lock-icon">
            <FontAwesomeIcon icon={faLock} className="text-white" />
          </div>
        )}
      </button>
      {isOpen && (
        <div ref={pickerRef} className="absolute z-10 mt-2 bg-white p-3 rounded shadow-md w-48 border border-gray-300 menu-button">
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
            <span>{lockText}</span>
          </button>
          <hr className="border-t border-gray-300 my-2" />
          <button
            className="flex items-center mb-2 text-gray-700 hover:bg-gray-100 p-2 rounded menu-button"
            onClick={() => {
              copyToClipboard();
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
              value={color}
              onChange={handleChange}
              className="w-full h-8 cursor-pointer border border-gray-300 rounded"
            />
            <input
              type="text"
              value={color}
              readOnly
              className="mt-2 p-1 border rounded w-full text-gray-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarOneColor;
