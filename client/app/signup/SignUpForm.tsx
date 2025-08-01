'use client';

import { useState } from 'react';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    
    // TODO: Add API call to backend
    console.log('SignUp attempt:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            placeholder="First name"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            placeholder="Last name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          placeholder="Create a password"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          placeholder="Confirm your password"
        />
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 bg-gray-800 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="text-gray-300">
            I agree to the{' '}
            <a href="#" className="text-red-500 hover:text-red-400 transition-colors">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-red-500 hover:text-red-400 transition-colors">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-8 py-3 font-semibold transition-colors flex items-center justify-center group disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Creating Account...
          </div>
        ) : (
          <>
            CREATE ACCOUNT
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}