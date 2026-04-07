"use client";
import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Maaloo, Maqaa fi Email kee guuti!');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Email sirrii galchi!');
      return;
    }
    onLogin(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Chala Worku Center</h1>
          <p className="text-blue-600 font-medium text-sm">National Exam Practice</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Maqaa Guutuu</label>
            <input 
              type="text" 
              placeholder="Fkn: Chala Worku"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gmail Kee</label>
            <input 
              type="email" 
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all mt-4"
          >
            Qormaata Jalqabi →
          </button>
        </form>
      </div>
    </div>
  );
}
