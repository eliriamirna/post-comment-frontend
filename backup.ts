import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';

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
  const { register } = useForm<Comment>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState<{ [postId: number]: string }>({});
  const [addComment, setAddComment] =useState(false)
  const [newCommentTrigger, setNewCommentTrigger] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

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
          setComments((prevComments) => {
            const newComments = commentsData.comments.filter(
              (newComment: Comment) => !prevComments.some((comment) => comment.id === newComment.id)
            );
            return [...prevComments, ...newComments];
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPostsAndData();
  }, [newCommentTrigger, newComment]);
  

  const editProfile = (id: number) => {
    navigate(`/create-user/${id}`);
  }

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleEditPost = (userId: number, postId: number) => {
    if (user?.id === userId) {
      navigate(`/create-post/${postId}`);
    } else {
      alert('Esse post pertence a outro usuário e você não pode editá-lo')
    }
  };

  const handleDeletePost = async (userId: number, postId: number) => {
    if (user?.id === userId) {
      const confirmDelete = window.confirm("Tem certeza que deseja excluir esse comentário?");
      if (!confirmDelete) {
        return; 
      }

      try {
        const response = await customFetch(`/posts/${postId}`, {method: 'DELETE'});
        if (response.ok) {
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } else {
          alert('Erro ao excluir o post.');
        }
      } catch (error) {
        console.error('Erro ao excluir o post:', error);
      }
    } else {
      alert('Esse post pertence a outro usuário e você não pode excluí-lo')
    }
    
  };

  const handleUpsertComment = async (postId: number, userId: number) => {
    console.log('Estado atual de newComment:', newComment);
    // Pegando o valor do comentário para o post
    const description = newComment[postId]?.trim();
    console.log('Descrição extraída:', description);
  
    if (!description) {
      alert('O comentário não pode estar vazio.');
      return;
    }
  
    // Verificar se o comentário já existe
    const existingComment = comments.find(
      (comment) => comment.post_id === postId && comment.user_id === userId
    );
  
    // Garantir permissões
    if (existingComment && user?.id !== userId) {
      alert('Você não tem permissão para editar este comentário.');
      return;
    }
  
    const method = existingComment ? 'PUT' : 'POST';
    const url = existingComment ? `/comments/${existingComment.id}` : '/comments';
  
    // Objeto do comentário a ser enviado
    const commentPayload = {
      post_id: postId,
      description,
      user_id: user?.id,
    };
  
    try {
      console.log('Enviando payload:', commentPayload);
  
      const response = await customFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentPayload),
      });

      console.log('Corpo da requisição:', { post_id: postId, description, user_id: user?.id });
  
      if (response.ok) {
        const updatedCommentData: Comment = await response.json();
        console.log(
          existingComment ? 'Comentário editado:' : 'Novo comentário adicionado:',
          updatedCommentData
        );
  
        // Atualizar a lista de comentários
        setComments((prevComments) =>
          existingComment
            ? prevComments.map((comment) =>
                comment.id === updatedCommentData.id ? updatedCommentData : comment
              )
            : [...prevComments, updatedCommentData]
        );
  
        // Limpar o campo de comentário após sucesso
        setNewComment((prev) => ({ ...prev, [postId]: '' }));
        setNewCommentTrigger((prev) => !prev);
        setAddComment(false);
      } else {
        const errorMsg = await response.text();
        console.error('Erro na resposta:', errorMsg);
        alert(existingComment ? 'Erro ao editar comentário.' : 'Erro ao adicionar comentário.');
      }
    } catch (error) {
      console.error(
        existingComment ? 'Erro ao editar comentário:' : 'Erro ao adicionar comentário:',
        error
      );
      alert('Erro inesperado. Tente novamente.');
    }
  };   

  const handleDeleteComment = async (commentId: number, userId: number) => {
    if (user?.id === userId) {
      const confirmDelete = window.confirm("Tem certeza que deseja excluir esse comentário?");
      if (!confirmDelete) {
        return; 
      }
      
      try {
        const response = await customFetch(`/comments/${commentId}`, { method: 'DELETE' });
        if (response.ok) {
          setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        } else {
          alert('Erro ao excluir o comentário.');
        }
      } catch (error) {
        console.error('Erro ao excluir o comentário:', error);
      }
    } else {
      alert('Este comentário foi escrito por outro usuário e você não pode excluí-lo')
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-[#403181] via-[#40c4ff] to-[#ff4081] min-h-screen text-white">
      <header className="flex justify-between items-center p-4 bg-[#403181] shadow-lg">
        <h1 className="text-xl font-bold">Post e Comments</h1>
      {user && (
        <div className="flex space-x-4">
          <button
            className="bg-[#ff4081] p-2 rounded-lg text-white text-sm hover:bg-[#ff1a70]"
            onClick={() => editProfile(user.id)}
          >
            Edit Profile
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
                  onClick={() => handleEditPost(post.user_id, post.id)}
                  className="bg-[#ff4081] px-2 py-1 rounded-lg text-white font-medium hover:bg-[#ff1a70]"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletePost(post.user_id, post.id)}
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
                    {editingCommentId === comment.id ? (
                        <input
                          {...register('description')}
                          type="text"
                          value={newComment[comment.id] || comment.description}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewComment((prev) => ({
                              ...prev,
                              [comment.post_id]: value, 
                            }));
                          }}
                          className="w-[70%] px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#40c4ff] focus:border-[#40c4ff]"
                        />
                      ) : (
                        <span className="max-w-[75%] overflow-x-auto">
                          {comment.description}
                        </span>
                      )}
                      <div className="space-x-2">
                      <button
                        onClick={() => {
                          if (editingCommentId === comment.id) {
                            setEditingCommentId(null); 
                            handleUpsertComment(post.id, comment.user_id); 
                          } else {
                            setEditingCommentId(comment.id); 
                          }
                        }}
                        className="bg-[#40c4ff] px-2 py-1 rounded-lg text-white font-medium hover:bg-[#009acd]"
                      >
                        {editingCommentId === comment.id ? 'Salvar' : 'Editar'}
                      </button>
                      <button
                        onClick={() => {
                          if (editingCommentId === comment.id) {
                            setEditingCommentId(null); 
                          } else {
                            handleDeleteComment(comment.id, comment.user_id); 
                          }
                        }}
                        className="bg-red-600 px-2 py-1 rounded-lg text-white font-medium hover:bg-red-800"
                      >
                        {editingCommentId === comment.id ? 'Cancelar' : 'Excluir'}
                      </button>
                      </div>
                    </li>
                  ))}
              </ul>
              {addComment && (
                <div className="mt-4">
                  <textarea
                    value={newComment[post.id] || ''}
                    onChange={(e) => setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="Escreva seu comentário aqui..."
                    className="text-[#403181] mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40c4ff]"
                    rows={4}
                  />
                </div>
              )}
              {!addComment ?  
                <button
                  onClick={() => setAddComment(true)}
                  className="mt-2 bg-[#40c4ff] px-4 py-2 rounded-lg text-white font-medium hover:bg-[#009acd]"
                >
                  Adicionar Comentário
                </button> 
              :  
                <div className='flex gap-4'>
                  <button
                  onClick={() => handleUpsertComment(post.id, post.user_id)}
                  className="mt-2 bg-[#40c4ff] px-4 py-2 rounded-lg text-white font-medium hover:bg-[#009acd]"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setAddComment(false)}
                  className="mt-2 bg-[#403181] px-4 py-2 rounded-lg text-white font-medium hover:bg-[#009acd]"
                >
                  Cancelar
                </button>
                </div>
              }
             
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Posts;
