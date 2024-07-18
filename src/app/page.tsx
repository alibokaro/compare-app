"use client";
import { useState } from 'react';
import axios from 'axios';
import DifferencesTable from './components/DifferencesTable/DifferencesTable';

const Home = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const allowedExtensions = ['txt'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
  };

  const validateFiles = () => {
    if (!file1 || !file2) {
      setError('Both files are required.');
      return false;
    }
    const ext1 = file1.name.split('.').pop();
    const ext2 = file2.name.split('.').pop();
    if (!allowedExtensions.includes(ext1!) || !allowedExtensions.includes(ext2!)) {
      setError('Invalid file type. Allowed types are: ' + allowedExtensions.join(', '));
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFiles()) return;

    const formData = new FormData();
    formData.append('file1', file1!);
    formData.append('file2', file2!);

    try {
      const res = await axios.post('/api/compare', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResponse(res.data);
    } catch (error) {
      setError('An error occurred while comparing files.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">File Compare</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">File 1:</label>
          <input type="file" onChange={(e) => handleFileChange(e, setFile1)} accept=".txt" className="block w-full" />
        </div>
        <div>
          <label className="block mb-2">File 2:</label>
          <input type="file" onChange={(e) => handleFileChange(e, setFile2)} accept=".txt" className="block w-full" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Compare</button>
      </form>
      {response && <DifferencesTable data={response?.differences} />} 
    </div>
  );
};

export default Home;
