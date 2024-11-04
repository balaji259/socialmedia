// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import RoutesComponent from './Routes'; // Adjust the path as needed
import "./index.css";
import toast, { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Toaster position="top-center" reverseOrder={false} />

        <RoutesComponent />
    </React.StrictMode>
);
