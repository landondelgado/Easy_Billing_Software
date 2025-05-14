import React from 'react';
import InvoiceUploader from './InvoiceUploader'; // adjust the path if needed

function App() {
  return (
    <div className="App">
      <header className="p-4 bg-gray-800 text-white text-center text-2xl font-bold">
        Invoice Parser
      </header>
      <main className="p-6">
        <InvoiceUploader />
      </main>
    </div>
  );
}

export default App;
