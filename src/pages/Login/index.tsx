import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Oval } from 'react-loader-spinner'; 
interface ILogin {
  email: string;
  password: string;
}

export function Login() {
  const { register, handleSubmit } = useForm<ILogin>();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (data: ILogin) => {
    setLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
      alert('Login efetuado com sucesso!')
    } catch (err: any) {
      const mensagemErro = err.response?.data?.mensagem || 'Erro ao autenticar. Verifique suas credenciais.';
      setError(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#403181] via-[#40c4ff] to-[#ff4081]">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#403181] mb-6 text-center">Entrar</h1>

        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail:
            </label>
            <input
              {...register('email', { required: true })}
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#40c4ff] focus:border-[#40c4ff]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha:
            </label>
            <div className="relative">
              <input
                {...register('password', { required: true })}
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Digite sua senha"
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#ff4081] focus:border-[#ff4081]"
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer text-gray-500 hover:text-[#403181]"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-500 bg-red-100 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#403181] text-white px-4 py-2 rounded-md shadow hover:bg-[#302568] transition duration-200"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center">
                <Oval color="#fff" height={20} width={20} />
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
