import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommentsModal from './CommentsModal';

interface FeedPostActionsProps {
  post: any;
  onLike: (postId: number) => void;
  onComment: (postId: number, comment: string) => void;
  onShare: (postId: number) => void;
  onSave: (postId: number) => void;
}

const FeedPostActions = ({ post, onLike, onComment, onShare, onSave }: FeedPostActionsProps) => {
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const handleLike = () => {
    onLike(post.id);
  };

  const handleComment = () => {
    setShowCommentsModal(true);
  };

  const handleShare = () => {
    onShare(post.id);
    Alert.alert('Compartilhar', 'Post compartilhado com sucesso!');
  };

  const handleSave = () => {
    onSave(post.id);
  };

  const handleAddComment = (comment: string, replyTo?: any) => {
    onComment(post.id, comment);
  };

  const handleLikeComment = (commentId: number) => {
    // Implementar lógica de like do comentário
    console.log('Like comment:', commentId);
  };

  return (
    <View className="px-4 pb-4">
      {/* Ações principais */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={handleLike} className="flex-row items-center">
            <Icon 
              name={post.isLiked ? "favorite" : "favorite-border"} 
              size={24} 
              color={post.isLiked ? "#ef4444" : "#64748b"} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleComment} className="flex-row items-center">
            <Icon name="chat-bubble-outline" size={24} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} className="flex-row items-center">
            <Icon name="send" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSave}>
          <Icon 
            name={post.isSaved ? "bookmark" : "bookmark-border"} 
            size={24} 
            color={post.isSaved ? "#0f766e" : "#64748b"} 
          />
        </TouchableOpacity>
      </View>

      {/* Estatísticas */}
      <View className="mb-2">
        <Text className="font-semibold text-gray-900">{post.likes} curtidas</Text>
      </View>

      {/* Comentários */}
      <View className="mb-2">
        <Text className="text-gray-900">
          <Text className="font-semibold">{post.mentor.name}</Text>
          <Text> {post.content.substring(0, 50)}...</Text>
        </Text>
      </View>

      {/* Ver todos os comentários */}
      {post.comments > 0 && (
        <TouchableOpacity onPress={handleComment} className="mb-2">
          <Text className="text-gray-500 text-sm">Ver todos os {post.comments} comentários</Text>
        </TouchableOpacity>
      )}

      {/* Tempo */}
      <Text className="text-gray-400 text-xs">{post.timeAgo}</Text>

      {/* Modal de Comentários */}
      <CommentsModal
        visible={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        post={post}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
      />
    </View>
  );
};

export default FeedPostActions; 