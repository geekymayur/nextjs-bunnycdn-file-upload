"use client";
import React from 'react'
import { CloudUpload } from "lucide-react";
import { useState, useEffect } from "react";
import axios from 'axios';

const UploadFile = () => {

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const submitHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Select file before upload!");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/api/upload', formData);
    setFile(null);
    setPreviewUrl(null)

    setImageUrl(res.data.url);
  };

  return (
    <>
      <div className="grid grid-cols-3">
        <form className="col-start-2" onSubmit={submitHandler}>
          <h1 className="text-center text-4xl font-bold">Upload to DriveX</h1>
          <div className="border border-dashed rounded-2xl p-4 mt-4 text-center">
            <div className="flex items-center justify-center">
              <CloudUpload size={100} color="#00ff88" strokeWidth={3} absoluteStrokeWidth />
            </div>
            <p className="text-center text-gray-400 block">Select files to upload</p>
            <input type="file" onChange={handleFileChange} name="file" typeof="png,jpg,jpeg,webp" id="file" className="hidden" />

            <label htmlFor="file" className="text-center mt-4 border px-5 py-3 rounded-full inline-block bg-gray-900 cursor-pointer">Select Files</label>


            <div className="mt-3 p-4 rounded-md">
              <div>
                {file && previewUrl && (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={previewUrl}
                      alt="Selected"
                      className="w-40 h-40 object-cover rounded border p-4"
                    />
                    <div className="text-center">
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>

                    <button type='submit' className='p-4 bg-white rounded-2xl text-black cursor-pointer hover:bg-green-600 hover:text-white'>Upload File</button>

                  </div>

                )}
              </div>
            </div>


            <p>{imageUrl}</p>
          </div>
        </form>




      </div>
    </>
  )
}

export default UploadFile