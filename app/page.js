'use client'

import React, { createContext, useContext, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { generateToken } from './api/generateToken'; // Adjust the path accordingly

// Create a context to manage which step to show
const SignupContext = createContext();

const useSignup = () => useContext(SignupContext);

export default function LandingPage() {
  const [step, setStep] = useState('signup');
  
  return (
    <SignupContext.Provider value={{ step, setStep }}>
      <div className="min-h-screen flex flex-col items-center justify-center px-4" 
           style={{
             background: 'linear-gradient(to bottom, #DCFFD8, #C2FFBB)',
             fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
           }}>
        {step === 'signup' ? <SignupForm /> : <VerifyForm />}
      </div>
    </SignupContext.Provider>
  );
}

function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Remove the useSignup() context for this button if you are not using it anymore
  // const { setStep } = useSignup();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const token = await generateToken(); // Generate token before making API call
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
  
      const result = await response.json();
      if (result.success) {
        setStep('verify');
      } else {
        alert(result.error || 'An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Sign-up failed:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="w-full max-w-2xl mx-auto flex flex-col text-black items-center text-center">
      <h1 className="text-5xl md:text-6xl mb-4 mt-[-100px]">
        💊 EventPill.
      </h1>
      <p className="md:text-2xl text-gray-600 mb-16">
        your healthy dose of campus events and services.
      </p>
      <h2 className="text-2xl md:text-3xl font-medium mb-8">
        welcome! enter your email & get started:
      </h2>

      <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col items-center">
        <div className="w-full flex gap-2 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="walter.white@mail.utoronto.ca"
            className="flex-1 px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-12 h-12 rounded-full bg-blue-400 hover:bg-blue-500 transition-colors flex items-center justify-center text-white disabled:opacity-50"
            aria-label="Submit email"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <button
          type="button"
          onClick={() => router.push('/home')}
          className="text-gray-500 hover:text-gray-700 transition-colors text-sm flex items-center gap-1"
        >
          ... or continue w/o one <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </main>
  );
}

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const { setStep } = useSignup();

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setIsLoading(true);
    const result = await verifyCode(fullCode);
    setIsLoading(false);

    if (result.success) {
      router.push('/dashboard'); // Or wherever you want to redirect after verification
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    await sendEmail(email);
    setIsResending(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative"
         style={{
           background: 'linear-gradient(to bottom, #DCFFD8, #C2FFBB)',
           fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
         }}>
      <button
        onClick={() => setStep('signup')}
        className="absolute top-8 left-8 text-gray-600 hover:text-gray-800 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <main className="w-full text-black max-w-2xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-semibold mb-4">
          💊 eventPill.
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-16">
          your healthy dose of campus events and services.
        </p>

        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-2xl">psst... we sent a secret code to</p>
            <p className="text-2xl font-semibold">{email}</p>
          </div>

          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => {inputRefs.current[index] = el}}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading || code.join('').length !== 6}
              className="px-8 py-2 rounded-full bg-blue-400 hover:bg-blue-500 transition-colors text-white disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'enter'}
            </button>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="block mx-auto text-gray-500 hover:text-gray-700 transition-colors underline"
            >
              {isResending ? 'sending...' : 'resend email'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
