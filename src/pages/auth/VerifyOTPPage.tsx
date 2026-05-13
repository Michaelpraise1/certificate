import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Loader2 } from 'lucide-react';

export default function VerifyOTPPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock API call to verify OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Redirect to Dashboard on success
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Verify your email</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          We've sent a 6-digit confirmation code to your email. Enter it below to confirm your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Verification Code" 
          placeholder="Enter 6-digit code"
          value={code}
          onChange={e => setCode(e.target.value)}
          required
          maxLength={6}
          pattern="\d{6}"
          className="tracking-widest text-lg font-mono placeholder:font-sans"
        />

        <button
          type="submit"
          disabled={isLoading || code.length < 6}
          className="w-full flex items-center justify-center py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify Code"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Didn't receive the code?{' '}
        <button className="font-semibold text-blue-600 hover:text-blue-500">
          Click to resend
        </button>
      </p>
    </div>
  );
}
