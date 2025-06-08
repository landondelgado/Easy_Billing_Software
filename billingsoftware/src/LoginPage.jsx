import React, { useEffect } from 'react';

const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : '';

function LoginPage({ onLogin }) {
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
        onLogin({ name: data.name, email: data.email, picture: data.picture });
      } else {
        alert('Unauthorized user');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between p-4 pl-8 pr-8 bg-gray-900 text-white shadow-md">
        <div className="flex items-center space-x-3 pl-6 pr-6 border-r border-l border-gray-600">
          <div className="bg-white rounded-lg p-2">
            <img src="/ReboundLogo.png" alt="Rebound Rehab Logo" className="h-10 w-10 object-contain" />
          </div>
          <span className="font-urfa text-blue-400 text-3xl">
            <strong className="text-3xl text-white">Rebound</strong>Rehab
          </span>
        </div>
      </header>

      {/* Login Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="bg-white shadow-lg px-20 py-16 rounded-xl max-w-md w-full border border-blue-200">
          <div className="flex justify-center mb-4 border-b-2 pb-4 border-blue-200">
            <img src="/ReboundLogo.png" alt="Rebound Rehab Logo" className="h-40 w-40 object-contain" />
          </div>
          <h1 className="text-2xl font-semibold mb-6 text-blue-900 border-b-2 border-blue-200 pb-4">Login to Rebound Rehab Billing</h1>
          <div id="googleSignInDiv" className="flex justify-center"></div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
