import React from 'react';
import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { TarotCard } from '../data/tarotCards';

interface TarotTableProps {
  cards: TarotCard[];
}

const TarotTable: React.FC<TarotTableProps> = ({ cards }) => {
  const tableBg = 'rgba(25, 25, 40, 0.7)';
  const cardBg = 'gray.800';
  const cardBorder = 'gray.700';

  return (
    <Box
      position="relative"
      w="100%"
      h={{ base: '400px', md: '600px' }}
      bg={tableBg}
      borderRadius="xl"
      boxShadow="0 0 20px rgba(138, 43, 226, 0.3)"
      p={4}
      overflow="hidden"
      backdropFilter="blur(10px)"
    >
      {/* 神秘纹理覆盖 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle, rgba(138, 43, 226, 0.1) 0%, rgba(25, 25, 40, 0) 70%)"
        opacity={0.6}
      />

      {/* 塔罗牌展示区 */}
      <Flex
        position="relative"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        h="100%"
        zIndex={1}
      >
        {/* 牌堆 */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={1}
        >
          <Box
            position="relative"
            w="120px"
            h="200px"
            transform="rotate(-5deg)"
          >
            {[...Array(5)].map((_, i) => (
              <Box
                key={`deck-${i}`}
                position="absolute"
                top={`${i * 1}px`}
                left={`${i * 1}px`}
                w="120px"
                h="200px"
                borderRadius="md"
                boxShadow="dark-lg"
                bg="tarot.darkPurple"
                border="1px solid"
                borderColor="tarot.gold"
                transform={`rotate(${i * 0.5}deg)`}
              />
            ))}
          </Box>
        </Box>

        {/* 散落的塔罗牌 */}
        {cards.map((card, index) => {
          // 计算随机位置和旋转角度
          const angle = Math.random() * 360;
          const distance = 150 + Math.random() * 150;
          const x = Math.cos((angle * Math.PI) / 180) * distance;
          const y = Math.sin((angle * Math.PI) / 180) * distance;
          const rotation = Math.random() * 60 - 30;
          const scale = 0.7 + Math.random() * 0.3;
          const zIndex = Math.floor(Math.random() * 10);
          
          // 只显示部分牌
          if (index % 3 !== 0 && index > 5) return null;

          return (
            <Box
              key={card.id}
              position="absolute"
              top="50%"
              left="50%"
              transform={`translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`}
              w="100px"
              h="170px"
              zIndex={zIndex}
              transition="all 0.4s ease"
              bg={cardBg}
              borderRadius="md"
              boxShadow="0 0 15px rgba(138, 43, 226, 0.3)"
              border="1px solid"
              borderColor={cardBorder}
              overflow="hidden"
              _hover={{
                transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale * 1.1})`,
                zIndex: 20,
                boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)"
              }}
            >
              <Flex 
                direction="column" 
                align="center" 
                justify="space-between" 
                h="100%" 
                p={2}
                bgGradient="linear(to-b, gray.800, rgba(45, 27, 78, 0.8))"
              >
                <Text 
                  fontSize="sm" 
                  fontWeight="bold" 
                  textAlign="center"
                  color={card.color || 'tarot.purple'}
                  mb={1}
                >
                  {card.name}
                </Text>
                
                <Flex 
                  w="60px" 
                  h="60px" 
                  borderRadius="full" 
                  bg="rgba(0,0,0,0.3)"
                  backdropFilter="blur(5px)"
                  border="1px solid" 
                  borderColor={card.color || 'tarot.purple'}
                  align="center"
                  justify="center"
                  fontSize="3xl"
                  fontWeight="bold"
                  color={card.color || 'tarot.purple'}
                  boxShadow={`0 0 10px ${card.color || 'rgba(138, 43, 226, 0.5)'}`}
                >
                  {card.symbol || card.id}
                </Flex>
                
                <Box mt={2}>
                  <Text 
                    fontSize="xs" 
                    textAlign="center"
                    color="gray.300"
                    noOfLines={2}
                  >
                    {card.description.split('，')[0]}
                  </Text>
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};

export default TarotTable;