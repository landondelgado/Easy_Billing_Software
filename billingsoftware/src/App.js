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
      <header className="relative flex items-center justify-between p-4 pl-8 pr-8 text-white shadow-md bg-gray-900 fade-in-gradient">
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
        <nav className="animate-slide-in-top absolute left-1/2 space-x-6 opacity-0 ">
          <button className="text-xl font-semibold tracking-wider hover:text-blue-400 transition-all duration-200">Billing</button>
          <button className="text-xl font-semibold tracking-wider hover:text-blue-400 transition-all duration-200">Agencies</button>
        </nav>

        {/* Right: Sign Out */}
        <div className="z-10 slide-in-top">
          <button
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold px-4 py-1.5 pb-2 rounded transition"
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