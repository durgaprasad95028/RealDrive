import React, { useState } from 'react';
import { Gauge, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';

interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-blue-600 selection:text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-2">
        <div 
          onClick={() => onNavigate('/')} 
          className="inline-flex items-center gap-2 cursor-pointer group mb-1"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-glow-blue">
            <Gauge className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-primary-text">
          RESET PASSWORD
        </h2>
        <p className="text-xs sm:text-sm text-secondary-text">
          Enter your driver email to receive simulation recovery credentials
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card variant="elevated" padding="lg" className="shadow-2xl">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-primary-text">Recovery Link Dispatched</h4>
              <p className="text-xs text-secondary-text leading-relaxed">
                A password reset token has been sent to <span className="text-sky-400 font-mono font-bold">{email}</span>. (Demo: You can sign in directly with <code className="text-white">player / player123</code>).
              </p>
              <Button
                variant="primary"
                size="md"
                className="w-full mt-4"
                onClick={() => onNavigate('/login')}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                placeholder="driver@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                glow
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Send Recovery Instructions
              </Button>

              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-secondary-text hover:text-primary-text pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
