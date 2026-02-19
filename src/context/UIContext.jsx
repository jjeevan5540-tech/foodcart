import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        setToast({ message, type, duration });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <UIContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={hideToast}
                />
            )}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
