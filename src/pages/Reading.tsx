import React, { useState, useRef } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Flex,
  Button,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { majorArcana } from '../data/tarotCards';
import TarotCard from '../components/TarotCard';
import FlippableTarotCard from '../components/FlippableTarotCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MotionBox = motion(Box);

const Reading: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  
  const handleCardClick = (id: number, event: React.MouseEvent) => {
    if (selectedCardId === id) {
      return;
    }
    
    if (selectedCardId === null && !isAnimating) {
      // 获取点击位置相对于视口的坐标
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const gridRect = gridRef.current?.getBoundingClientRect() || { top: 0, left: 0 };
      
      // 计算相对于网格的位置
      setCardPosition({
        top: rect.top - gridRect.top,
        left: rect.left - gridRect.left
      });
      
      setIsAnimating(true);
      setSelectedCardId(id);
      
      // 动画完成后重置状态
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  };
  
  const handleBackgroundClick = () => {
    if (selectedCardId !== null && !isAnimating) {
      setSelectedCardId(null);
    }
  };
  
  // 获取选中的卡牌详情
  const selectedCard = majorArcana.find(card => card.id === selectedCardId);
  
  return (
    <Box minH="100vh" bg="black">
      <Header />
      
      <Box py={10} px={4}>
        <Heading 
          as="h1" 
          size="2xl" 
          textAlign="center" 
          mb={8}
          textTransform="uppercase"
        >
          塔罗牌阵
        </Heading>
        
        <Text 
          textAlign="center" 
          maxW="600px" 
          mx="auto" 
          mb={10}
          opacity={0.8}
        >
          请从下方的塔罗牌中选择一张牌，点击后可以查看详细解读。
          {selectedCardId !== null && " 点击空白区域可以返回选牌。"}
        </Text>
        
        {/* 背景遮罩 - 点击返回选牌 */}
        {selectedCardId !== null && (
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={5}
            onClick={handleBackgroundClick}
            cursor="pointer"
          />
        )}
        
        {/* 桌面背景 - 始终可见 */}
        <Box 
          maxW="1200px" 
          mx="auto" 
          bg="black" 
          border="1px solid rgba(255,255,255,0.1)"
          p={8}
          position="relative"
          mb={10}
          minHeight="500px"
          ref={gridRef}
        >
          {/* 选中的牌展示区域 */}
          <AnimatePresence>
            {selectedCard && (
              <MotionBox
                position="absolute"
                zIndex={10}
                initial={{ 
                  top: cardPosition.top,
                  left: cardPosition.left,
                  scale: 0.5,
                  opacity: 1,
                  transform: "translate(0, 0)"
                }}
                animate={{ 
                  top: "50%",
                  left: "50%",
                  scale: 1,
                  opacity: 1,
                  transform: "translate(-50%, -50%)",
                  transition: { duration: 0.8, ease: "easeOut" }
                }}
                exit={{
                  top: cardPosition.top,
                  left: cardPosition.left,
                  scale: 0.5,
                  opacity: 0,
                  transform: "translate(0, 0)",
                  transition: { duration: 0.5 }
                }}
                onClick={(e) => e.stopPropagation()} // 防止点击卡牌时触发背景点击
              >
                <FlippableTarotCard 
                  card={selectedCard} 
                  variant={selectedCard.id % 2 === 0 ? 'normal' : 'inverted'} 
                  isSelected={true}
                />
              </MotionBox>
            )}
          </AnimatePresence>
          
          {/* 整齐排列的塔罗牌 */}
          <Grid 
            templateColumns={{ 
              base: 'repeat(3, 1fr)', 
              md: 'repeat(5, 1fr)', 
              lg: 'repeat(7, 1fr)' 
            }}
            gap={4}
            opacity={selectedCardId !== null ? 0.3 : 1}
            transition="opacity 0.8s ease"
          >
            {majorArcana.map((card) => (
              <Box 
                key={card.id}
                onClick={(e) => handleCardClick(card.id, e)}
                opacity={selectedCardId !== null && selectedCardId !== card.id ? 0.5 : 1}
                transition="opacity 0.3s, transform 0.3s"
                transform={selectedCardId === card.id ? 'scale(0)' : 'none'}
              >
                <TarotCard 
                  card={card} 
                  variant={card.id % 2 === 0 ? 'normal' : 'inverted'} 
                  size="sm"
                />
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Reading;