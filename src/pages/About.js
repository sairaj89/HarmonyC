import React, { useState, useEffect, useRef } from 'react';
import NavbarThreeColors from '../components/NavbarThreeColors';
import AboutSVG from '../components/AboutSVG';
import { getColors } from '../components/colormindAPI';
import { addColorToHistory, getPreviousColors } from '../components/colorHistory';
import LoadingBar from 'react-top-loading-bar';
import { SketchPicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import ntc from 'ntc';
import loadingIcon from '../images/sampc.gif';

const rgbArrayToHex = (rgbArray) => {
  const [r, g, b] = rgbArray;
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

function isColorDark(color) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

function getColorName(color) {
  const colorName = ntc.name(color);
  return colorName[1];
}

const isValidHex = (color) => /^#[0-9A-F]{6}$/i.test(color);

const AboutPage = () => {
  const [baseColor, setBaseColor] = useState('#0000FF');
  const [additionalColors, setAdditionalColors] = useState(['#cccccc', '#aaaaaa', '#999999']);
  const [loading, setLoading] = useState(true);
  const [isBaseColorLocked, setIsBaseColorLocked] = useState(false);
  const [isAdditionalColorsLocked, setIsAdditionalColorsLocked] = useState([false, false, false]);
  const [colorHistory, setColorHistory] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isBasePickerVisible, setBasePickerVisible] = useState(false);
  const [isDiamondPickerVisible, setDiamondPickerVisible] = useState(false);
  const [isHarPickerVisible, setHarPickerVisible] = useState(false);
  const [isMonyPickerVisible, setMonyPickerVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const basePickerRef = useRef(null);
  const diamondPickerRef = useRef(null);
  const harPickerRef = useRef(null);
  const monyPickerRef = useRef(null);

  const fetchInitialColors = async () => {
    try {
      setProgress(30);
      // Set the desired mode, e.g., 'triad' or 'analogic'
      const mode = 'triad'; 
      const colors = await getColors(mode); // Pass the mode parameter
      const initialBaseColor = rgbArrayToHex(colors.mainColor);
      const initialAdditionalColors = [
        colors.secondaryColor ? rgbArrayToHex(colors.secondaryColor) : '#cccccc',
        colors.accentColor1 ? rgbArrayToHex(colors.accentColor1) : '#ff00ff',
        colors.accentColor2 ? rgbArrayToHex(colors.accentColor2) : '#00ff00'
      ].filter(color => color);
      setBaseColor(initialBaseColor);
      setAdditionalColors(initialAdditionalColors);
      setColorHistory([[initialBaseColor, ...initialAdditionalColors]]);
      setLoading(false);
      setProgress(100);
    } catch (error) {
      console.error('Error fetching initial colors:', error);
    }
  };

  useEffect(() => {
    fetchInitialColors();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (basePickerRef.current && !basePickerRef.current.contains(event.target)) {
        setBasePickerVisible(false);
      }
      if (diamondPickerRef.current && !diamondPickerRef.current.contains(event.target)) {
        setDiamondPickerVisible(false);
      }
      if (harPickerRef.current && !harPickerRef.current.contains(event.target)) {
        setHarPickerVisible(false);
      }
      if (monyPickerRef.current && !monyPickerRef.current.contains(event.target)) {
        setMonyPickerVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onGenerate = async () => {
    if (isBaseColorLocked && isAdditionalColorsLocked.every(locked => locked)) {
      return; // Do not make the API call if all colors are locked
    }
    try {
      setProgress(30);
      const mode = 'triad';  // Set the desired mode
      const colors = await getColors(mode); // Pass the mode parameter
      const newBaseColor = isBaseColorLocked ? baseColor : rgbArrayToHex(colors.mainColor);
      const newAdditionalColors = additionalColors.map((color, index) => {
        if (index === 0 && colors.secondaryColor) {
          return isAdditionalColorsLocked[index] ? color : rgbArrayToHex(colors.secondaryColor);
        }
        if (index === 1 && colors.accentColor1) {
          return isAdditionalColorsLocked[index] ? color : rgbArrayToHex(colors.accentColor1);
        }
        if (index === 2 && colors.accentColor2) {
          return isAdditionalColorsLocked[index] ? color : rgbArrayToHex(colors.accentColor2);
        }
        return color;
      });
      setBaseColor(newBaseColor);
      setAdditionalColors(newAdditionalColors);
      setColorHistory(addColorToHistory(colorHistory, [newBaseColor, ...newAdditionalColors]));
      setProgress(100);
    } catch (error) {
      console.error('Error generating colors:', error);
    }
  };

  const onBack = () => {
    const { previousColors, newHistory } = getPreviousColors(colorHistory);
    setBaseColor(previousColors[0]);
    setAdditionalColors(previousColors.slice(1));
    setColorHistory(newHistory);
  };

  const handleBaseColorChange = (color) => {
    if (!isBaseColorLocked) {
      setBaseColor(color.hex);
    }
  };

  const handleDiamondColorChange = (color) => {
    if (!isAdditionalColorsLocked[0]) {
      const newAdditionalColors = [...additionalColors];
      newAdditionalColors[0] = color.hex;
      setAdditionalColors(newAdditionalColors);
    }
  };

  const handleHarColorChange = (color) => {
    if (!isAdditionalColorsLocked[1]) {
      const newAdditionalColors = [...additionalColors];
      newAdditionalColors[1] = color.hex;
      setAdditionalColors(newAdditionalColors);
    }
  };

  const handleMonyColorChange = (color) => {
    if (!isAdditionalColorsLocked[2]) {
      const newAdditionalColors = [...additionalColors];
      newAdditionalColors[2] = color.hex;
      setAdditionalColors(newAdditionalColors);
    }
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    setCopySuccess('Copied to clipboard!');
    setTimeout(() => {
      setCopySuccess('');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <NavbarThreeColors
          onGenerate={onGenerate}
          onBack={onBack}
          baseColor={baseColor}
          additionalColors={additionalColors}
          setBaseColor={setBaseColor}
          setAdditionalColors={setAdditionalColors}
          isBaseColorLocked={isBaseColorLocked}
          setIsBaseColorLocked={setIsBaseColorLocked}
          isAdditionalColorsLocked={isAdditionalColorsLocked}
          setIsAdditionalColorsLocked={setIsAdditionalColorsLocked}
          isBackButtonDisabled={colorHistory.length <= 1}
          loading={loading}
        />
        <div className="flex-grow relative flex items-center justify-center">
          <img src={loadingIcon} alt="Loading..." style={{ width: '265px', height: '265px', marginLeft: '220px' }} />
        </div>
      </div>
    );
  }

  const isBackButtonDisabled = colorHistory.length <= 1;
  const diamondColor = additionalColors[0];
  const harColor = additionalColors[1];
  const monyColor = additionalColors[2];

  return (
    <div className="flex flex-col h-screen">
      <LoadingBar color="#f11946" progress={progress} onLoaderFinished={() => setProgress(0)} />
      <NavbarThreeColors
        onGenerate={onGenerate}
        onBack={onBack}
        baseColor={baseColor}
        additionalColors={additionalColors}
        setBaseColor={setBaseColor}
        setAdditionalColors={setAdditionalColors}
        isBaseColorLocked={isBaseColorLocked}
        setIsBaseColorLocked={setIsBaseColorLocked}
        isAdditionalColorsLocked={isAdditionalColorsLocked}
        setIsAdditionalColorsLocked={setIsAdditionalColorsLocked}
        isBackButtonDisabled={isBackButtonDisabled}
        loading={loading}
      />
      <div className="flex-grow relative">
        {/* About section */}
        <section
          className="flex items-center justify-center svg-center"
          style={{ backgroundColor: baseColor, paddingTop: '50px', minHeight: '100vh' }} // Adjusted to 100vh
        >
          <AboutSVG baseColor={baseColor} diamondColor={diamondColor} harColor={harColor} monyColor={monyColor} />
        </section>
        {/* Existing color picker section */}
        <section
          className="h-full flex items-center justify-center svg-center relative"
          style={{ position: 'relative' }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: diamondColor,
              opacity: 0.8,
              zIndex: 0,
            }}
          ></div>
          <div className="flex w-[825px] h-[425px] relative z-10 custom-shadow" style={{ borderRadius: '25px' }}>
            <div
              className="w-1/4 h-full flex items-center justify-center relative color-container"
              style={{
                background: baseColor,
                borderTopLeftRadius: '25px',
                borderBottomLeftRadius: '25px',
              }}
            >
              <div className="absolute bottom-28 text-center">
                <div className="flex flex-col items-center">
                  <div className="icon-container mb-2" style={{ color: isColorDark(baseColor) ? 'white' : 'black' }}>
                    <FontAwesomeIcon 
                      icon={faCopy} 
                      onClick={() => copyToClipboard(baseColor)}
                      className="icon"
                      title="Copy"
                    />
                    <FontAwesomeIcon 
                      icon={isBaseColorLocked ? faLock : faLockOpen} 
                      onClick={() => setIsBaseColorLocked(!isBaseColorLocked)}
                      className="icon"
                      title={isBaseColorLocked ? "Unlock" : "Lock"}
                    />
                  </div>
                  <button
                    className="text-2xl font-bold vertical-spacing cursor-pointer"
                    style={{ color: isColorDark(baseColor) ? 'white' : 'black', textTransform: 'uppercase', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', padding: '4px 8px' }}
                    onClick={() => setBasePickerVisible(!isBasePickerVisible)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {baseColor}
                  </button>
                  <p className="text-1xl font-semibold" style={{ color: isColorDark(baseColor) ? 'white' : 'black' }}>{getColorName(baseColor)}</p>
                  {isBasePickerVisible && (
                    <div ref={basePickerRef} style={{ position: 'absolute', top: '30%', left: 'calc(50% + 85px)', transform: 'translate(0, -50%)', zIndex: '10', background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                      <SketchPicker 
                        color={baseColor} 
                        onChange={handleBaseColorChange} 
                        width="200px" 
                        styles={{ default: { picker: { boxShadow: 'none', border: '1px solid #d3d3d3', borderRadius: '8px' } } }}
                      />
                      <button
                        onClick={() => copyToClipboard(baseColor)}
                        className="copy-button"
                        style={{ marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <FontAwesomeIcon icon={faCopy} /> Copy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="w-1/4 h-full flex items-center justify-center relative color-container"
              style={{
                background: diamondColor,
              }}
            >
              <div className="absolute bottom-28 text-center">
                <div className="flex flex-col items-center">
                  <div className="icon-container mb-2" style={{ color: isColorDark(diamondColor) ? 'white' : 'black' }}>
                    <FontAwesomeIcon 
                      icon={faCopy} 
                      onClick={() => copyToClipboard(diamondColor)}
                      className="icon"
                      title="Copy"
                    />
                    <FontAwesomeIcon 
                      icon={isAdditionalColorsLocked[0] ? faLock : faLockOpen} 
                      onClick={() => setIsAdditionalColorsLocked([!isAdditionalColorsLocked[0], isAdditionalColorsLocked[1], isAdditionalColorsLocked[2]])}
                      className="icon"
                      title={isAdditionalColorsLocked[0] ? "Unlock" : "Lock"}
                    />
                  </div>
                  <button
                    className="text-2xl font-bold vertical-spacing cursor-pointer"
                    style={{ color: isColorDark(diamondColor) ? 'white' : 'black', textTransform: 'uppercase', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', padding: '4px 8px' }}
                    onClick={() => setDiamondPickerVisible(!isDiamondPickerVisible)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {diamondColor}
                  </button>
                  <p className="text-1xl font-semibold" style={{ color: isColorDark(diamondColor) ? 'white' : 'black' }}>{getColorName(diamondColor)}</p>
                  {isDiamondPickerVisible && (
                    <div ref={diamondPickerRef} style={{ position: 'absolute', top: '30%', left: 'calc(50% + 85px)', transform: 'translate(0, -50%)', zIndex: '10', background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                      <SketchPicker 
                        color={diamondColor} 
                        onChange={handleDiamondColorChange} 
                        width="200px" 
                        styles={{ default: { picker: { boxShadow: 'none', border: '1px solid #d3d3d3', borderRadius: '8px' } } }}
                      />
                      <button
                        onClick={() => copyToClipboard(diamondColor)}
                        className="copy-button"
                        style={{ marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <FontAwesomeIcon icon={faCopy} /> Copy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="w-1/4 h-full flex items-center justify-center relative color-container"
              style={{
                background: harColor,
              }}
            >
              <div className="absolute bottom-28 text-center">
                <div className="flex flex-col items-center">
                  <div className="icon-container mb-2" style={{ color: isColorDark(harColor) ? 'white' : 'black' }}>
                    <FontAwesomeIcon 
                      icon={faCopy} 
                      onClick={() => copyToClipboard(harColor)}
                      className="icon"
                      title="Copy"
                    />
                    <FontAwesomeIcon 
                      icon={isAdditionalColorsLocked[1] ? faLock : faLockOpen} 
                      onClick={() => setIsAdditionalColorsLocked([isAdditionalColorsLocked[0], !isAdditionalColorsLocked[1], isAdditionalColorsLocked[2]])}
                      className="icon"
                      title={isAdditionalColorsLocked[1] ? "Unlock" : "Lock"}
                    />
                  </div>
                  <button
                    className="text-2xl font-bold vertical-spacing cursor-pointer"
                    style={{ color: isColorDark(harColor) ? 'white' : 'black', textTransform: 'uppercase', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', padding: '4px 8px' }}
                    onClick={() => setHarPickerVisible(!isHarPickerVisible)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {harColor}
                  </button>
                  <p className="text-1xl font-semibold" style={{ color: isColorDark(harColor) ? 'white' : 'black' }}>{getColorName(harColor)}</p>
                  {isHarPickerVisible && (
                    <div ref={harPickerRef} style={{ position: 'absolute', top: '30%', left: 'calc(50% + 85px)', transform: 'translate(0, -50%)', zIndex: '10', background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                      <SketchPicker 
                        color={harColor} 
                        onChange={handleHarColorChange} 
                        width="200px" 
                        styles={{ default: { picker: { boxShadow: 'none', border: '1px solid #d3d3d3', borderRadius: '8px' } } }}
                      />
                      <button
                        onClick={() => copyToClipboard(harColor)}
                        className="copy-button"
                        style={{ marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <FontAwesomeIcon icon={faCopy} /> Copy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className="w-1/4 h-full flex items-center justify-center relative color-container"
              style={{
                background: monyColor,
                borderTopRightRadius: '25px',
                borderBottomRightRadius: '25px',
              }}
            >
              <div className="absolute bottom-28 text-center">
                <div className="flex flex-col items-center">
                  <div className="icon-container mb-2" style={{ color: isColorDark(monyColor) ? 'white' : 'black' }}>
                    <FontAwesomeIcon 
                      icon={faCopy} 
                      onClick={() => copyToClipboard(monyColor)}
                      className="icon"
                      title="Copy"
                    />
                    <FontAwesomeIcon 
                      icon={isAdditionalColorsLocked[2] ? faLock : faLockOpen} 
                      onClick={() => setIsAdditionalColorsLocked([isAdditionalColorsLocked[0], isAdditionalColorsLocked[1], !isAdditionalColorsLocked[2]])}
                      className="icon"
                      title={isAdditionalColorsLocked[2] ? "Unlock" : "Lock"}
                    />
                  </div>
                  <button
                    className="text-2xl font-bold vertical-spacing cursor-pointer"
                    style={{ color: isColorDark(monyColor) ? 'white' : 'black', textTransform: 'uppercase', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', padding: '4px 8px' }}
                    onClick={() => setMonyPickerVisible(!isMonyPickerVisible)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {monyColor}
                  </button>
                  <p className="text-1xl font-semibold" style={{ color: isColorDark(monyColor) ? 'white' : 'black' }}>{getColorName(monyColor)}</p>
                  {isMonyPickerVisible && (
                    <div ref={monyPickerRef} style={{ position: 'absolute', top: '30%', left: 'calc(50% + 85px)', transform: 'translate(0, -50%)', zIndex: '10', background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                      <SketchPicker 
                        color={monyColor} 
                        onChange={handleMonyColorChange} 
                        width="200px" 
                        styles={{ default: { picker: { boxShadow: 'none', border: '1px solid #d3d3d3', borderRadius: '8px' } } }}
                      />
                      <button
                        onClick={() => copyToClipboard(monyColor)}
                        className="copy-button"
                        style={{ marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <FontAwesomeIcon icon={faCopy} /> Copy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {copySuccess && <div className="copy-success highlighted-section">{copySuccess}</div>}
    </div>
  );
};

export default AboutPage;
