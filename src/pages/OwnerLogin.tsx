import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Briefcase } from 'lucide-react'; // Added Briefcase for Owner
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const OwnerLogin: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to owner dashboard after login
  const from = (location.state as any)?.from || '/owner-dashboard';

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
        <div className="p-10 flex flex-col justify-center bg-gradient-to-br from-amber-600 to-yellow-800 hidden md:flex"> {/* Owner Color Theme */}
          <div className="mb-8">
            <Briefcase className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">{t('ownerLogin.title', 'Portal do Proprietário')}</h1>
          <p className="text-amber-100 mb-8">
            {t('ownerLogin.description', 'Acesse para visualizar dados financeiros, desempenho e metas de negócios.')}
          </p>
        </div>

        <div className="p-10 bg-slate-800">
          <div className="mb-6 flex justify-center md:hidden">
            <Briefcase className="h-12 w-12 text-amber-500" />
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
                  className="w-full py-2 pl-10 pr-3 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                  placeholder={t('login.emailPlaceholder', 'owner@hotel.com')}
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
                  className="w-full py-2 pl-10 pr-3 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  {t('login.rememberMe', 'Lembrar-me')}
                </label>
              </div>
              <div>
                <a href="#" className="text-sm text-amber-500 hover:text-amber-400">
                  {t('login.forgotPassword', 'Esqueceu a senha?')}
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
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

export default OwnerLogin;