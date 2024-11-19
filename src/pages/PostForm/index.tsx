import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export function PostForm() {
  const { user } = useAuth(); // Autenticação
  const { id } = useParams(); // Captura o ID do post na URL (para edição)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null, // Para upload de imagens
  });

  useEffect(() => {
    const fetchPostData = async () => {
      if (id) {
        try {
          const response = await customFetch(`/posts/${id}`);
          if (response.ok) {
            const data = await response.json();
            setFormData({
              title: data.title || '',
              description: data.description || '',
              file: null, // Não carregamos o arquivo no formulário
            });
          } else {
            console.error('Erro ao buscar os dados do post');
          }
        } catch (error) {
          console.error('Erro na requisição:', error);
        }
      }
    };

    if (id) {
      fetchPostData();
    }
  }, [id]);

  const uploadFile = async (postId: number, file: File) => {
    try {
      const uploadData = new FormData();
      uploadData.append('post_id', postId.toString());
      uploadData.append('file', file);

      const response = await customFetch('/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || 'Erro ao enviar o arquivo';
        throw new Error(errorMessage);
      }

      alert('Arquivo enviado com sucesso!');
    } catch (error: any) {
      alert(error.message || 'Erro inesperado no envio do arquivo');
      console.error('Erro no upload:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const postData = {
        title: formData.title,
        description: formData.description,
      };

      const url = id ? `/posts/${id}` : '/posts';
      const method = id ? 'PUT' : 'POST';

      const response = await customFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || 'Erro ao salvar o post';
        throw new Error(errorMessage);
      }

      const savedPost = await response.json();

      // Faz o upload do arquivo se ele existir
      if (formData.file) {
        await uploadFile(savedPost.id, formData.file);
      }

      if (id) {
        alert('Post atualizado com sucesso!');
      } else {
        alert('Post criado com sucesso!');
      }

      navigate('/'); // Redireciona para a página inicial
    } catch (error: any) {
      alert(error.message || 'Erro inesperado ao salvar os dados');
      console.error('Erro:', error);
    }
  };

  return (
    <div className="pt-14 bg-gradient-to-br from-[#403181] via-[#40c4ff] to-[#ff4081] min-h-screen text-white">
      <div className="max-w-md mx-auto bg-[#ff4081] p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-white">
          {id ? 'Editar Post' : 'Criar Post'}
        </h2>
        <form onSubmit={handleFormSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-white">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-[#403181] mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40c4ff]"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-[#403181] mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40c4ff]"
              rows={4}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-white">
              Imagem (opcional)
            </label>
            <input
              type="file"
              id="file"
              // onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40c4ff]"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#403181] text-white rounded-md hover:bg-[#40c4ff] font-medium"
          >
            {id ? 'Editar' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
}
