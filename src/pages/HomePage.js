// HomePage.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import WebsitePreview from '../components/WebsitePreview';
import axios from 'axios';

const HomePage = () => {
  const [selectedOption, setSelectedOption] = useState('2 colors'); // Default to 2 colors
  const [baseColor, setBaseColor] = useState('#0000FF');
  const [additionalColors, setAdditionalColors] = useState(['#cccccc', '#cccccc']);

  const onGenerate = async () => {
    console.log('Generate button clicked');
    try {
      const response = await axios.post('http://localhost:5000/api/generate', { model: 'default' });
      console.log('Response:', response.data);
      setAdditionalColors(response.data.result.slice(1)); // Assuming you want to exclude the first color
      setBaseColor(response.data.result[0]); // Assuming the first color is the base color
    } catch (error) {
      console.error('Error generating colors:', error);
    }
  };

  const handleColorOptionSelect = (option) => {
    setSelectedOption(option);
    const numColors = parseInt(option.split(' ')[0]);
    const newColors = Array(numColors).fill('#cccccc');
    setAdditionalColors(newColors);
  };

  useEffect(() => {
    // Initial color setting based on default selected option
    handleColorOptionSelect(selectedOption);
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <Navbar
        onGenerate={onGenerate}
        baseColor={baseColor}
        additionalColors={additionalColors}
        setBaseColor={setBaseColor}
        setAdditionalColors={setAdditionalColors}
      />
      <div className="flex flex-grow">
        <Sidebar setSelectedOption={handleColorOptionSelect} />
        <div className="flex-grow">
          <WebsitePreview colors={[baseColor, ...additionalColors]} selectedOption={selectedOption} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
