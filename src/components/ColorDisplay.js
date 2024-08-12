import React from 'react';
import colornamer from 'colornamer';

const isColorDark = (color) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 155;
};

const getColorName = (color) => {
  const names = colornamer(color);
  return names.basic[0].name; // Use the basic name
};

const ColorDisplay = ({ color }) => {
  const colorName = getColorName(color);

  return (
    <div className="absolute bottom-28 text-center">
      <p className="text-3xl font-bold" style={{ color: isColorDark(color) ? 'white' : 'black' }}>{color}</p>
      <p className="text-lg font-semibold" style={{ color: isColorDark(color) ? 'white' : 'black' }}>{colorName}</p>
    </div>
  );
};

export default ColorDisplay;
