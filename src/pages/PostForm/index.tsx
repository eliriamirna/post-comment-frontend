import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export function PostForm() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
    preview: '', 
  });

  useEffect(() => {
    const fetchPostData = async () => {
      if (id) {
        try {
          const response = await customFetch(`/posts/${id}`);
          if (response.ok) {
            const data = await response.json();
            setFormData({
              title: data.post.title || '',
              description: data.post.description || '',
              file: null,
              preview: '',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      file,
      preview: file ? URL.createObjectURL(file) : '',
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const postData = {
        user_id: user?.id,
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
      const postId = savedPost.post.id
      console.log(postId)

      if (formData.file) {
        const uploadData = new FormData();
        uploadData.append('file', formData.file);
        uploadData.append('post_id', postId);

        const uploadResponse = await customFetch('/upload', {
          method: 'POST',
          body: uploadData,
        }, false);

        if (!uploadResponse.ok) {
          throw new Error('Erro ao fazer upload do arquivo');
        }
      }

      alert(id ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!');
      navigate('/posts');
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

          {id ? '' : 
            <div className="mb-4">
              <label htmlFor="file" className="block text-sm font-medium text-white">
                Imagem (opcional)
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40c4ff]"
                accept="image/*"
              />
              {formData.preview && (
                <div className='flex items-center justify-center'>
                  <img
                    src={formData.preview}
                    alt="Pré-visualização"
                    className="mt-4 max-h-40 object-cover rounded-md text-center"
                  />
                </div>
              )}
            </div>
          }

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
