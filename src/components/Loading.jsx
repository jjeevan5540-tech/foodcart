import React from 'react';

const Loading = ({ fullScreen = false }) => {
    const containerStyle = fullScreen
        ? "fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50"
        : "flex items-center justify-center p-8 w-full h-full";

    return (
        <div className={containerStyle}>
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading FoodCart...</p>
            </div>
        </div>
    );
};

export default Loading;
