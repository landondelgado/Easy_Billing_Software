import React from 'react';
import InvoiceUploader from './InvoiceUploader'; // adjust the path if needed

function App() {
  return (
    <div className="App">
      <header className="flex items-center p-4 bg-gray-800 text-white">
        <div className="bg-white rounded p-2 mr-4">
          <img src="/ReboundLogo.png" alt="Rebound Rehab Logo" className="h-12 w-12 object-contain" />
        </div>
        <h1 className="text-2xl font-bold">Rebound Rehab Billing</h1>
      </header>
      <main className="p-6">
        <InvoiceUploader />
      </main>
    </div>
  );
}

export default App;
