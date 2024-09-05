// src/components/Sidebar.js
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faDiceD6, faPager, faImage, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import AdminLogo from '../images/harmonieee12121.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';
import './Sidebar.css'

const Sidebar = ({ setSelectedOption }) => {
  const { brandOpen, setBrandOpen, websiteOpen, setWebsiteOpen, illustrationOpen, setIllustrationOpen, isFirstRender } = useSidebar();
  const [isVisible, setIsVisible] = useState(true);
  const [isPinned, setIsPinned] = useState(true); // Default to pinned
  const [selectedOption, setSelectedOptionState] = useState('');
  const brandContentRef = useRef(null);
  const websiteContentRef = useRef(null);
  const illustrationContentRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  const handleBrandToggle = () => {
    setBrandOpen(!brandOpen);
  };

  const handleWebsiteToggle = () => {
    setWebsiteOpen(!websiteOpen);
  };

  const handleIllustrationToggle = () => {
    setIllustrationOpen(!illustrationOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOptionState(option);
    setSelectedOption(option);

    if (option === '1 color') {
      navigate('/one-color');
    } else if (option === '2 colors') {
      navigate('/two-colors');
    } else if (option === '3 colors') {
      navigate('/three-colors');
    } else if (option === '1 tone') {
      navigate('/one-tone-website');
    } else if (option === '2 tones') {
      navigate('/two-tones');
    } else if (option === 'About') {
      navigate('/about');
    }
  };

  useEffect(() => {
    if (brandContentRef.current) {
      brandContentRef.current.style.maxHeight = brandOpen ? `${brandContentRef.current.scrollHeight}px` : '0px';
    }
  }, [brandOpen]);

  useEffect(() => {
    if (websiteContentRef.current) {
      websiteContentRef.current.style.maxHeight = websiteOpen ? `${websiteContentRef.current.scrollHeight}px` : '0px';
    }
  }, [websiteOpen]);

  useEffect(() => {
    if (illustrationContentRef.current) {
      illustrationContentRef.current.style.maxHeight = illustrationOpen ? `${illustrationContentRef.current.scrollHeight}px` : '0px';
    }
  }, [illustrationOpen]);

  useEffect(() => {
    if (!isPinned) {
      const handleMouseEnter = () => setIsVisible(true);
      const handleMouseLeave = () => setIsVisible(false);

      document.querySelector('.sidebar').addEventListener('mouseenter', handleMouseEnter);
      document.querySelector('.sidebar').addEventListener('mouseleave', handleMouseLeave);

      return () => {
        document.querySelector('.sidebar').removeEventListener('mouseenter', handleMouseEnter);
        document.querySelector('.sidebar').removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isPinned]);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes('one-color')) {
      setSelectedOptionState('1 color');
    } else if (currentPath.includes('two-colors')) {
      setSelectedOptionState('2 colors');
    } else if (currentPath.includes('three-colors')) {
      setSelectedOptionState('3 colors');
    } else if (currentPath.includes('one-tone-website')) {
      setSelectedOptionState('1 tone');
    } else if (currentPath.includes('two-tones')) {
      setSelectedOptionState('2 tones');
    } else if (currentPath.includes('about')) {
      setSelectedOptionState('About');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isPinned) {
      document.body.classList.add('sidebar-locked');
    } else {
      document.body.classList.remove('sidebar-locked');
    }
  }, [isPinned]);

  return (
    <>
      <div
        className={`sidebar bg-white text-gray-800 h-full flex flex-col fixed top-0 z-30 transition-transform duration-300 ${
          isVisible ? 'translate-x-0' : '-translate-x-2/3'
        } sf-pro-font ${isPinned ? 'pinned' : ''}`}
        style={{ width: '16rem' }}
      >
        <div className="sidebar-header p-4 flex justify-between items-center">
          <img src={AdminLogo} alt="Admin Logo" className="h-12 w-12" />
          <FontAwesomeIcon
            icon={isPinned ? faEyeSlash : faEye}
            className="h-6 w-6 cursor-pointer mx-auto sidebar-eye-icon"
            onClick={togglePin}
          />
        </div>
        <div className="p-4 flex-grow overflow-y-auto scrollable-content">
          <div
            className={`relative mb-4 section ${
              selectedOption.includes('color') || selectedOption === 'Brand' ? 'bg-off-white highlighted-section' : ''
            }`}
          >
            <button
              onClick={handleBrandToggle}
              className={`flex justify-between items-center w-full text-left px-4 py-2 rounded-md hover:text-black hover:opacity-100 ${
                selectedOption.includes('color') ? 'text-black opacity-100' : 'opacity-70'
              }`}
            >
              <span className={`text-lg font-bold ${selectedOption.includes('color') ? 'text-black opacity-100' : 'opacity-70'}`}>
                Brand
              </span>
              <ChevronDownIcon className={`h-4 w-4 ${brandOpen ? 'transform rotate-180' : ''} ml-2`} />
              <FontAwesomeIcon
                icon={faDiceD6}
                className={`h-5 w-5 ml-auto ${selectedOption.includes('color') ? 'text-black opacity-100' : 'opacity-70'}`}
              />
            </button>
            <div
              ref={brandContentRef}
              className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isFirstRender ? '' : 'transition-max-height'}`}
              style={{ maxHeight: brandOpen ? `${brandContentRef.current?.scrollHeight}px` : '0px' }}
            >
              <div className="mt-2 w-full">
                <button
                  onClick={() => handleOptionSelect('1 color')}
                  className={`flex justify-between items-center w-full text-left px-4 py-2 hover:text-black hover:opacity-100 ${
                    selectedOption === '1 color' ? 'neon-text' : 'opacity-70'
                  }`}
                  style={{ marginBottom: '0.5rem' }}
                >
                  <span className={`font-bold ${selectedOption === '1 color' ? 'neon-text' : 'opacity-70'}`}>1 Color</span>
                  <FontAwesomeIcon icon={faDiceD6} className={`h-5 w-5 ml-auto ${selectedOption === '1 color' ? 'neon-text' : 'opacity-70'}`} />
                </button>
                <button
                  onClick={() => handleOptionSelect('2 colors')}
                  className={`flex justify-between items-center w-full text-left px-4 py-2 hover:text-black hover:opacity-100 ${
                    selectedOption === '2 colors' ? 'neon-text' : 'opacity-70'}`}
                  style={{ marginBottom: '0.5rem' }}
                >
                  <span className={`font-bold ${selectedOption === '2 colors' ? 'neon-text' : 'opacity-70'}`}>2 Colors</span>
                  <FontAwesomeIcon icon={faDiceD6} className={`h-5 w-5 ml-auto ${selectedOption === '2 colors' ? 'neon-text' : 'opacity-70'}`} />
                </button>
                <button
                  onClick={() => handleOptionSelect('3 colors')}
                  className={`flex justify-between items-center w-full text-left px-4 py-2 hover:text-black hover:opacity-100 ${
                    selectedOption === '3 colors' ? 'neon-text' : 'opacity-70'}`}
                >
                  <span className={`font-bold ${selectedOption === '3 colors' ? 'neon-text' : 'opacity-70'}`}>3 Colors</span>
                  <FontAwesomeIcon icon={faDiceD6} className={`h-5 w-5 ml-auto ${selectedOption === '3 colors' ? 'neon-text' : 'opacity-70'}`} />
                </button>
              </div>
            </div>
          </div>
          <div className="sidebar-separator"></div> {/* Separator between sections */}
          <div
            className={`relative mb-4 section ${
              selectedOption.includes('tone') || selectedOption === 'Website' ? 'bg-off-white highlighted-section' : ''
            }`}
          >
            <button
              onClick={handleWebsiteToggle}
              className={`flex justify-between items-center w-full text-left px-4 py-2 rounded-md hover:text-black hover:opacity-100 ${
                selectedOption.includes('tone') ? 'text-black opacity-100' : 'opacity-70'}`}
            >
              <span className={`text-lg font-bold ${selectedOption.includes('tone') ? 'text-black opacity-100' : 'opacity-70'}`}>
                Website
              </span>
              <ChevronDownIcon className={`h-4 w-4 ${websiteOpen ? 'transform rotate-180' : ''} ml-2`} />
              <FontAwesomeIcon
                icon={faPager}
                className={`h-5 w-5 ml-auto ${selectedOption.includes('tone') ? 'text-black opacity-100' : 'opacity-70'}`}
              />
            </button>
            <div
              ref={websiteContentRef}
              className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isFirstRender ? '' : 'transition-max-height'}`}
              style={{ maxHeight: websiteOpen ? `${websiteContentRef.current?.scrollHeight}px` : '0px' }}
            >
              <div className="mt-2 w-full">
                <button
                  onClick={() => handleOptionSelect('1 tone')}
                  className={`flex justify-between items-center w-full text-left px-4 py-2 hover:text-black hover:opacity-100 ${
                    selectedOption === '1 tone' ? 'neon-text' : 'opacity-70'}`}
                  style={{ marginBottom: '0.5rem' }}
                >
                  <span className={`font-bold ${selectedOption === '1 tone' ? 'neon-text' : 'opacity-70'}`}>1 Tone</span>
                  <FontAwesomeIcon icon={faPager} className={`h-5 w-5 ml-auto ${selectedOption === '1 tone' ? 'neon-text' : 'opacity-70'}`} />
                </button>
                <button
                  onClick={() => handleOptionSelect('2 tones')}
                  className={`flex justify-between items-center w-full text-left px-4 py-2 hover:text-black hover:opacity-100 ${
                    selectedOption === '2 tones' ? 'neon-text' : 'opacity-70'}`}
                >
                  <span className={`font-bold ${selectedOption === '2 tones' ? 'neon-text' : 'opacity-70'}`}>2 Tones</span>
                  <FontAwesomeIcon icon={faPager} className={`h-5 w-5 ml-auto ${selectedOption === '2 tones' ? 'neon-text' : 'opacity-70'}`} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="sidebar-separator"></div> {/* Separator below Illustration */}
          <div
            className={`relative mb-4 section ${
              selectedOption === 'About' ? 'bg-off-white highlighted-section' : ''}`}
          >
            <button
              onClick={() => handleOptionSelect('About')}
              className={`flex justify-between items-center w-full text-left px-4 py-2 rounded-md hover:text-black hover:opacity-100 ${
                selectedOption === 'About' ? 'text-black opacity-100' : 'opacity-70'}`}
            >
              <span className={`text-lg font-bold ${selectedOption === 'About' ? 'text-black opacity-100' : 'opacity-70'}`}>About</span>
              <FontAwesomeIcon icon={faInfoCircle} className={`h-5 w-5 ml-auto ${selectedOption === 'About' ? 'text-black opacity-100' : 'opacity-70'}`} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
