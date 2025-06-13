import React, { useState } from 'react';
import { 
  Box, 
  Text, 
  Flex,
  Heading,
} from '@chakra-ui/react';
import { TarotCard as TarotCardType } from '../data/tarotCards';

interface FlippableTarotCardProps {
  card: TarotCardType;
  variant?: 'normal' | 'inverted';
  isSelected?: boolean;
  onClick?: () => void;
}

const FlippableTarotCard: React.FC<FlippableTarotCardProps> = ({ 
  card, 
  variant = 'normal',
  isSelected = false,
  onClick
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isInverted = variant === 'inverted';
  
  const handleClick = () => {
    if (!isSelected) {
      if (onClick) onClick();
    } else {
      setIsFlipped(!isFlipped);
    }
  };
  
  return (
    <Box
      w={{ base: "180px", md: "220px" }}
      h={{ base: "300px", md: "360px" }}
      position="relative"
      cursor="pointer"
      onClick={handleClick}
      transition="transform 0.5s"
      transform={isSelected ? 'scale(1.05)' : 'scale(1)'}
      sx={{
        perspective: "1000px",
        "& > div": {
          transformStyle: "preserve-3d"
        }
      }}
    >
      <Box
        position="absolute"
        w="100%"
        h="100%"
        transition="transform 0.8s"
        transform={isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'}
      >
        {/* 卡牌正面 */}
        <Box
          position="absolute"
          w="100%"
          h="100%"
          bg={isInverted ? 'black' : 'white'}
          color={isInverted ? 'white' : 'black'}
          border="1px solid"
          borderColor={isInverted ? 'white' : 'black'}
          sx={{
            backfaceVisibility: "hidden"
          }}
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
            p={4}
          >
            {/* 卡牌名称 */}
            <Text
              fontSize="sm"
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
              w="80px"
              h="80px"
              borderRadius="full"
              border="1px solid"
              borderColor={isInverted ? 'white' : 'black'}
              align="center"
              justify="center"
              fontSize="3xl"
            >
              {card.symbol || card.id}
            </Flex>
            
            {/* 卡牌编号 */}
            <Box>
              <Text
                fontSize="sm"
                opacity={0.7}
                textAlign="center"
                mb={2}
              >
                {card.id < 10 ? `0${card.id}` : card.id}
              </Text>
            </Box>
          </Flex>
        </Box>
        
        {/* 卡牌背面（解读信息） */}
        <Box
          position="absolute"
          w="100%"
          h="100%"
          bg={!isInverted ? 'black' : 'white'}
          color={!isInverted ? 'white' : 'black'}
          border="1px solid"
          borderColor={!isInverted ? 'white' : 'black'}
          p={4}
          overflowY="auto"
          sx={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <Heading size="sm" mb={3} textAlign="center" textTransform="uppercase">
            {card.name}
          </Heading>
          
          <Box h="1px" bg="currentColor" opacity={0.3} my={2} />
          
          <Text fontSize="xs" mb={3}>
            {card.description}
          </Text>
          
          <Text fontSize="xs" fontStyle="italic" opacity={0.8} textAlign="center" mt={4}>
            点击卡牌再次翻转
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default FlippableTarotCard;