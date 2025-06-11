import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação de senha
    if (password !== confirmPassword) {
      setError('As senhas não correspondem.');
      return;
    }

    try {
      // Simulação de envio ao backend
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, document, address, phone, email, password }),
      });

      if (response.ok) {
        setSuccess('Funcionário cadastrado com sucesso!');
        setTimeout(() => {
          navigate('/login'); // Redireciona para a página de login após o cadastro
        }, 2000); // Aguarda 2 segundos antes de redirecionar
      } else {
        const data = await response.json();
        setError(data.message || 'Erro ao cadastrar funcionário.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-5xl w-full bg-slate-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Cadastro de Funcionário</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-500 bg-opacity-10 border border-red-500 rounded-md text-red-500 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-2 bg-green-500 bg-opacity-10 border border-green-500 rounded-md text-green-500 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Informações Pessoais */}
          <div className="bg-slate-700 p-3 rounded-lg shadow-md">
            <h3 className="text-sm font-bold text-white mb-2">Informações Pessoais</h3>
            <div className="mb-2">
              <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-1 px-2 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white text-sm"
                placeholder={t('auth.register.placeholder.name')}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="document" className="block text-xs font-medium text-slate-300 mb-1">
                Documento
              </label>
              <input
                id="document"
                type="text"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                className="w-full py-1 px-2 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white text-sm"
                placeholder={t('auth.register.placeholder.document')}
                required
              />
            </div>
          </div>

          {/* Card 2: Contato */}
          <div className="bg-slate-700 p-3 rounded-lg shadow-md">
            <h3 className="text-sm font-bold text-white mb-2">Contato</h3>
            <div className="mb-2">
              <label htmlFor="address" className="block text-xs font-medium text-slate-300 mb-1">
                Endereço
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full py-1 px-2 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white text-sm"
                placeholder={t('auth.register.placeholder.address')}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="phone" className="block text-xs font-medium text-slate-300 mb-1">
                Telefone
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-1 px-2 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white text-sm"
                placeholder={t('auth.register.placeholder.phone')}
                required
              />
            </div>
          </div>

          {/* Card 3: Credenciais */}
          <div className="bg-slate-700 p-3 rounded-lg shadow-md">
            <h3 className="text-sm font-bold text-white mb-2">Credenciais</h3>
            <div className="mb-2">
              <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-1 px-2 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white text-sm"
                placeholder={t('auth.register.placeholder.email')}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-1 px-2 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white text-sm"
                placeholder={t('auth.register.placeholder.password')}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-300 mb-1">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-1 px-2 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white text-sm"
                placeholder={t('auth.register.placeholder.confirmPassword')}
                required
              />
            </div>
          </div>

          {/* Botão de Cadastro */}
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;