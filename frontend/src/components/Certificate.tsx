import React from 'react';

const Certificate = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      {/* Main Certificate Container */}
      <div 
        className="relative w-[1122.5px] h-[793.7px] bg-[#f4f1eb] p-12 shadow-2xl flex flex-col items-center justify-center"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        {/* Outer decorative border (simplistic representation via CSS borders for now) */}
        <div className="absolute inset-8 border border-gray-400"></div>
        <div className="absolute inset-10 border border-gray-600"></div>
        
        {/* Corner Ornaments */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-gray-800 rounded-tl-full opacity-70"></div>
        <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-gray-800 rounded-tr-full opacity-70"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-gray-800 rounded-bl-full opacity-70"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-gray-800 rounded-br-full opacity-70"></div>
        
        {/* Title */}
        <h1 className="text-6xl font-serif tracking-wide text-gray-800 mt-12 mb-6">
          Certificate of Achievement
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-500 uppercase tracking-widest text-sm mb-12">
          The following award is given to
        </p>
        
        {/* Name */}
        <h2 
          className="text-7xl mb-4 text-gray-800" 
          style={{ fontFamily: "'Brush Script MT', 'Great Vibes', cursive" }}
        >
          Marceline Anderson
        </h2>
        
        {/* Decorative Divider */}
        <div className="w-1/2 border-t-2 border-dotted border-gray-400 mb-8"></div>
        
        {/* Description */}
        <p className="text-gray-600 text-center max-w-3xl leading-relaxed text-lg mb-20">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras arcu metus, feugiat vitae ante ac, aliquet tempus ante. In euismod nibh eget lacinia imperdiet.
        </p>
        
        {/* Signatures & Seal Area */}
        <div className="flex w-full justify-between items-end px-24 mt-auto mb-16 relative">
          
          {/* Head of Event Signature */}
          <div className="flex flex-col items-center w-64">
            <div className="w-full border-t border-gray-800 mb-3"></div>
            <p className="text-gray-600 text-lg">Head of Event</p>
          </div>
          
          {/* Center Badge/Seal */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
            <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M50 0L57 15L73 10L76 27L91 29L85 43L99 50L85 57L91 71L76 73L73 90L57 85L50 100L43 85L27 90L24 73L9 71L15 57L1 50L15 43L9 29L24 27L27 10L43 15Z" 
                fill="#4a5568" 
              />
              <circle cx="50" cy="50" r="35" fill="#4a5568" stroke="#f4f1eb" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Mentor Signature */}
          <div className="flex flex-col items-center w-64">
            <div className="w-full border-t border-gray-800 mb-3"></div>
            <p className="text-gray-600 text-lg">Mentor</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Certificate;
