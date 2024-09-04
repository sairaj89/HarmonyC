import React, { useState, useEffect, useRef } from 'react';
import NavbarThreeColors from '../components/NavbarThreeColors';
import YourSVGThreeColors from '../components/YourSVGThreeColors';
import NewWaveSVGThreeColors from '../components/NewWaveSVGThreeColors';
import BrandSVGThreeColors from '../components/BrandSVGThreeColorsPage';
import Harmony3DText from '../components/Harmony3DText';
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

const ThreeColorsPage = () => {
  const [baseColor, setBaseColor] = useState('#0000FF');
  const [additionalColors, setAdditionalColors] = useState(['#cccccc', '#ff00ff', '#00ff00']);
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
      const colors = await getColors();
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
      const colors = await getColors();
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
        <section
          className="h-screen flex items-center justify-center center-container"
          style={{ backgroundColor: baseColor }}
        >
          <div className="flex flex-col items-center relative">
            <div className="flex items-center mb-8">
              <svg
                width="50px"
                height="50px"
                viewBox="0 0 369 372"
                fill={diamondColor}
              >
                <path d="M146.946381,342.088318 C121.311363,327.291168 96.007187,312.652557 70.704651,298.011078 C65.344177,294.909210 59.977695,
                291.817444 54.634953,288.685272 C40.996742,280.689819 34.876694,268.747467 34.960308,252.979004 C35.163559,214.648254 35.008472,
                176.315613 35.000916,137.983734 C34.999538,130.984024 35.074577,123.983734 35.007553,116.984741 C34.853149,100.861618 41.737186,
                89.036148 55.903477,81.112503 C72.401558,71.884605 88.666344,62.238926 105.013763,52.742516 C129.666000,38.421741 153.994354,
                23.501358 179.085342,9.997072 C190.282608,3.970563 202.505432,6.024269 213.715073,12.541935 C237.122452,26.151762 260.630859,
                39.587666 284.074310,53.135647 C300.469086,62.610191 316.770721,72.247009 333.214508,81.635269 C347.567291,89.829720 354.164368,
                101.998024 354.079865,118.527588 C353.848969,163.692200 353.982941,208.858780 354.011108,254.024551 C354.020721,269.400818 347.577576,
                 280.930664 334.267120,288.846710 C314.820953,300.411804 295.639709,312.423889 276.146820,323.908112 C266.827454,329.398682 256.983063,
                 333.989990 247.499481,339.211975 C236.374817,345.337585 225.338013,351.626801 214.346329,357.988861 C200.018585,366.281921 186.072556,
                 365.162720 172.213364,356.813873 C163.968307,351.846985 155.593979,347.094696 146.946381,342.088318 Z" />
              </svg>
              <div style={{ width: '10px' }}></div>
              <svg
                width="180"
                height="80"
                viewBox="0 0 252.78 56.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: 'translateY(4.8px)' }}
              >
                <g
                  id="svgGroup"
                  strokeLinecap="round"
                  fillRule="evenodd"
                  fontSize="9pt"
                  stroke="none"
                >
                  {/* "Har" part */}
                  <path
                    d="M 28.86 0 L 34.26 0 L 34.26 42.6 L 28.86 42.6 L 28.86 23.22 L 5.4 23.22 L 5.4 42.6 L 0 42.6 L 0 0 L 5.4 0 L 5.4 18.42 L 28.86 18.42 L 28.86 0 Z"
                    style={{ fill: harColor }}
                  />
                  <path
                    d="M 63.12 25.08 L 63.12 22.8 A 9.676 9.676 0 0 0 62.841 20.41 A 6.745 6.745 0 0 0 60.96 17.13 Q 58.8 15.06 54.84 15.06 Q 52.26 15.06 49.89 15.99 Q 47.594 16.891 45.045 18.552 A 37.522 37.522 0 0 0 44.88 18.66 L 42.96 14.94 A 27.932 27.932 0 0 1 46.403 12.91 A 22.732 22.732 0 0 1 49.08 11.79 Q 52.14 10.74 55.44 10.74 Q 61.259 10.74 64.708 13.872 A 11.139 11.139 0 0 1 64.92 14.07 Q 68.4 17.4 68.4 23.34 L 68.4 36.6 Q 68.4 37.56 68.79 38.01 A 1.271 1.271 0 0 0 69.243 38.336 Q 69.584 38.487 70.08 38.52 L 70.08 42.6 A 38.81 38.81 0 0 1 69.525 42.682 Q 69.086 42.743 68.73 42.78 Q 68.163 42.84 67.804 42.84 A 2.724 2.724 0 0 1 67.8 42.84 A 5.389 5.389 0 0 1 66.728 42.74 Q 66.105 42.614 65.628 42.326 A 2.763 2.763 0 0 1 65.01 41.82 A 4.641 4.641 0 0 1 64.388 40.971 A 3.378 3.378 0 0 1 63.96 39.66 L 63.84 37.68 A 13.149 13.149 0 0 1 59.207 41.431 A 15.69 15.69 0 0 1 58.5 41.76 A 17.37 17.37 0 0 1 54.5 42.98 A 14.931 14.931 0 0 1 51.96 43.2 A 12.915 12.915 0 0 1 48.702 42.803 A 10.864 10.864 0 0 1 46.38 41.91 A 10.221 10.221 0 0 1 43.616 39.829 A 9.408 9.408 0 0 1 42.54 38.43 Q 41.16 36.24 41.16 33.54 Q 41.16 30.54 42.87 28.35 A 10.213 10.213 0 0 1 45.821 25.813 A 13.308 13.308 0 0 1 47.58 24.96 A 16.251 16.251 0 0 1 51.148 24.006 A 22.254 22.254 0 0 1 54.54 23.76 A 29.8 29.8 0 0 1 57.259 23.889 A 35.603 35.603 0 0 1 58.98 24.09 A 23.869 23.869 0 0 1 61.12 24.487 A 17.416 17.416 0 0 1 63.12 25.08 Z M 63.12 32.58 L 63.12 28.68 Q 61.26 27.96 59.22 27.57 Q 57.18 27.18 55.2 27.18 A 16.733 16.733 0 0 0 52.617 27.368 Q 51.184 27.592 50.008 28.084 A 8.629 8.629 0 0 0 48.69 28.77 A 5.92 5.92 0 0 0 47.234 30.048 A 4.767 4.767 0 0 0 46.2 33.12 Q 46.2 34.62 47.01 36.03 A 5.946 5.946 0 0 0 48.708 37.89 A 7.455 7.455 0 0 0 49.41 38.34 A 6.616 6.616 0 0 0 51.296 39.039 Q 52.234 39.24 53.34 39.24 Q 55.8 39.24 58.02 38.25 A 11.998 11.998 0 0 0 59.875 37.229 A 8.84 8.84 0 0 0 61.56 35.76 A 8.657 8.657 0 0 0 62.309 34.752 A 7.071 7.071 0 0 0 62.7 34.05 A 5.791 5.791 0 0 0 62.921 33.533 Q 63.117 33.001 63.12 32.594 A 1.725 1.725 0 0 0 63.12 32.58 Z"
                    style={{ fill: harColor }}
                  />
                  {/* Other text parts */}
                  <path
                    d="M 93.42 11.1 L 93.42 15.9 Q 89.46 15.96 86.43 17.91 Q 83.4 19.86 82.14 23.28 L 82.14 42.6 L 76.86 42.6 L 76.86 11.28 L 81.78 11.28 L 81.78 18.54 A 15.306 15.306 0 0 1 84.358 14.817 A 13.795 13.795 0 0 1 86.07 13.29 Q 88.74 11.28 91.68 11.04 L 92.7 11.04 A 4.988 4.988 0 0 1 92.998 11.048 Q 93.233 11.063 93.42 11.1 Z"
                    style={{ fill: harColor }}
                  />
                  <path
                    d="M 145.86 23.88 L 145.86 42.6 L 140.58 42.6 L 140.58 25.08 A 24.265 24.265 0 0 0 140.454 22.517 Q 140.175 19.9 139.278 18.288 A 6.18 6.18 0 0 0 138.99 17.82 Q 137.4 15.48 134.28 15.48 Q 131.1 15.48 128.52 17.79 A 12.237 12.237 0 0 0 125.276 22.542 A 15.119 15.119 0 0 0 124.86 23.76 L 124.86 42.6 L 119.58 42.6 L 119.58 25.08 A 25.279 25.279 0 0 0 119.46 22.523 Q 119.147 19.459 118.02 17.79 A 5.056 5.056 0 0 0 114.322 15.542 A 7.483 7.483 0 0 0 113.34 15.48 Q 110.22 15.48 107.61 17.73 A 11.615 11.615 0 0 0 104.466 22.143 A 14.748 14.748 0 0 0 103.92 23.7 L 103.92 42.6 L 98.64 42.6 L 98.64 11.28 L 103.44 11.28 L 103.44 18 A 15.341 15.341 0 0 1 105.961 14.588 A 13.258 13.258 0 0 1 108.42 12.63 A 12.757 12.757 0 0 1 114.843 10.747 A 15.315 15.315 0 0 1 115.32 10.74 Q 119.22 10.74 121.56 12.87 A 9.029 9.029 0 0 1 124.345 17.843 A 11.382 11.382 0 0 1 124.44 18.36 A 18.604 18.604 0 0 1 126.606 15.262 A 14.074 14.074 0 0 1 129.54 12.69 A 12.137 12.137 0 0 1 135.785 10.752 A 14.749 14.749 0 0 1 136.38 10.74 A 12.233 12.233 0 0 1 138.357 10.891 Q 139.469 11.073 140.388 11.476 A 6.96 6.96 0 0 1 140.91 11.73 Q 142.74 12.72 143.82 14.49 A 11.515 11.515 0 0 1 144.891 16.814 A 14.914 14.914 0 0 1 145.38 18.66 A 24.591 24.591 0 0 1 145.793 21.824 A 30.488 30.488 0 0 1 145.86 23.88 Z"
                    style={{ fill: monyColor }}
                  />
                  <path
                    d="M 163.838 42.757 A 16.781 16.781 0 0 0 167.76 43.2 Q 171.3 43.2 174.21 41.91 Q 177.12 40.62 179.22 38.37 Q 181.32 36.12 182.46 33.18 Q 183.6 30.24 183.6 27 Q 183.6 23.7 182.46 20.76 Q 181.32 17.82 179.19 15.57 Q 177.06 13.32 174.18 12.03 A 14.227 14.227 0 0 0 171.936 11.244 A 16.32 16.32 0 0 0 167.82 10.74 Q 164.28 10.74 161.37 12.03 Q 158.46 13.32 156.36 15.57 Q 154.26 17.82 153.12 20.76 Q 151.98 23.7 151.98 27 Q 151.98 30.24 153.12 33.18 Q 154.26 36.12 156.36 38.37 Q 158.46 40.62 161.34 41.91 A 14.185 14.185 0 0 0 163.838 42.757 Z M 157.38 27.06 A 12.851 12.851 0 0 0 157.98 31.032 A 11.624 11.624 0 0 0 158.79 32.94 A 11.531 11.531 0 0 0 161.168 36.045 A 10.685 10.685 0 0 0 162.54 37.11 Q 164.88 38.64 167.76 38.64 Q 170.64 38.64 173.01 37.08 A 11.149 11.149 0 0 0 176.61 33.179 A 13.121 13.121 0 0 0 176.79 32.85 A 12.308 12.308 0 0 0 178.188 27.542 A 14.536 14.536 0 0 0 178.2 26.94 A 12.851 12.851 0 0 0 177.6 22.968 A 11.624 11.624 0 0 0 176.79 21.06 Q 175.38 18.42 173.01 16.86 Q 170.64 15.3 167.76 15.3 Q 164.88 15.3 162.54 16.89 Q 160.2 18.48 158.79 21.12 A 12.036 12.036 0 0 0 157.43 25.846 A 14.636 14.636 0 0 0 157.38 27.06 Z"
                    style={{ fill: monyColor }}
                  />
                  <path
                    d="M 217.2 23.88 L 217.2 42.6 L 211.92 42.6 L 211.92 25.08 A 25.771 25.771 0 0 0 211.802 22.523 Q 211.544 19.946 210.721 18.355 A 6.107 6.107 0 0 0 210.39 17.79 A 4.967 4.967 0 0 0 206.766 15.548 A 7.423 7.423 0 0 0 205.74 15.48 Q 203.58 15.48 201.45 16.56 Q 199.32 17.64 197.67 19.47 Q 196.02 21.3 195.3 23.7 L 195.3 42.6 L 190.02 42.6 L 190.02 11.28 L 194.82 11.28 L 194.82 18 Q 196.08 15.78 198.06 14.16 Q 200.04 12.54 202.56 11.64 Q 205.08 10.74 207.84 10.74 A 12.233 12.233 0 0 1 209.817 10.891 Q 210.929 11.073 211.848 11.476 A 6.96 6.96 0 0 1 212.37 11.73 Q 214.2 12.72 215.25 14.49 Q 216.3 16.26 216.75 18.66 A 26.125 26.125 0 0 1 217.135 21.803 A 32.485 32.485 0 0 1 217.2 23.88 Z"
                    style={{ fill: monyColor }}
                  />
                  <path
                    d="M 226.86 55.8 L 226.86 51.12 Q 227.64 51.18 228.42 51.27 Q 229.063 51.344 229.461 51.357 A 4.871 4.871 0 0 0 229.62 51.36 Q 230.58 51.36 231.3 50.7 Q 232.02 50.04 232.89 48.15 Q 233.556 46.703 234.521 44.218 A 175.22 175.22 0 0 0 235.14 42.6 L 221.88 11.28 L 227.46 11.28 L 238.02 37.26 L 247.56 11.28 L 252.78 11.28 L 237.54 50.82 A 8.919 8.919 0 0 1 236.326 52.963 A 10.392 10.392 0 0 1 235.95 53.43 A 7.19 7.19 0 0 1 233.867 55.092 A 8.591 8.591 0 0 1 233.28 55.38 Q 231.787 56.044 229.732 56.096 A 13.959 13.959 0 0 1 229.38 56.1 A 10.544 10.544 0 0 1 228.341 56.047 A 11.553 11.553 0 0 1 228.27 56.04 A 9.289 9.289 0 0 1 227.825 55.981 Q 227.612 55.948 227.37 55.903 A 20.559 20.559 0 0 1 226.86 55.8 Z"
                    style={{ fill: monyColor }}
                  />
                </g>
              </svg>
            </div>
          </div>
        </section>
        <div style={{ position: 'relative', backgroundColor: baseColor }}>
          <div className="new-wave-svg-container">
            <NewWaveSVGThreeColors baseColor={baseColor} diamondColor={diamondColor} harColor={harColor} monyColor={monyColor} />
          </div>
        </div>
        <div style={{ height: '0.5px', backgroundColor: diamondColor }}></div>
        <section
          className={`h-screen flex items-center justify-center svg-center`}
          style={{ backgroundColor: baseColor }}
        >
          <YourSVGThreeColors baseColor={baseColor} diamondColor={diamondColor} harColor={harColor} monyColor={monyColor} />
        </section>
        <div style={{ height: '0.5px', backgroundColor: baseColor }}></div>
        <section className="h-screen flex items-center justify-center svg-center" style={{ backgroundColor: diamondColor }}>
          <BrandSVGThreeColors baseColor={baseColor} diamondColor={diamondColor} harColor={harColor} monyColor={monyColor} />
        </section>
        <section
          className="h-screen flex items-center justify-center svg-center"
          style={{ background: `linear-gradient(135deg, ${baseColor}, ${diamondColor}, ${monyColor})` }}
        >
        <Harmony3DText 
  baseColor={additionalColors[0]} 
  diamondColor={additionalColors[1]} 
  harColor={additionalColors[3]} 
  monyColor={additionalColors[2]}  
/>



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
                  <p className="text-1xl font-semibold no-select" style={{ color: isColorDark(baseColor) ? 'white' : 'black' }}>{ntc.name(baseColor)[1]}</p>
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
                  <p className="text-1xl font-semibold no-select" style={{ color: isColorDark(diamondColor) ? 'white' : 'black' }}>{ntc.name(diamondColor)[1]}</p>
                  {isDiamondPickerVisible && (
                    <div ref={diamondPickerRef} style={{ position: 'absolute', top: '30%', right: 'calc(50% + 206px)', transform: 'translate(50%, -50%)', zIndex: '10', background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
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
                  <p className="text-1xl font-semibold no-select" style={{ color: isColorDark(harColor) ? 'white' : 'black' }}>{ntc.name(harColor)[1]}</p>
                  {isHarPickerVisible && (
                    <div ref={harPickerRef} style={{ position: 'absolute', top: '30%', right: 'calc(50% + 206px)', transform: 'translate(50%, -50%)', zIndex: '10', background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
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
              className="w-1/2 h-full flex items-center justify-center relative color-container"
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
                  <p className="text-1xl font-semibold no-select" style={{ color: isColorDark(monyColor) ? 'white' : 'black' }}>{ntc.name(monyColor)[1]}</p>
                  {isMonyPickerVisible && (
                    <div ref={monyPickerRef} style={{ position: 'absolute', top: '30%', right: 'calc(50% + 206px)', transform: 'translate(50%, -50%)', zIndex: '10', background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
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
      {copySuccess && <div className="copy-success">{copySuccess}</div>}
    </div>
  );
};

export default ThreeColorsPage;
