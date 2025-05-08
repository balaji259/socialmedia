import React, { useState } from 'react';

export default function Key() {
    
  const [keyState, setKeyState] = useState({
    activeSection: true,
    inactiveSection: false,
    createKeySection: false
  });

  const [keyInputs, setKeyInputs] = useState({
    createKey: '',
    confirmKey: ''
  });

  const showCreateKeySection = () => {
    setKeyState({
      activeSection: false,
      inactiveSection: false,
      createKeySection: true
    });
  };

  const cancelCreateKey = () => {
    setKeyState({
      activeSection: false,
      inactiveSection: true,
      createKeySection: false
    });
    setKeyInputs({ createKey: '', confirmKey: '' });
  };

  const activateKey = () => {
    const { createKey, confirmKey } = keyInputs;
    
    if (createKey.length !== 6) {
      alert('Your key must be exactly 6 characters.');
      return;
    }
    
    if (createKey !== confirmKey) {
      alert('Keys do not match. Please try again.');
      return;
    }
    
    setKeyState({
      activeSection: true,
      inactiveSection: false,
      createKeySection: false
    });
    setKeyInputs({ createKey: '', confirmKey: '' });
    alert('Friendsbook Key created and activated successfully!');
  };

  const deactivateKey = () => {
    setKeyState({
      activeSection: false,
      inactiveSection: true,
      createKeySection: false
    });
    alert('Friendsbook Key has been deactivated.');
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'create-key-input') {
      setKeyInputs({ ...keyInputs, createKey: value });
    } else if (id === 'confirm-key-input') {
      setKeyInputs({ ...keyInputs, confirmKey: value });
    }
  };

  // If this is the first render and no state is explicitly set yet, show inactive by default
  if (!keyState.activeSection && !keyState.inactiveSection && !keyState.createKeySection) {
    setKeyState({
      activeSection: false,
      inactiveSection: true,
      createKeySection: false
    });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 p-3 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-white text-3xl font-bold">f</div>
          <div className="flex items-center">
            <span className="text-white mr-3">John Doe</span>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
              JD
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto py-5 px-4">
        <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-5 pb-4 border-b border-gray-200">Privacy & Security</h1>
          
          {/* Active Key Section */}
          {keyState.activeSection && (
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    🔒
                  </div>
                  <span className="text-lg font-bold">Friendsbook Key</span>
                </div>
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </div>
              </div>
              
              <p className="text-gray-500 mb-5">
                Friendsbook Key provides an additional layer of security for your account. Even if your password is compromised, no one can access your account without this key.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-5">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium">Active</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">Last Modified</span>
                  <span className="font-medium">May 2, 2025</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Recovery Options</span>
                  <span className="font-medium">Email, Phone</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={deactivateKey}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
                >
                  Deactivate Key
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md font-medium">
                  Change Key
                </button>
              </div>
            </div>
          )}
          
          {/* Inactive Key Section */}
          {keyState.inactiveSection && (
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    🔒
                  </div>
                  <span className="text-lg font-bold">Friendsbook Key</span>
                </div>
                <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm font-medium">
                  Inactive
                </div>
              </div>
              
              <p className="text-gray-500 mb-5">
                Friendsbook Key is currently inactive. Activate this feature to add an extra layer of security to your account.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-5">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium">Inactive</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Protection Level</span>
                  <span className="font-medium">Standard</span>
                </div>
              </div>
              
              <div>
                <button 
                  onClick={showCreateKeySection}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Activate Key
                </button>
              </div>
            </div>
          )}
          
          {/* Create Key Section */}
          {keyState.createKeySection && (
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    🔒
                  </div>
                  <span className="text-lg font-bold">Create Your Friendsbook Key</span>
                </div>
              </div>
              
              <p className="text-gray-500 mb-5">
                Create a 6-character key using letters and numbers. You'll need this key to access your account after activation.
              </p>
              
              <div className="mb-5">
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Create Key</label>
                  <input 
                    type="password" 
                    id="create-key-input" 
                    placeholder="Enter a 6-character key" 
                    maxLength={6}
                    value={keyInputs.createKey}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded-md text-base"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Confirm Key</label>
                  <input 
                    type="password" 
                    id="confirm-key-input" 
                    placeholder="Confirm your key" 
                    maxLength={6}
                    value={keyInputs.confirmKey}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded-md text-base"
                  />
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="text-blue-600">Tip:</span> Choose a key that's easy for you to remember but hard for others to guess.
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-5">
                <div className="font-semibold mb-2">Recovery Options</div>
                <div className="text-gray-500 text-sm mb-4">
                  If you forget your key, you'll need one of these methods to recover your account:
                </div>
                <div className="flex gap-2 mb-3">
                  <input type="checkbox" id="email-recovery" checked disabled className="mt-1" />
                  <label htmlFor="email-recovery" className="text-gray-500">
                    <div className="font-medium">Email Recovery</div>
                    <div className="text-xs">j****e@example.com</div>
                  </label>
                </div>
                <div className="flex gap-2">
                  <input type="checkbox" id="phone-recovery" checked disabled className="mt-1" />
                  <label htmlFor="phone-recovery" className="text-gray-500">
                    <div className="font-medium">Phone Recovery</div>
                    <div className="text-xs">+1 (***) ***-**90</div>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={activateKey}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Create & Activate Key
                </button>
                <button 
                  onClick={cancelCreateKey}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {/* Info Cards */}
          <div className="flex flex-col md:flex-row gap-5 mt-8">
            <div className="bg-white border border-gray-200 rounded-lg p-5 md:w-1/2">
              <div className="text-base font-bold mb-2">How Friendsbook Key Works</div>
              <div className="text-gray-500 text-sm">
                <p className="mb-2">When activated, you'll be asked to enter your 6-character key every time you sign in, even if your email and password are correct.</p>
                <p>This means that even if someone gets your password, they still can't access your account without your personal key.</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5 md:w-1/2">
              <div className="text-base font-bold mb-2">Keep Your Key Safe</div>
              <div className="text-gray-500 text-sm">
                <p className="mb-2">Your key should be memorable but not easy to guess. Don't share it with anyone, and make sure to set up recovery options in case you forget it.</p>
                <p>We recommend using a combination of letters and numbers for maximum security.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-xs mt-10">
          <p>© 2025 Friendsbook · Privacy · Terms · Cookies</p>
        </div>
      </div>
    </div>
  );
}