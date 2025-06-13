import React from 'react';
import { 
  Box, 
  Image,
} from '@chakra-ui/react';
import { TarotCard as TarotCardType } from '../data/tarotCards';

interface TarotCardProps {
  card: TarotCardType;
  variant?: 'normal' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
}

const TarotCard2: React.FC<TarotCardProps> = ({ 
  card, 
  variant = 'normal',
  size = 'md'
}) => {
  // 根据尺寸设置卡片大小
  const cardSizes = {
    sm: { width: '100px', height: '160px' },
    md: { width: '180px', height: '300px' },
    lg: { width: '220px', height: '360px' }
  };
  
  const { width, height } = cardSizes[size];
  
  return (
    <Box
      w={width}
      h={height}
      position="relative"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-10px)',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5)'
      }}
      cursor="pointer"
      overflow="hidden"
    >
      {/* 使用图片作为卡牌 */}
      {card.image && (
        <Image 
          src={card.image} 
          alt={card.name}
          w="100%"
          h="100%"
          objectFit="cover"
        />
      )}
    </Box>
  );
};

export default TarotCard2;