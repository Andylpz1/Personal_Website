import React from 'react';
import { 
  Box, 
  Text, 
  Flex,
} from '@chakra-ui/react';
import { TarotCard as TarotCardType } from '../data/tarotCards';

interface TarotCardProps {
  card: TarotCardType;
  variant?: 'normal' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
}

const TarotCard1: React.FC<TarotCardProps> = ({ 
  card, 
  variant = 'normal',
  size = 'md'
}) => {
  const isInverted = variant === 'inverted';
  
  // 根据尺寸设置卡片大小
  const cardSizes = {
    sm: { width: '100px', height: '160px', fontSize: 'xs', symbolSize: '40px' },
    md: { width: '180px', height: '300px', fontSize: 'sm', symbolSize: '80px' },
    lg: { width: '220px', height: '360px', fontSize: 'md', symbolSize: '100px' }
  };
  
  const { width, height, fontSize, symbolSize } = cardSizes[size];
  
  return (
    <Box
      w={width}
      h={height}
      bg={isInverted ? 'black' : 'white'}
      color={isInverted ? 'white' : 'black'}
      border="1px solid"
      borderColor={isInverted ? 'white' : 'black'}
      position="relative"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-10px)',
        boxShadow: isInverted 
          ? '0 10px 30px -5px rgba(255, 255, 255, 0.3)' 
          : '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
      }}
      cursor="pointer"
    >
      {/* 卡牌边框 */}
      <Box
        position="absolute"
        top="10px"
        left="10px"
        right="10px"
        bottom="10px"
        border="1px solid"
        borderColor={isInverted ? 'white' : 'black'}
        opacity={0.5}
        pointerEvents="none"
      />
      
      {/* 卡牌内容 */}
      <Flex
        direction="column"
        align="center"
        justify="space-between"
        h="100%"
        p={size === 'sm' ? 2 : 4}
      >
        {/* 卡牌名称 */}
        <Text
          fontSize={fontSize}
          fontWeight="bold"
          textAlign="center"
          textTransform="uppercase"
          letterSpacing="1px"
          mt={2}
        >
          {card.name}
        </Text>
        
        {/* 卡牌符号 */}
        <Flex
          w={symbolSize}
          h={symbolSize}
          borderRadius="full"
          border="1px solid"
          borderColor={isInverted ? 'white' : 'black'}
          align="center"
          justify="center"
          fontSize={size === 'sm' ? 'xl' : '3xl'}
        >
          {card.symbol || card.id}
        </Flex>
        
        {/* 卡牌编号 */}
        <Box>
          <Text
            fontSize={size === 'sm' ? 'xs' : 'sm'}
            opacity={0.7}
            textAlign="center"
            mb={size === 'sm' ? 1 : 2}
          >
            {card.id < 10 ? `0${card.id}` : card.id}
          </Text>
          
          {/* 卡牌描述 - 小尺寸时隐藏 */}
          {size !== 'sm' && (
            <Text
              fontSize="xs"
              textAlign="center"
              noOfLines={2}
              opacity={0.8}
            >
              {card.description.split('，')[0]}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default TarotCard1;