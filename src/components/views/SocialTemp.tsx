import React from 'react';
import { useNavigate } from 'react-router-dom';


const SocialTemp: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <h1>Social View Placeholder</h1>
        </div>
    );
};

export default SocialTemp;