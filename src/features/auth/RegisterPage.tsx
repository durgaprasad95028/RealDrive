import React, { useState } from 'react';
import { Gauge, Lock, User as UserIcon, Mail, Phone, Eye, EyeOff, Check } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useGame();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!acceptTerms) {
      setError('Please accept the simulation terms and driver code.');
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = register({ fullName, username, email, mobile, password });
      setIsLoading(false);
      if (res.success) {
        onNavigate('/onboarding');
      } else {
        setError(res.message || 'Registration failed.');
      }
    }, 400);
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
          CREATE DRIVER ACCOUNT
        </h2>
        <p className="text-xs sm:text-sm text-secondary-text">
          Join the RealDrive ecosystem and start your driving career
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <Card variant="elevated" padding="lg" className="shadow-2xl">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-danger text-xs font-medium">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. Jordan Vance"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                leftIcon={<UserIcon className="w-4 h-4" />}
                required
              />
              <Input
                label="Username"
                placeholder="e.g. apex_driver"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="driver@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
              <Input
                label="Mobile Phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-secondary-text select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="rounded border-app-border bg-surface-elevated text-primary-blue focus:ring-primary-blue"
                />
                <span>I accept RealDrive simulation terms & traffic code</span>
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-secondary-text hover:text-primary-text text-xs flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              glow
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Continue to Driver Onboarding
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-secondary-text">
            Already registered?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="text-primary-blue hover:text-sky-400 font-bold hover:underline"
            >
              Sign In Instead
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
