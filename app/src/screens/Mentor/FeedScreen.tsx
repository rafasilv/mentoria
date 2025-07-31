import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Alert, RefreshControl, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MentorLayout from '../../components/MentorLayout';
import FeedPostActions from '../../components/FeedPostActions';
import CreatePostButton from '../../components/CreatePostButton';

const { width } = Dimensions.get('window');

const FeedScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simular carregamento de novos posts
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Feed Atualizado', 'Seus posts foram atualizados!');
    }, 2000);
  }, []);

  const [posts, setPosts] = useState([
    {
      id: 1,
      mentor: {
        name: 'Dr. Flávio Caça Rato',
        specialty: 'Cardiologia',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'Dica importante para residentes: Sempre verifiquem os sinais vitais antes de qualquer procedimento. A atenção aos detalhes pode salvar vidas! 💙 #Medicina #Residência #Cardiologia',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      likes: 24,
      comments: 8,
      timeAgo: '2h',
      isLiked: false,
      isSaved: false
    },
    {
      id: 2,
      mentor: {
        name: 'Dr. Flávio Caça Rato',
        specialty: 'Cardiologia',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'Hoje na sala de emergência: caso interessante de infarto agudo do miocárdio. Lembrem-se, tempo é músculo! ⚡ #Cardiologia #Emergência #IAM',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop',
      likes: 31,
      comments: 12,
      timeAgo: '4h',
      isLiked: true,
      isSaved: true
    },
    {
      id: 3,
      mentor: {
        name: 'Dr. Flávio Caça Rato',
        specialty: 'Cardiologia',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'Resumo da aula de hoje: Interpretação de ECG em casos de arritmias. Fundamental para o diagnóstico diferencial! ❤️ #Cardiologia #ECG #Arritmias',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
      likes: 18,
      comments: 5,
      timeAgo: '6h',
      isLiked: false,
      isSaved: false
    },
    {
      id: 4,
      mentor: {
        name: 'Dr. Flávio Caça Rato',
        specialty: 'Cardiologia',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'Técnica cirúrgica: Cateterismo cardíaco - pontos importantes para residentes. A precisão é fundamental! 🩺 #Cardiologia #Cateterismo #Intervencionismo',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
      likes: 42,
      comments: 15,
      timeAgo: '8h',
      isLiked: false,
      isSaved: true
    }
  ]);

  // Funções para manipular os posts
  const handleLike = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleComment = (postId: number, comment: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
    Alert.alert('Comentário', 'Comentário adicionado com sucesso!');
  };

  const handleShare = (postId: number) => {
    Alert.alert('Compartilhar', 'Post compartilhado com sucesso!');
  };

  const handleSave = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
  };

  const handleCreatePost = () => {
    // Função para criar post (será implementada posteriormente)
    console.log('Criar post');
  };

  const PostCard = ({ post }: { post: any }) => (
    <View className="bg-white mb-4 border-b border-gray-100">
      {/* Header do Post */}
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center flex-1">
          <Image 
            source={{ uri: post.mentor.avatar }} 
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="font-semibold text-gray-900">{post.mentor.name}</Text>
              {post.mentor.verified && (
                <Icon name="verified" size={16} color="#0f766e" style={{ marginLeft: 4 }} />
              )}
            </View>
            <Text className="text-sm text-gray-500">{post.mentor.specialty}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="more-horiz" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo do Post */}
      <View className="px-4 pb-2">
        <Text className="text-gray-900 leading-5 mb-3">{post.content}</Text>
      </View>

      {/* Imagem do Post */}
      {post.image && (
        <View className="mb-3">
          <Image 
            source={{ uri: post.image }} 
            className="w-full h-64"
            resizeMode="cover"
          />
        </View>
      )}

      {/* Ações do Post */}
      <FeedPostActions 
        post={post}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onSave={handleSave}
      />
    </View>
  );

  return (
    <>
      <View style={{ 
        flex: 1, 
        backgroundColor: '#f8fafc'
      }}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          className="force-scroll"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0f766e']}
              tintColor="#0f766e"
            />
          }
        >
          {/* Posts */}
          <View>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Botão de criar post - renderizado fora do container principal */}
      <CreatePostButton onPress={handleCreatePost} />
    </>
  );
};

export default FeedScreen; 