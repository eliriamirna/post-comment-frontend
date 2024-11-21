import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customFetch } from '../../utils/api';  
import { useAuth } from '../../context/AuthContext';

interface User {
  name: string;
  email: string;
}

export function UserForm() {
  const { user } = useAuth();  
  const { id } = useParams();  
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', 
  });

  
  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const response = await customFetch(`/users/${id}`);
          if (response.ok) {
            const data = await response.json();
            const user = data.user
            setCurrentUser(user); 
            setFormData({
              name: user.name || '',
              email: user.email || '',
              password: '', 
            });
          } else {
              const errorData = await response.json();
              const errorMessage = errorData?.mensagem || 'Erro ao salvar usuário';
              alert(errorMessage)
              throw new Error(errorMessage);
            }
        } catch (error) {
          console.error('Erro na requisição:', error);
        }
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleUpsertUserData = async () => {
    if (!currentUser) {
      alert('Erro: Dados do usuário não carregados.');
      return;
    }
  
    try {
      const userData = {
        name: formData.name || currentUser.name,
        email: formData.email || currentUser.email,
        ...(formData.password && { password: formData.password }),
      };
  
      const url = id ? `/users/${id}` : '/users';
      const method = id ? 'PUT' : 'POST';
  
      const response = await customFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.mensagem || 'Erro ao salvar usuário';
        throw new Error(errorMessage);
      }
  
      alert(id ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
      
      if (id) {
        navigate('/posts');
      } else {
        navigate('/')
      }
    } catch (error: any) {
      alert(error.message || 'Erro inesperado ao salvar os dados');
      console.error('Erro:', error);
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#403181] via-[#40c4ff] to-[#ff4081]">
      <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
        <h2 className="text-2xl font-semibold text-center" style={{ color: '#403181' }}>{id ? 'Editar Usuário' : 'Criar Usuário'}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); handleUpsertUserData(); }} className="mt-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4081]"
              required
              style={{ borderColor: '#40c4ff' }}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4081]"
              required
              style={{ borderColor: '#40c4ff' }}
            />
          </div>

          {!id && ( 
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff4081]"
                required={!id} 
                style={{ borderColor: '#40c4ff' }}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#403181] text-white rounded-md hover:bg-[#30258b] focus:outline-none focus:ring-2 focus:ring-[#ff4081]"
          >
            {id ? 'Atualizar Usuário' : 'Criar Usuário'}
          </button>
        </form>
      </div>
     </div> 
  );
};

export default UserForm;
