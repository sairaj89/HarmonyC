import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cube from '../components/Cube'; // Adjust the path as necessary
import './LandingPage.css'; // Ensure this path is correct

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLaunchClick = () => {
    navigate('/two-colors');
  };

  return (
    <div className="relative w-full h-full bg-black text-center">
      <Cube />
      <header className="absolute bottom-10 left-10 bg-black bg-opacity-0 p-5 z-10 max-w-md">
        <h1 className="text-4xl font-bold shadow-lg font-sans">
          <span className="text-gray-600">Welcome to</span>
          <span className="harmony-gradient"> Harmony</span>
        </h1>
        <p className="mt-4 text-lg text-off-white mb-4 font-sans">
          Harmony is a color palette generator tool that enable you to create unique color palettes for your 
          <span className="brand-gradient"> brand </span> or 
          <span className="website-gradient"> website</span>.
        </p>
        <button 
          className="bg-transparent border-2 border-launch-green text-launch-green py-2 px-4 text-lg hover:bg-launch-green hover:text-black button"
          onClick={handleLaunchClick}
        >
          Launch
        </button>
      </header>
    </div>
  );
};

export default LandingPage;
