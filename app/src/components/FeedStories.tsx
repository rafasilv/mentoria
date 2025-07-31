import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';

const FeedStories = () => {
  const stories = [
    {
      id: 1,
      mentor: {
        name: 'Dr. Carlos',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        hasStory: true,
        isViewed: false
      }
    },
    {
      id: 2,
      mentor: {
        name: 'Dra. Ana',
        avatar: 'https://images.unsplash.com/photo-1594824475544-3b0b3b3b3b3b?w=150&h=150&fit=crop&crop=face',
        hasStory: true,
        isViewed: true
      }
    },
    {
      id: 3,
      mentor: {
        name: 'Dr. Pedro',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
        hasStory: true,
        isViewed: false
      }
    },
    {
      id: 4,
      mentor: {
        name: 'Dra. Maria',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        hasStory: false,
        isViewed: false
      }
    },
    {
      id: 5,
      mentor: {
        name: 'Dr. João',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        hasStory: true,
        isViewed: false
      }
    }
  ];

  const StoryItem = ({ story }: { story: any }) => (
    <TouchableOpacity className="items-center mr-4">
      <View className={`w-16 h-16 rounded-full p-0.5 ${
        story.mentor.hasStory 
          ? story.mentor.isViewed 
            ? 'bg-gray-300' 
            : 'bg-gradient-to-r from-purple-400 to-pink-400'
          : 'bg-gray-200'
      }`}>
        <Image 
          source={{ uri: story.mentor.avatar }} 
          className="w-full h-full rounded-full"
        />
      </View>
      <Text className="text-xs text-gray-600 mt-1 text-center" numberOfLines={1}>
        {story.mentor.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="bg-white py-4 border-b border-gray-100">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {stories.map((story) => (
          <StoryItem key={story.id} story={story} />
        ))}
      </ScrollView>
    </View>
  );
};

export default FeedStories; 