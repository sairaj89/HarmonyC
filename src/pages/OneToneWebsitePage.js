import React, { useState, useEffect, useRef } from 'react';
import NavbarWebsiteOneTone from '../components/NavbarWebsiteOneTone';
import { SketchPicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import WebsiteOneSVG from '../components/Website1SVG';
import WebsiteTwoSVG from '../components/Website2SVG';
import MinimalistWeb1 from '../components/MinimalistWeb1';
import MinimalistWeb2 from '../components/MinimalistWeb2';
import MinimalistWeb3 from '../components/MinimalistWeb3';
import ntc from 'ntc';
import { addColorToHistory, getPreviousColors } from '../components/colorHistory';
import loadingIcon from '../images/sampc.gif';
import LoadingBar from 'react-top-loading-bar';
import { getColors } from '../components/colormindAPI'; // Import the function from colormindAPI.js

const rgbArrayToHex = (rgbArray) => {
  const [r, g, b] = rgbArray;
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

function isColorDark(color) {
  if (typeof color !== 'string') return false; // Ensure color is a string
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

function getColorName(color) {
  if (typeof color !== 'string') return ''; // Ensure color is a string
  const colorName = ntc.name(color);
  return colorName[1];
}

const OneToneWebsitePage = () => {
  const [baseColor, setBaseColor] = useState('#0000FF');
  const [additionalColors, setAdditionalColors] = useState(['#cccccc', '#ff00ff']);
  const [sidebarLocked, setSidebarLocked] = useState(false);
  const [isBasePickerVisible, setBasePickerVisible] = useState(false);
  const [isDiamondPickerVisible, setDiamondPickerVisible] = useState(false);
  const [isHarPickerVisible, setHarPickerVisible] = useState(false);
  const [baseLocked, setBaseLocked] = useState(false);
  const [diamondLocked, setDiamondLocked] = useState(false);
  const [harLocked, setHarLocked] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [loading, setLoading] = useState(true); // Initial loading state
  const [colorHistory, setColorHistory] = useState([]);
  const loadingBarRef = useRef(null);

  const basePickerRef = useRef(null);
  const diamondPickerRef = useRef(null);
  const harPickerRef = useRef(null);

  const fetchColors = async () => {
    try {
      loadingBarRef.current.continuousStart(); // Start the loading bar
      const colors = await getColors('onetonemode'); // Call the API using the existing function
      const newBaseColor = rgbArrayToHex(colors.mainColor);
      const newAdditionalColors = [rgbArrayToHex(colors.secondaryColor), rgbArrayToHex(colors.accentColor1)];
      setBaseColor(newBaseColor);
      setAdditionalColors(newAdditionalColors);
      setColorHistory([[newBaseColor, ...newAdditionalColors]]);
      setLoading(false);
      loadingBarRef.current.complete(); // Complete the loading bar
    } catch (error) {
      console.error('Error fetching colors:', error);
      setLoading(false);
      loadingBarRef.current.complete(); // Complete the loading bar even if there's an error
    }
  };

  useEffect(() => {
    fetchColors();
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBaseColorChange = (color) => {
    if (!baseLocked) {
      setBaseColor(color.hex);
    }
  };

  const handleDiamondColorChange = (color) => {
    if (!diamondLocked) {
      setAdditionalColors([color.hex, additionalColors[1]]);
    }
  };

  const handleHarColorChange = (color) => {
    if (!harLocked) {
      setAdditionalColors([additionalColors[0], color.hex]);
    }
  };

  const copyToClipboard = (color) => {
    if (typeof color !== 'string') return; // Ensure color is a string
    navigator.clipboard.writeText(color);
    setCopySuccess('Copied to clipboard!');
    setTimeout(() => {
      setCopySuccess('');
    }, 2000);
  };

  const onGenerate = async () => {
    if (baseLocked && diamondLocked && harLocked) return;

    loadingBarRef.current.continuousStart(); // Start the loading bar
    try {
      const colors = await getColors('onetonemode'); // Call the API using the existing function
      const newBaseColor = baseLocked ? baseColor : rgbArrayToHex(colors.mainColor);
      const newAdditionalColors = [
        diamondLocked ? additionalColors[0] : rgbArrayToHex(colors.secondaryColor),
        harLocked ? additionalColors[1] : rgbArrayToHex(colors.accentColor1)
      ];
      setBaseColor(newBaseColor);
      setAdditionalColors(newAdditionalColors);
      setColorHistory(addColorToHistory(colorHistory, [newBaseColor, ...newAdditionalColors]));
      loadingBarRef.current.complete(); // Complete the loading bar
    } catch (error) {
      console.error('Error generating colors:', error);
      loadingBarRef.current.complete(); // Complete the loading bar even if there's an error
    }
  };

  const onBack = () => {
    const { previousColors, newHistory } = getPreviousColors(colorHistory);
    setBaseColor(previousColors[0]);
    setAdditionalColors(previousColors.slice(1));
    setColorHistory(newHistory);
  };

  const diamondColor = additionalColors[0];
  const harColor = additionalColors[1];

  const baseColorName = getColorName(baseColor);
  const diamondColorName = getColorName(diamondColor);
  const harColorName = getColorName(harColor);

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <NavbarWebsiteOneTone
          onGenerate={onGenerate}
          onBack={onBack}
          baseColor={baseColor}
          additionalColors={additionalColors}
          setBaseColor={setBaseColor}
          setAdditionalColors={setAdditionalColors}
          isBaseColorLocked={baseLocked}
          setIsBaseColorLocked={setBaseLocked}
          isDiamondColorLocked={diamondLocked}
          setIsDiamondColorLocked={setDiamondLocked}
          isHarColorLocked={harLocked}
          setIsHarColorLocked={setHarLocked}
          isBackButtonDisabled={colorHistory.length <= 1}
          loading={loading}
        />
        <LoadingBar color="#f11946" ref={loadingBarRef} /> {/* Add the loading bar here */}
        <div className="flex-grow relative flex items-center justify-center">
          <img src={loadingIcon} alt="Loading..." style={{ width: '265px', height: '265px', marginLeft: '220px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${sidebarLocked ? 'sidebar-locked' : ''}`}>
      <NavbarWebsiteOneTone
        onGenerate={onGenerate}
        onBack={onBack}
        baseColor={baseColor}
        additionalColors={additionalColors}
        setBaseColor={setBaseColor}
        setAdditionalColors={setAdditionalColors}
        isBaseColorLocked={baseLocked}
        setIsBaseColorLocked={setBaseLocked}
        isDiamondColorLocked={diamondLocked}
        setIsDiamondColorLocked={setDiamondLocked}
        isHarColorLocked={harLocked}
        setIsHarColorLocked={setHarLocked}
        isBackButtonDisabled={colorHistory.length <= 1}
        loading={loading}
      />
      <LoadingBar color="#f11946" ref={loadingBarRef} /> {/* Add the loading bar here */}
      <div className="flex-grow relative">
        <section
          style={{
            background: baseColor,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '80px 0',
            marginLeft: sidebarLocked ? '250px' : '0',
            transition: 'margin-left 0.3s',
            overflow: 'hidden',
          }}
        >
          <div
            className="svg-center"
            style={{
              marginBottom: '40px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              padding: '20px 0',
            }}
          >
            <WebsiteOneSVG className="svg-drop-shadow" baseColor={baseColor} diamondColor={diamondColor} harColor={harColor} />
          </div>
          <div
            className="svg-center"
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              padding: '450px 0',
              paddingBottom: '500px',
            }}
          >
            <WebsiteTwoSVG className="svg-drop-shadow" baseColor={baseColor} diamondColor={diamondColor} harColor={harColor} />
          </div>
          <div
            className="svg-center"
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              padding: '20px 0',
              paddingTop: '100px',
            }}
          >
            <img
              src={require('../images/keanu.png')}
              alt="Background"
              style={{
                position: 'absolute',
                zIndex: '1',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                position: 'relative',
                zIndex: '2',
              }}
            >
              <MinimalistWeb1 className="svg-drop-shadow" baseColor={baseColor} diamondColor={diamondColor} harColor={harColor} />
            </div>
          </div>
          <div
            className="svg-center"
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '0',
              padding: '0',
            }}
          >
            <MinimalistWeb2 className="svg-drop-shadow" baseColor={baseColor} diamondColor={diamondColor} harColor={harColor} />
          </div>
          <div
            className="svg-center"
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '-116px',
              padding: '0',
            }}
          >
            <MinimalistWeb3 className="svg-drop-shadow" baseColor={baseColor} diamondColor={diamondColor} harColor={harColor} />
          </div>
        </section>
        <section
          className="h-screen flex items-center justify-center svg-center relative"
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
              className="w-1/2 h-full flex items-center justify-center relative color-container"
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
                      icon={baseLocked ? faLock : faLockOpen}
                      onClick={() => setBaseLocked(!baseLocked)}
                      className="icon"
                      title={baseLocked ? "Unlock" : "Lock"}
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
                  <p className="text-1xl font-semibold" style={{ color: isColorDark(baseColor) ? 'white' : 'black' }}>{baseColorName}</p>
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
              className="w-1/2 h-full flex items-center justify-center relative color-container"
              style={{
                background: diamondColor
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
                      icon={diamondLocked ? faLock : faLockOpen}
                      onClick={() => setDiamondLocked(!diamondLocked)}
                      className="icon"
                      title={diamondLocked ? "Unlock" : "Lock"}
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
                  <p className="text-1xl font-semibold" style={{ color: isColorDark(diamondColor) ? 'white' : 'black' }}>{diamondColorName}</p>
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
              className="w-1/2 h-full flex items-center justify-center relative color-container"
              style={{
                background: harColor, // Changed from diamondColor to harColor
                borderTopRightRadius: '25px',
                borderBottomRightRadius: '25px',
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
                      icon={harLocked ? faLock : faLockOpen}
                      onClick={() => setHarLocked(!harLocked)}
                      className="icon"
                      title={harLocked ? "Unlock" : "Lock"}
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
                  <p className="text-1xl font-semibold" style={{ color: isColorDark(harColor) ? 'white' : 'black' }}>{harColorName}</p>
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
          </div>
        </section>
      </div>
      {copySuccess && <div className="copy-success highlighted-section">{copySuccess}</div>}
    </div>
  );
};

export default OneToneWebsitePage;
