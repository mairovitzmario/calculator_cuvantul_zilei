import React from 'react';

interface ColorLegendProps { }

const ColorLegend: React.FC<ColorLegendProps> = () => {
    return (
        <div className="color-legend">
            <div className="legend-item">
                <div className="letter-demo correct">A</div>
                <span>Verde = Poziție corectă</span>
            </div>
            <div className="legend-item">
                <div className="letter-demo present">B</div>
                <span>Galben = În cuvânt, poziție greșită</span>
            </div>
            <div className="legend-item">
                <div className="letter-demo absent">C</div>
                <span>Gri = Nu este în cuvânt</span>
            </div>
        </div>
    );
};

export default ColorLegend;
