

import React, { useState } from 'react';
import Menu from './Menu';
import FutureValue from './FutureValue';
// Import other calculator components

function FinancialCalculator() {
    const [currentPage, setCurrentPage] = useState('Menu');

    const handleNavigation = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            {currentPage === 'Menu' && <Menu handleNavigation={handleNavigation} />}
            {currentPage === 'FutureValue' && <FutureValue />}
            {/* Render other calculator components based on currentPage */}
        </div>
    );
}

export default FinancialCalculator;
