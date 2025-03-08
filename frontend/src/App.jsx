import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import WelcomeOverlay from './components/Welcome';



const App = () => {
  


  

    return (
        <div>
           {/* {isLogin ? <Login onSwitch={handleSwitch} /> : <Register onSwitch={handleSwitch} />} */}
           <WelcomeOverlay />
        </div>
    );
};

export default App;
