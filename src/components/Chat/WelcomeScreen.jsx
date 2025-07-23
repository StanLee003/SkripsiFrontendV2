import React from 'react';

// Labels multi-bahasa
const labels = {
  en: {
    title: "Skripsi Chat",
    description: "Select a friend to start chatting."
  },
  id: {
    title: "Skripsi Chat",
    description: "Pilih teman untuk memulai percakapan."
  },
  zh: {
    title: "Skripsi Chat",
    description: "选择朋友开始聊天。"
  }
};

const WelcomeScreen = ({ language = "en" }) => {
  const lang = labels[language] || labels.en;

  return (
    <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-4 bg-gray-900">
      <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-300">{lang.title}</h2>
      <p className="text-gray-400 mt-2">{lang.description}</p>
    </div>
  );
};

export default WelcomeScreen;