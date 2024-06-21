import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [someState, setSomeState] = useState('');

    // Define state and methods here that you want to share across components

    return (
        <AppContext.Provider value={{ someState, setSomeState }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppProvider, AppContext };
