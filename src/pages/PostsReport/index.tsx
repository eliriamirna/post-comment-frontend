import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

interface Post {
  id: number;
  title: string;
  comment_count: string;
}

export function PostsReport() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsResponse = await customFetch('/posts-report');
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData.posts || []);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-[#403181] via-[#40c4ff] to-[#ff4081] min-h-screen text-white">
      <header className="flex justify-between items-center p-4 bg-[#403181] shadow-lg">
        <h1 className="text-xl font-bold">Relatório de Posts</h1>
        {user && (
          <div className="flex space-x-4">
            <button
              className="bg-[#ff4081] p-2 rounded-lg text-white text-sm hover:bg-[#ff1a70]"
              onClick={() => navigate(`/create-user/${user.id}`)}
            >
              Editar Perfil
            </button>
            <button
            className="bg-[#40c4ff] p-2 rounded-lg text-white text-sm hover:bg-[#2586b1]"
            onClick={logout}
          >
            Logout
          </button>
          </div>
        )}
      </header>

      <main className="p-6 space-y-6 max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-[#40c4ff] mb-6">Posts Recentes</h2>
        </div>

        {posts.map((post) => (
          <div key={post.id} className="bg-white text-black rounded-lg shadow-lg p-6">
            <div className="flex justify-between">
              <h3 className="text-2xl font-semibold text-[#403181]">{post.title}</h3>
            </div>
            <p className="mt-2 text-gray-700">Quantidade de comentários: {post.comment_count}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
