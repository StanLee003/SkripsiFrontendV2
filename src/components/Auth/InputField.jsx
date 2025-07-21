import React from "react";
const InputField = ({ label, type, value, onChange, placeholder, required }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
  </div>
);
export default InputField;
