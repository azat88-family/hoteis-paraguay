import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, UserCheck } from 'lucide-react'; // Changed ClipboardUser to UserCheck for Attendant
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const AttendantLogin: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to attendant dashboard after login
  const from = (location.state as any)?.from || '/attendant-dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError(t('login.invalidCredentials', 'Email ou senha inválidos'));
      }
    } catch (err) {
      setError(t('login.genericError', 'Algo deu errado. Por favor, tente novamente.'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="grid md:grid-cols-2 overflow-hidden rounded-2xl shadow-lg max-w-4xl w-full">
        <div className="p-10 flex flex-col justify-center bg-gradient-to-br from-teal-600 to-green-800 hidden md:flex"> {/* Attendant Color Theme */}
          <div className="mb-8">
            <UserCheck className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">{t('attendantLogin.title', 'Portal do Atendente')}</h1>
          <p className="text-teal-100 mb-8">
            {t('attendantLogin.description', 'Acesse para gerenciar quartos, reservas e calendário de locações.')}
          </p>
        </div>

        <div className="p-10 bg-slate-800">
          <div className="mb-6 flex justify-center md:hidden">
            <UserCheck className="h-12 w-12 text-teal-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">{t('login.signIn', 'Entrar')}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-md text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                {t('login.emailLabel', 'Email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 pl-10 pr-3 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
                  placeholder={t('login.emailPlaceholder', 'attendant@hotel.com')}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                {t('login.passwordLabel', 'Senha')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2 pl-10 pr-3 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end mb-6"> {/* Adjusted to justify-end as remember me is removed */}
              <div>
                <a href="#" className="text-sm text-teal-500 hover:text-teal-400">
                  {t('login.forgotPassword', 'Esqueceu a senha?')}
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                t('login.signInButton', 'Entrar')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendantLogin;