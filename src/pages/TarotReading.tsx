import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Button,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { majorArcana, TarotCard as TarotCardType } from '../data/tarotCards';
import TarotCard from '../components/TarotCard';
import CardSlot from '../components/CardSlot';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReadingResult from '../components/ReadingResult';

const MotionBox = motion(Box);

const TarotReading: React.FC = () => {
  // 使用对象存储每个位置的卡牌ID，而不是数组
  const [slotCards, setSlotCards] = useState<{[key: number]: number | null}>({
    0: null, // 过去
    1: null, // 现在
    2: null  // 未来
  });
  const [cardPositions, setCardPositions] = useState<{[key: number]: {top: number, left: number}}>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [returningCard, setReturningCard] = useState<number | null>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(0); // 当前活跃的卡槽
  const { isOpen, onOpen, onClose } = useDisclosure();
  const gridRef = useRef<HTMLDivElement>(null);
  
  const slots = [
    { id: 0, label: '过去' },
    { id: 1, label: '现在' },
    { id: 2, label: '未来' }
  ];
  
  // 获取所有已选择的卡牌ID
  const selectedCardIds = Object.values(slotCards).filter((id): id is number => id !== null);
  
  // 找到第一个空的卡槽（最左边的）
  const findFirstEmptySlot = () => {
    for (let i = 0; i < 3; i++) {
      if (slotCards[i] === null) {
        return i;
      }
    }
    return null; // 所有卡槽都已填满
  };
  
  // 自动更新活跃卡槽为最左边的空卡槽
  useEffect(() => {
    if (!isAnimating) {
      const firstEmptySlot = findFirstEmptySlot();
      setActiveSlot(firstEmptySlot);
    }
  }, [slotCards, isAnimating]);
  
  // 添加一个延迟状态，用于解读符号的平滑过渡
  const [showReadingSymbol, setShowReadingSymbol] = useState(false);
  
  // 监听卡牌数量变化，控制解读符号的显示状态
  useEffect(() => {
    if (selectedCardIds.length === 3) {
      // 三张牌都就位，显示解读符号
      setShowReadingSymbol(true);
    } else if (selectedCardIds.length < 3) {
      // 有卡牌被移除，立即开始退出动画
      setShowReadingSymbol(false);
    }
  }, [selectedCardIds.length]);
  
  const handleCardClick = (id: number, event: React.MouseEvent) => {
    if (selectedCardIds.includes(id) || isAnimating || activeSlot === null) {
      return;
    }
    
    // 检查活跃卡槽是否已经有牌
    if (slotCards[activeSlot] !== null) {
      return;
    }
    
    // 获取点击位置相对于视口的坐标
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect() || { top: 0, left: 0 };
    
    // 计算相对于网格的位置
    const position = {
      top: rect.top - gridRect.top,
      left: rect.left - gridRect.left
    };
    
    // 保存卡牌位置
    setCardPositions(prev => ({
      ...prev,
      [id]: position
    }));
    
    setIsAnimating(true);
    
    // 更新卡槽中的卡牌
    setSlotCards(prev => ({
      ...prev,
      [activeSlot]: id
    }));
    
    // 动画完成后重置动画状态
    setTimeout(() => {
      setIsAnimating(false);
      // activeSlot会通过useEffect自动更新
    }, 800);
  };
  
  const handleSlotCardClick = (slotIndex: number) => {
    if (isAnimating || returningCard !== null) return;
    
    const cardId = slotCards[slotIndex];
    if (cardId === null) return;
    
    // 设置正在返回的卡牌
    setReturningCard(cardId);
    setIsAnimating(true);
    
    // 如果移除后卡牌数量将少于3，立即触发解读符号的退出动画
    if (selectedCardIds.length <= 3) {
      setShowReadingSymbol(false);
    }
    
    // 动画完成后移除卡牌
    setTimeout(() => {
      // 清空该卡槽
      setSlotCards(prev => ({
        ...prev,
        [slotIndex]: null
      }));
      
      setReturningCard(null);
      setIsAnimating(false);
      // activeSlot会通过useEffect自动更新
    }, 800);
  };
  
  // 点击空卡槽激活它
  const handleEmptySlotClick = (slotIndex: number) => {
    if (slotCards[slotIndex] === null && !isAnimating) {
      setActiveSlot(slotIndex);
    }
  };
  
  // 检查是否所有卡槽都已填满
  const allSlotsFilled = selectedCardIds.length === 3;
  
  // 获取选中的卡牌详情，确保没有undefined值
  const selectedCardDetails: TarotCardType[] = Object.values(slotCards)
    .filter((id): id is number => id !== null)
    .map(id => majorArcana.find(card => card.id === id))
    .filter((card): card is TarotCardType => card !== undefined);
  
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
          三张牌阵
        </Heading>
        
        <Text 
          textAlign="center" 
          maxW="600px" 
          mx="auto" 
          mb={10}
          opacity={0.8}
        >
          请从下方的塔罗牌中选择三张牌，它们将分别代表你的过去、现在和未来。
          {selectedCardIds.length > 0 && " 点击卡槽中的牌可以将其放回。"}
          {!allSlotsFilled && " 点击空卡槽可以选择填充位置。"}
        </Text>
        
        {/* 卡槽区域和解读按钮 */}
        <Flex 
          justify="center" 
          mb={10} 
          gap={{ base: 2, md: 6 }}
          flexWrap={{ base: "wrap", md: "nowrap" }}
          align="center"
        >
          <Flex gap={{ base: 2, md: 6 }} flexWrap={{ base: "wrap", md: "nowrap" }}>
            {slots.map((slot) => (
              <Box 
                key={slot.id} 
                position="relative" 
                mb={{ base: 4, md: 0 }}
                onClick={() => handleEmptySlotClick(slot.id)}
                cursor={slotCards[slot.id] === null ? "pointer" : "default"}
              >
                <CardSlot 
                  label={slot.label} 
                  isActive={activeSlot === slot.id}
                />
                
                {/* 已放置的卡牌 */}
                <AnimatePresence>
                  {slotCards[slot.id] !== null && (
                    <MotionBox
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      initial={{ 
                        top: cardPositions[slotCards[slot.id]!]?.top || 0,
                        left: cardPositions[slotCards[slot.id]!]?.left || 0,
                        opacity: 1,
                        scale: 0.5,
                        transform: "translate(0, 0)"
                      }}
                      animate={{ 
                        top: returningCard === slotCards[slot.id] 
                          ? cardPositions[slotCards[slot.id]!]?.top || 0
                          : "0",
                        left: returningCard === slotCards[slot.id] 
                          ? cardPositions[slotCards[slot.id]!]?.left || 0
                          : "0",
                        opacity: returningCard === slotCards[slot.id] ? 0 : 1,
                        scale: returningCard === slotCards[slot.id] ? 0.5 : 1,
                        transform: "translate(0, 0)",
                        transition: { duration: 0.8, ease: "easeOut" }
                      }}
                      onClick={() => handleSlotCardClick(slot.id)}
                      cursor="pointer"
                    >
                      <TarotCard 
                        card={majorArcana.find(card => card.id === slotCards[slot.id])!} 
                        variant={slotCards[slot.id]! % 2 === 0 ? 'normal' : 'inverted'} 
                      />
                    </MotionBox>
                  )}
                </AnimatePresence>
              </Box>
            ))}
          </Flex>
          
          {/* 解读按钮放在卡槽右侧 - 简约白色符号 */}
          <Box ml={{ base: 0, md: 10 }} mt={{ base: 8, md: 0 }}>
            <AnimatePresence>
              {/* 使用AnimatePresence包裹，确保exit动画生效 */}
              {(allSlotsFilled || showReadingSymbol) && (
                <MotionBox
              w="80px"
              h="80px"
              position="relative"
              cursor={allSlotsFilled && !isAnimating ? "pointer" : "not-allowed"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ 
                opacity: allSlotsFilled ? 1 : 0,
                scale: allSlotsFilled ? 1 : 0.6,
                y: allSlotsFilled ? 0 : 20
              }}
              exit={{
                opacity: 0,
                scale: 0.6,
                y: 20,
                transition: { duration: 1.2, ease: "easeInOut" }
              }}
              transition={{ 
                duration: 1.2,
                ease: "easeOut",
                delay: selectedCardIds.length === 3 ? 0.3 : 0
              }}
              onClick={() => {
                if (allSlotsFilled && !isAnimating) {
                  // 点击时先闪烁一下，然后旋转一圈，最后打开解读
                  const timeline = async () => {
                    // 先闪烁
                    const elem = document.querySelector('.reading-symbol') as HTMLElement;
                    if (elem) {
                      elem.style.filter = 'brightness(2) drop-shadow(0 0 15px white)';
                      elem.style.transition = 'transform 0.8s ease-in-out, filter 0.2s ease';
                      await new Promise(resolve => setTimeout(resolve, 200));
                      
                      // 然后旋转一圈
                      elem.style.transform = 'rotate(360deg)';
                      await new Promise(resolve => setTimeout(resolve, 800));
                      
                      elem.style.filter = '';
                      elem.style.transform = '';
                    }
                    // 最后打开解读
                    onOpen();
                  };
                  timeline();
                }
              }}
              whileHover={allSlotsFilled && !isAnimating ? { 
                scale: 1.15,
                rotate: 15,
                filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.7))",
                transition: { 
                  duration: 0.8,
                  rotate: {
                    duration: 1.2,
                    ease: "easeInOut"
                  }
                }
              } : {}}
              whileTap={allSlotsFilled && !isAnimating ? { 
                scale: 0.9,
                opacity: 0.8,
                filter: "brightness(1.5)",
                transition: { duration: 0.1 }
              } : {}}
            >
              {/* 更精致的神秘符号 */}
              <Box
                as="svg"
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
                fill="none"
                stroke="white"
                strokeWidth="1"
                opacity={allSlotsFilled ? 1 : 0}
                className="reading-symbol"
                style={{ transformOrigin: "center", pointerEvents: allSlotsFilled && !isAnimating ? "auto" : "none" }}
              >
                {/* 外圆 */}
                <circle cx="50" cy="50" r="48" strokeWidth="0.5" />
                
                {/* 内圆 */}
                <circle cx="50" cy="50" r="36" strokeWidth="0.5" />
                
                {/* 五角星 */}
                <path 
                  d="M50 15 L61 42 L90 42 L67 60 L75 85 L50 70 L25 85 L33 60 L10 42 L39 42 Z" 
                  fill="none" 
                  strokeWidth="0.8"
                />
                
                {/* 装饰线条 */}
                <path d="M50 2 L50 98" strokeWidth="0.5" opacity="0.7" />
                <path d="M2 50 L98 50" strokeWidth="0.5" opacity="0.7" />
                
                {/* 月亮符号 */}
                <path 
                  d="M65 30 A15 15 0 0 0 65 60 A15 15 0 0 1 65 30" 
                  fill="white" 
                  strokeWidth="0"
                  opacity="0.9"
                />
                
                {/* 太阳符号 */}
                <circle cx="35" cy="45" r="8" fill="white" strokeWidth="0" opacity="0.9" />
                <path d="M35 33 L35 37 M35 53 L35 57 M23 45 L27 45 M43 45 L47 45 M27 37 L30 40 M40 50 L43 53 M27 53 L30 50 M40 40 L43 37" strokeWidth="1" opacity="0.9" />
              </Box>
              
              {/* 解读文字 - 悬停时显示 */}
              <MotionBox
                position="absolute"
                bottom="-30px"
                left="50%"
                transform="translateX(-50%)"
                fontSize="xs"
                fontWeight="300"
                color="white"
                letterSpacing="3px"
                textTransform="uppercase"
                initial={{ opacity: 0, y: 5 }}
                animate={{ 
                  opacity: allSlotsFilled ? 0.8 : 0,
                  y: allSlotsFilled ? 0 : 5
                }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ delay: allSlotsFilled ? 0.5 : 0, duration: 0.5 }}
                whileHover={allSlotsFilled && !isAnimating ? { opacity: 1 } : {}}
                pointerEvents="none"
              >
                解读
              </MotionBox>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>
        </Flex>
        
        {/* 选择提示 */}
        <Flex justify="center" mb={8}>
          <Text fontSize="sm" opacity={0.7}>
            已选择 {selectedCardIds.length}/3 张牌
          </Text>
        </Flex>
        
        {/* 桌面背景 */}
        <Box 
          maxW="1200px" 
          mx="auto" 
          bg="black" 
          border="1px solid rgba(255,255,255,0.1)"
          p={8}
          position="relative"
          mb={10}
          ref={gridRef}
        >
          {/* 整齐排列的塔罗牌 */}
          <Grid 
            templateColumns={{ 
              base: 'repeat(3, 1fr)', 
              md: 'repeat(5, 1fr)', 
              lg: 'repeat(7, 1fr)' 
            }}
            gap={4}
          >
            {majorArcana.map((card) => (
              <Box 
                key={card.id}
                onClick={(e) => handleCardClick(card.id, e)}
                opacity={selectedCardIds.includes(card.id) && returningCard !== card.id ? 0 : 1}
                transition="opacity 0.3s, transform 0.3s"
                transform={selectedCardIds.includes(card.id) && returningCard !== card.id ? 'scale(0)' : 'none'}
                visibility={selectedCardIds.includes(card.id) && returningCard !== card.id ? 'hidden' : 'visible'}
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
        
        {/* 底部操作按钮已移至卡槽右侧 */}
      </Box>
      
      {/* 解读结果弹窗 */}
      <ReadingResult 
        isOpen={isOpen} 
        onClose={onClose} 
        selectedCards={selectedCardDetails}
      />
      
      <Footer />
    </Box>
  );
};

export default TarotReading;