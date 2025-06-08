import React, { useState } from 'react';
import LoginPage from './LoginPage'
import Billing from './Billing';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="App">
      <header className="relative flex items-center justify-between p-4 pl-8 pr-8 bg-gray-900 text-white shadow-md">
        {/* Left: Logo + Title */}
        <div className="flex items-center space-x-3 z-10 pl-6 pr-6 border-r border-l border-gray-600">
          <div className="bg-white rounded-lg p-2">
            <img src="/ReboundLogo.png" alt="Rebound Rehab Logo" className="h-10 w-10 object-contain" />
          </div>
          <span className="font-urfa text-blue-400 text-3xl">
            <strong className="text-3xl text-white">Rebound</strong>Rehab
          </span>
        </div>

        {/* Center: Absolutely centered nav */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 space-x-6">
          <button className="text-xl tracking-wide border-b-2 px-3 pb-1 rounded-md hover:text-blue-400 hover:border-blue-400 hover:text-2xl hover:px-4 transition-all duration-200">Billing</button>
          <button className="text-xl tracking-wide border-b-2 px-3 pb-1 rounded-md hover:text-blue-400 hover:border-blue-400 hover:text-2xl hover:px-4 transition-all duration-200">Agencies</button>
        </nav>

        {/* Right: Sign Out */}
        <div className="z-10 pr-10">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded transition"
            onClick={() => {
              if (window.google && window.google.accounts?.id) {
                window.google.accounts.id.disableAutoSelect();
              }
              setUser(null);
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="p-6">
        <Billing />
      </main>
    </div>
  );
}

export default App;