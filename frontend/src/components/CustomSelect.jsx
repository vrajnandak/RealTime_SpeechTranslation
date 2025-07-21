// frontend/src/components/CustomSelect.jsx
import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ options, value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } }); // Mimic the native event object
    setIsOpen(false);
  };

  // Effect to handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(opt => opt.code === value);

  return (
    <div className="custom-select-container" ref={selectRef} data-disabled={disabled}>
      <div className="custom-select-value" onClick={() => !disabled && setIsOpen(!isOpen)}>
        <span>{selectedOption ? selectedOption.name : 'Select...'}</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}></span>
      </div>
      {isOpen && (
        <ul className="custom-select-options">
          {options.map((option) => (
            <li 
              key={option.code} 
              className={`custom-select-option ${option.code === value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.code)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;