import React from 'react';
import { CargoType, CARGO_TYPE_LABELS } from '../../types/order.ts';

interface CargoTypeSelectProps {
  value: CargoType;
  onChange: (newValue: CargoType) => void;
  id?: string;
  disabled?: boolean;
}

export const CargoTypeSelect: React.FC<CargoTypeSelectProps> = ({
  value,
  onChange,
  id = 'cargo-type-select',
  disabled = false,
}) => {
  const options = Object.keys(CARGO_TYPE_LABELS) as CargoType[];

  return (
    <div className="w-full">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
      >
        Тип груза
      </label>
      
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as CargoType)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm transition duration-150 ease-in-out
                     focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm
                     disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400
                     dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-500"
        >
          {options.map((type) => (
            <option 
              key={type} 
              value={type}
              className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            >
              {CARGO_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};