import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';


const App = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSwitch = () => {
        setIsLogin((prev) => !prev);
    };

    return (
        <div>
           {isLogin ? <Login onSwitch={handleSwitch} /> : <Register onSwitch={handleSwitch} />}
        </div>
    );
};

export default App;
