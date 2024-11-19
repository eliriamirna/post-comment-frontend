import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

interface Post {
  id: number;
  user_id: number;
  title: string;
  description: string;
  file_name: string | null;
  file_path: string | null;
}

interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  description: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export function Posts() {
  const { user, logout } = useAuth();  
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostsAndData = async () => {
      try {
        const postsResponse = await customFetch('/posts');
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData.posts || []);
        }

        const commentsResponse = await customFetch('/comments');
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData.comments || []);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndData();
  }, []);

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleEditPost = (postId: number) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const response = await customFetch(`/posts/${postId}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Post excluído com sucesso!');
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        alert('Erro ao excluir o post.');
      }
    } catch (error) {
      console.error('Erro ao excluir o post:', error);
    }
  };

  const handleAddComment = (postId: number) => {
    navigate(`/add-comment/${postId}`);
  };

  const handleEditComment = (commentId: number) => {
    navigate(`/edit-comment/${commentId}`);
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await customFetch(`/comments/${commentId}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Comentário excluído com sucesso!');
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      } else {
        alert('Erro ao excluir o comentário.');
      }
    } catch (error) {
      console.error('Erro ao excluir o comentário:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  console.log(user)

  return (
    <div className="bg-gradient-to-br from-[#403181] via-[#40c4ff] to-[#ff4081] min-h-screen text-white">
      <header className="flex justify-between items-center p-4 bg-[#403181] shadow-lg">
        <h1 className="text-xl font-bold">Post e Comments</h1>
      {user && (
        <div className="flex space-x-4">
          <button
            className="bg-[#ff4081] px-4 py-2 rounded-lg text-white font-medium hover:bg-[#ff1a70]"
            onClick={() => navigate('/profile')}
          >
            {user.id}
          </button>
          <button
            className="bg-red-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-red-800"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
      </header>

      <main className="p-6 space-y-6 max-w-3xl mx-auto">
        <button
          onClick={handleCreatePost}
          className="bg-[#40c4ff] px-4 py-2 rounded-lg text-white font-medium hover:bg-[#009acd]"
        >
          Criar Post
        </button>

        {posts.map((post) => (
          <div key={post.id} className="bg-white text-black rounded-lg shadow-lg p-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold text-[#403181]">{post.title}</h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditPost(post.id)}
                  className="bg-[#ff4081] px-2 py-1 rounded-lg text-white font-medium hover:bg-[#ff1a70]"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="bg-red-600 px-2 py-1 rounded-lg text-white font-medium hover:bg-red-800"
                >
                  Excluir
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{post.description}</p>

            {post.file_path && (
              <div className="mt-4">
                <img
                  src={post.file_path.replace('public\\', '/')}
                  alt={post.file_name || 'Imagem do post'}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#40c4ff]">Comentários:</h3>
              <ul className="mt-2 space-y-2">
                {comments
                  .filter((comment) => comment.post_id === post.id)
                  .map((comment) => (
                    <li
                      key={comment.id}
                      className="bg-gray-100 text-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center"
                    >
                      {comment.description}
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="bg-[#40c4ff] px-2 py-1 rounded-lg text-white font-medium hover:bg-[#009acd]"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="bg-red-600 px-2 py-1 rounded-lg text-white font-medium hover:bg-red-800"
                        >
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
              <button
                onClick={() => handleAddComment(post.id)}
                className="mt-2 bg-[#40c4ff] px-4 py-2 rounded-lg text-white font-medium hover:bg-[#009acd]"
              >
                Adicionar Comentário
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Posts;
