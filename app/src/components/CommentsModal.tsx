import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image, 
  Platform,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
  useWindowDimensions,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 0;
const navigationBarHeight = Platform.OS === 'android' ? 0 : 0; // Ajustar se necessário
const safeAreaHeight = height - statusBarHeight - navigationBarHeight;

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
}

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  post: any;
  onAddComment: (comment: string, replyTo?: Comment) => void;
  onLikeComment: (commentId: number) => void;
}

const CommentsModal = ({ visible, onClose, post, onAddComment, onLikeComment }: CommentsModalProps) => {
  const [commentText, setCommentText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { height: windowHeight } = useWindowDimensions();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: {
        name: 'Dra. Ana Silva',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
      },
      text: 'Excelente dica! Sempre verifico os sinais vitais antes de qualquer procedimento.',
      timeAgo: '2h',
      likes: 5,
      isLiked: false
    },
    {
      id: 2,
      user: {
        name: 'Dr. Pedro Santos',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
      },
      text: 'Muito útil para residentes! Vou compartilhar com minha turma.',
      timeAgo: '1h',
      likes: 3,
      isLiked: false
    },
    {
      id: 3,
      user: {
        name: 'Dra. Maria Costa',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
      },
      text: 'Qual a frequência ideal para verificação dos sinais vitais?',
      timeAgo: '30min',
      likes: 1,
      isLiked: false
    },
    {
      id: 4,
      user: {
        name: 'Dr. João Silva',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
      },
      text: 'Excelente post! Vou compartilhar com minha equipe.',
      timeAgo: '15min',
      likes: 2,
      isLiked: false
    },
    {
      id: 5,
      user: {
        name: 'Dra. Ana Paula',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
      },
      text: 'Muito útil para residentes! Obrigada por compartilhar.',
      timeAgo: '10min',
      likes: 3,
      isLiked: true
    },
    {
      id: 6,
      user: {
        name: 'Dr. Carlos Eduardo',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
      },
      text: 'Essas dicas são fundamentais para a prática médica.',
      timeAgo: '5min',
      likes: 1,
      isLiked: false
    }
  ]);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Reset para posição inicial antes de animar
      slideAnim.setValue(height);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 800);
    }
  }, [visible]);



  // Restaurar StatusBar quando modal fechar
  useEffect(() => {
    if (!visible) {
      // Restaurar StatusBar para o estado padrão da aplicação (fundo claro)
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
    }
  }, [visible]);

  // Restaurar StatusBar quando componente desmontar
  useEffect(() => {
    return () => {
      // Garantir que a StatusBar seja restaurada quando o componente for desmontado
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
    };
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
        // Scroll para o último comentário quando teclado abrir
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now(),
        user: {
          name: 'Dr. Flávio Caça Rato',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        text: commentText,
        timeAgo: 'Agora',
        likes: 0,
        isLiked: false
      };

      // Adicionar como novo comentário
      setComments(prev => [newComment, ...prev]);
      
      setCommentText('');
      onAddComment(commentText);
    }
  };

  const handleLikeComment = (commentId: number) => {
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 };
        }
        return comment;
      })
    );
    onLikeComment(commentId);
  };



  const handleClose = () => {
    // Restaurar StatusBar antes de fechar (fundo claro)
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('transparent');
    onClose();
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <View className={`${isReply ? 'ml-8' : ''} mb-4`}>
      <View className="flex-row">
        <Image 
          source={{ uri: comment.user.avatar }} 
          className="w-8 h-8 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="font-semibold text-gray-900 mr-2">{comment.user.name}</Text>
            <Text className="text-gray-500 text-xs">{comment.timeAgo}</Text>
          </View>
          <Text className="text-gray-900 mb-2">{comment.text}</Text>
          
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity 
              onPress={() => handleLikeComment(comment.id)}
              className="flex-row items-center"
              style={{ pointerEvents: 'auto' }}
            >
              <Icon 
                name={comment.isLiked ? "favorite" : "favorite-border"} 
                size={16} 
                color={comment.isLiked ? "#ef4444" : "#64748b"} 
              />
              <Text className="text-xs text-gray-500 ml-1">{comment.likes}</Text>
            </TouchableOpacity>
            

          </View>


        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={shouldRender}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={Platform.OS !== 'web'}
      presentationStyle="overFullScreen"
    >
      {shouldRender && <StatusBar backgroundColor="white" barStyle="dark-content" />}
      <View className="flex-1 bg-black bg-opacity-50" style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        <TouchableOpacity 
          className="flex-1" 
          onPress={handleClose}
          activeOpacity={1}
          style={{ pointerEvents: 'auto' }}
        />
        
        <Animated.View 
          className="bg-white"
          style={{
            transform: [{ translateY: slideAnim }],
            height: Platform.OS === 'web' ? height : height,
            width: width,
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200" style={{ 
            paddingTop: Platform.OS === 'ios' ? 50 : Platform.OS === 'web' ? 20 : statusBarHeight + 20,
            backgroundColor: 'white',
            borderBottomColor: '#e5e7eb',
            borderBottomWidth: 1
          }}>
            <TouchableOpacity onPress={handleClose} style={{ pointerEvents: 'auto' }}>
              <Icon name="arrow-back" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">Comentários</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Conteúdo sem KeyboardAvoidingView para Android */}
          <View style={{ flex: 1 }}>
            {/* Comentários em container separado */}
            <View 
              style={{ 
                flex: 1,
                paddingBottom: Platform.OS === 'android' && isKeyboardVisible ? keyboardHeight + 80 : 80
              }}
            >
              <ScrollView 
                ref={scrollViewRef}
                className="flex-1 px-4 py-2"
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ 
                  paddingBottom: Platform.OS === 'android' ? 120 : 80 
                }}
                bounces={true}
                alwaysBounceVertical={true}
              >
                {comments.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </ScrollView>
            </View>

            {/* Campo de comentário posicionado absolutamente */}
            <View 
              className="border-t border-gray-200 p-4 bg-white"
              style={{
                position: 'absolute',
                bottom: Platform.OS === 'android' && isKeyboardVisible ? keyboardHeight : 0,
                left: 0,
                right: 0,
                paddingBottom: Platform.OS === 'android' ? 60 : 16
              }}
            >
              <View className="flex-row items-center">
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }} 
                  className="w-8 h-8 rounded-full mr-3"
                />
                <TextInput
                  ref={inputRef}
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Comentar como Dr. Flávio Caça Rato..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
                  multiline
                  autoFocus
                  blurOnSubmit={false}
                />
                <TouchableOpacity 
                  onPress={handleSubmitComment}
                  disabled={!commentText.trim()}
                  className={`px-4 py-2 rounded-full ${
                    commentText.trim() ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Text className={`text-sm font-medium ${
                    commentText.trim() ? 'text-white' : 'text-gray-500'
                  }`}>
                    Postar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CommentsModal; 