import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import WelcomeOverlay from './components/Welcome';
// import { useChatStore } from "./components/useChatStore";





const App = () => {
  
    // const { startNotificationPolling, stopNotificationPolling,startPostPolling, stopPostPolling } = useChatStore();

    // useEffect(() => {
    //     console.log("POLLING STARTED!")
    //     startNotificationPolling();
        

    //     return () => {
    //         console.log("POLLING STOPPED!");
    //         stopNotificationPolling(); 
    //     };


    // }, []);

    // useEffect(() => {
    //     console.log("POLLING STARTED for Posts!")
    //     startPostPolling();
        

    //     return () => {
    //         console.log("POLLING STOPPED! for Posts");
    //         stopPostPolling(); 
    //     };


    // }, []);

    

  

    return (
        <div>
           {/* {isLogin ? <Login onSwitch={handleSwitch} /> : <Register onSwitch={handleSwitch} />} */}
           <WelcomeOverlay />


             {/* Google Translate Dropdown (Initially hidden, toggled from Navbar) */}
      <div id="google_translate_element" className="hidden"></div>


        </div>
    );
};

export default App;
