import React, { useEffect, useState } from 'react';

const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : '';

function LoginPage({ onLogin }) {
  const [animating, setAnimating] = useState(false);
  const [showSweep, setShowSweep] = useState(false);

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: '456787823662-tlhb7r7d22l38mp96ve32q3nmt44oivb.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', width: '300' }
      );
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      localStorage.setItem('id_token', response.credential);

      if (res.ok && data.authorized) {
        setAnimating(true);

        setTimeout(() => {
          setShowSweep(true);
        }, 700);

        setTimeout(() => {
          onLogin({ name: data.name, email: data.email, picture: data.picture });
        }, 1700);
      } else {
        alert('Unauthorized user');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="w-full flex items-center justify-between p-4 pl-8 pr-8 bg-gray-900 text-white z-10">
        <div className="flex items-center space-x-2 pl-4 pr-4 border-r border-l border-gray-600">
          <div className="bg-white rounded-lg p-2">
            <img src="/ReboundLogo.png" alt="Rebound Rehab Logo" className="h-5 w-5 object-contain" />
          </div>
          <span className="font-urfa text-blue-400 text-2xl">
            <strong className="text-2xl text-white">Rebound</strong>Rehab
          </span>
        </div>
      </header>

      {/* Login Section */}
      <main className={`flex flex-1 flex-col items-center justify-center bg-gradient-to-t from-blue-950 to-gray-900 px-4 text-center`}>
        <div className={`shadow-lg rounded-3xl p-0.5 max-w-md w-full bg-clip-border bg-gradient-to-t from-blue-900 to-blue-400 transition-opacity duration-700 ${animating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-white h-max px-20 py-16 rounded-[calc(1.5rem-2px)]">
            <div className="flex justify-center mb-4 border-b-2 pb-4 border-blue-200">
              <img src="/ReboundLogo.png" alt="Rebound Rehab Logo" className="h-40 w-40 object-contain" />
            </div>
            <h1 className="text-2xl font-bold mb-6 text-blue-900 border-b-2 border-blue-200 pb-4">Login to Rebound Rehab Billing</h1>
            <div id="googleSignInDiv" className="flex justify-center shadow-md"></div>
          </div>
        </div>
        {/* Sweep Animation */}
        <div className={`absolute top-[31px] left-0 w-full h-full bg-white transition-transform duration-1000 ease-in-out z-0 ${showSweep ? 'translate-y-10' : 'translate-y-full'}`} />
      </main>
    </div>
  );
}

export default LoginPage;
