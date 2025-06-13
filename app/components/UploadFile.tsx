"use client";
import React, { useState } from 'react';
import { CloudUpload } from "lucide-react";
import axios from 'axios';

const UploadFile = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);

    const previews = selected.map(file => URL.createObjectURL(file));
    setPreviews(previews);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files.length) return alert("Please select at least one file.");

    const formData = new FormData();
    files.forEach(file => formData.append("file", file));

    setLoading(true);
    try {
      const res = await axios.post('/api/upload', formData);
      setImageUrls(res.data.urls);
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      alert("Upload failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-3">
      <form className="col-start-2" onSubmit={submitHandler}>
        <h1 className="text-center text-4xl font-bold">Upload to DriveX</h1>

        <div className="border border-dashed rounded-2xl p-4 mt-4 text-center">
          <div className="flex items-center justify-center">
            <CloudUpload size={100} color="#00ff88" strokeWidth={3} absoluteStrokeWidth />
          </div>
          <p className="text-gray-400">Select files to upload</p>

          <input
            type="file"
            onChange={handleFileChange}
            name="file"
            accept="image/*"
            multiple
            id="file"
            className="hidden"
          />

          <label htmlFor="file" className="text-center mt-4 border px-5 py-3 rounded-full inline-block bg-gray-900 cursor-pointer">
            Select Files
          </label>

          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {files.map((file, idx) => (
              <div key={idx} className="flex flex-col items-center border rounded p-3 w-[140px]">
                <img src={previews[idx]} alt={`preview-${idx}`} className="w-24 h-24 object-cover rounded" />
                <p className="mt-2 text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ))}
          </div>

          {files.length > 0 && (
            <button
              type='submit'
              className='mt-6 px-6 py-3 bg-white rounded-2xl text-black cursor-pointer hover:bg-green-600 hover:text-white'
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Files'}
            </button>
          )}

          {imageUrls.length > 0 && (
            <div className="mt-6 text-left">
              <p className="font-semibold text-green-500">Uploaded CDN URLs:</p>
              <ul className="text-xs break-all text-gray-300 mt-2 space-y-1">
                {imageUrls.map((url, idx) => (
                  <li className='mt-3' key={idx}>{url}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UploadFile;
