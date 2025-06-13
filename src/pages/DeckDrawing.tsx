import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { majorArcana, TarotCard as TarotCardType } from '../data/tarotCards';
import TarotCard from '../components/TarotCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReadingResult from '../components/ReadingResult';

// 确保Header和Footer组件正确导出为JSX元素
const HeaderComponent = () => <Header />;
const FooterComponent = () => <Footer />;

const MotionBox = motion(Box);

const DeckDrawing: React.FC = () => {
  // 状态
  const [deck, setDeck] = useState<TarotCardType[]>([]);
  const [drawnCards, setDrawnCards] = useState<TarotCardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<{[key: number]: boolean}>({});
  const [gameState, setGameState] = useState<'initial' | 'shuffling' | 'shuffled' | 'drawing' | 'adjusting' | 'drawn'>('initial');
  const [isAnimating, setIsAnimating] = useState(false);
  const [deckStyle, setDeckStyle] = useState<'original' | 'image'>('image');
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // 动画控制
  const readingSymbolControls = useAnimation();

  // 初始化牌组
  useEffect(() => {
    try {
      setDeck([...majorArcana]);
    } catch (error) {
      console.error("初始化牌组失败:", error);
    }
  }, []);

  // 洗牌函数
  const shuffleDeck = () => {
    if (isAnimating || gameState !== 'initial') return;
    
    setIsAnimating(true);
    setGameState('shuffling');
    
    // 洗牌动画
    const shuffleTimer = setTimeout(() => {
      try {
        // Fisher-Yates 洗牌算法
        const newDeck = [...deck];
        for (let i = newDeck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        
        setDeck(newDeck);
        setGameState('shuffled');
      } catch (error) {
        console.error("洗牌失败:", error);
        // 出错时重置到初始状态
        setGameState('initial');
      } finally {
        setIsAnimating(false);
      }
    }, 2000); // 洗牌动画持续2秒
    
    // 组件卸载时清除定时器
    return () => clearTimeout(shuffleTimer);
  };

  // 抽牌函数
  const drawCards = () => {
    if (isAnimating || gameState !== 'shuffled') return;
    
    setIsAnimating(true);
    setGameState('drawing');
    
    // 抽取前三张牌
    const drawn = deck.slice(0, 3);
    
    // 抽牌动画 - 先显示动画，然后设置抽出的牌
    const drawTimer = setTimeout(() => {
      try {
        // 先发牌到位置
        setDrawnCards(drawn);
        
        // 立即开始向中间靠拢，不再有延迟
        setGameState('adjusting');
        
        // 调整完成后设置为最终状态
        const adjustTimer = setTimeout(() => {
          setGameState('drawn');
          setIsAnimating(false);
        }, 400);
        
        return () => clearTimeout(adjustTimer);
      } catch (error) {
        console.error("抽牌失败:", error);
        // 出错时重置到洗牌完成状态
        setGameState('shuffled');
        setIsAnimating(false);
      }
    }, 2000); // 抽牌动画持续2秒，减少等待时间
    
    // 组件卸载时清除定时器
    return () => clearTimeout(drawTimer);
  };

  // 翻牌函数
  const flipCard = (index: number) => {
    if (isAnimating || gameState !== 'drawn' || flippedCards[index]) return;
    
    // 设置动画状态，防止同时翻多张牌
    setIsAnimating(true);
    
    try {
      setFlippedCards(prev => ({
        ...prev,
        [index]: true
      }));
      
      // 动画完成后重置状态
      const flipTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 800);
      
      return () => clearTimeout(flipTimer);
    } catch (error) {
      console.error("翻牌失败:", error);
      setIsAnimating(false);
    }
  };

  // 重置游戏
  const resetGame = () => {
    setGameState('initial');
    setDrawnCards([]);
    setFlippedCards({});
    setDeck([...majorArcana]);
  };

  // 检查是否所有牌都已翻开
  const allCardsFlipped = drawnCards.length === 3 && 
    Object.keys(flippedCards).length === 3 && 
    Object.values(flippedCards).every(flipped => flipped === true);

  return (
    <Box minH="100vh" bg="black">
      <HeaderComponent />
      
      <Box py={10} px={4}>
        <Heading 
          as="h1" 
          size="2xl" 
          textAlign="center" 
          mb={8}
          textTransform="uppercase"
        >
          抽牌解读
        </Heading>
        
        <Text 
          textAlign="center" 
          maxW="600px" 
          mx="auto" 
          mb={5}
          opacity={0.8}
        >
          {gameState === 'initial' && "点击牌堆开始洗牌，然后抽取三张牌进行解读。"}
          {gameState === 'shuffling' && "正在洗牌..."}
          {gameState === 'shuffled' && "洗牌完成，点击牌堆抽取三张牌。"}
          {gameState === 'drawing' && "正在抽牌..."}
          {gameState === 'adjusting' && "正在调整牌的位置..."}
          {gameState === 'drawn' && !allCardsFlipped && "点击每张牌将其翻开，查看您的命运。"}
          {gameState === 'drawn' && allCardsFlipped && "所有牌已翻开，点击解读按钮查看结果。"}
        </Text>
        

        
        <Flex 
          justify="center" 
          align="center" 
          minH="400px"
          position="relative"
        >
          {/* 初始牌堆 */}
          {gameState === 'initial' && (
            <MotionBox
              onClick={shuffleDeck}
              cursor={isAnimating ? "wait" : "pointer"}
              whileHover={!isAnimating ? { scale: 1.05, y: -10 } : {}}
              whileTap={!isAnimating ? { scale: 0.95 } : {}}
            >
              <DeckStack count={22} isAnimating={isAnimating} />
            </MotionBox>
          )}
          
          {/* 洗牌动画 */}
          {gameState === 'shuffling' && (
            <AnimatePresence mode="wait">
              {Array.from({ length: 22 }).map((_, i) => (
                <MotionBox
                  key={`shuffle-${i}`}
                  position="absolute"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    rotate: 0,
                    opacity: 1,
                    zIndex: 10 + i
                  }}
                  animate={[
                    { 
                      x: Math.random() * 400 - 200, 
                      y: Math.random() * 200 - 100,
                      rotate: Math.random() * 180 - 90,
                      transition: { 
                        duration: 0.5,
                        delay: i * 0.02
                      }
                    },
                    { 
                      x: Math.random() * 400 - 200, 
                      y: Math.random() * 200 - 100,
                      rotate: Math.random() * 180 - 90,
                      transition: { 
                        duration: 0.5,
                        delay: 0.5 + i * 0.02
                      }
                    },
                    { 
                      x: 200, 
                      y: 0,
                      rotate: 0,
                      transition: { 
                        duration: 0.5,
                        delay: 1.0 + i * 0.02
                      }
                    }
                  ]}
                >
                  <Box
                    w="180px"
                    h="300px"
                    bg="black"
                    border="1px solid"
                    borderColor="rgba(255,255,255,0.3)"
                    borderRadius="md"
                    boxShadow="0 0 10px rgba(0,0,0,0.5)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    position="relative"
                  >
                    {/* 背景纹理 */}
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      opacity="0.05"
                      bgImage="repeating-linear-gradient(45deg, #333 0px, #333 2px, transparent 2px, transparent 4px)"
                    />
                    
                    {/* 中央符号 */}
                    <Box
                      as="svg"
                      viewBox="0 0 100 100"
                      width="70%"
                      height="70%"
                      fill="none"
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth="1"
                    >
                      <circle cx="50" cy="50" r="45" />
                      <circle cx="50" cy="50" r="30" />
                      <path d="M50 5 L50 95 M5 50 L95 50" />
                      <path d="M26 26 L74 74 M26 74 L74 26" />
                      <circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.7)" />
                    </Box>
                    
                    {/* 边框装饰 */}
                    <Box
                      position="absolute"
                      top="10px"
                      left="10px"
                      right="10px"
                      bottom="10px"
                      border="1px solid"
                      borderColor="rgba(255,255,255,0.2)"
                      pointerEvents="none"
                    />
                  </Box>
                </MotionBox>
              ))}
            </AnimatePresence>
          )}
          
          {/* 洗好的牌堆 */}
          {gameState === 'shuffled' && (
            <MotionBox
              position="absolute"
              right="10%"
              onClick={drawCards}
              cursor={isAnimating ? "wait" : "pointer"}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              whileHover={!isAnimating ? { scale: 1.05, y: -10 } : {}}
              whileTap={!isAnimating ? { scale: 0.95 } : {}}
            >
              <DeckStack count={22} isAnimating={false} />
            </MotionBox>
          )}
          
          {/* 抽牌动画 */}
          {(gameState === 'drawing' || gameState === 'adjusting') && (
            <Flex justify="center" align="center" w="100%">
              {Array.from({ length: 3 }).map((_, index) => (
                <MotionBox
                  key={`draw-${index}`}
                  initial={{ 
                    x: 300, 
                    y: 0,
                    opacity: 0
                  }}
                  animate={{ 
                    x: gameState === 'adjusting' 
                      ? (index - 1) * 120 // 向中间靠拢，但保持一定间距
                      : (index - 1) * 180, // 初始位置
                    y: 0,
                    opacity: 1,
                    transition: { 
                      duration: gameState === 'adjusting' ? 0.4 : 0.8,
                      delay: gameState === 'adjusting' ? 0 : index * 0.3,
                      ease: "easeOut"
                    }
                  }}
                  mx={0}
                >
                  <Box position="relative" w="180px" h="300px">
                    {/* 使用与牌堆相同的牌背 */}
                    <Box
                      w="180px"
                      h="300px"
                      bg="black"
                      border="1px solid"
                      borderColor="rgba(255,255,255,0.3)"
                      borderRadius="md"
                      boxShadow="0 0 10px rgba(0,0,0,0.5)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      overflow="hidden"
                      position="relative"
                    >
                      {/* 背景纹理 */}
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
                        opacity="0.05"
                        bgImage="repeating-linear-gradient(45deg, #333 0px, #333 2px, transparent 2px, transparent 4px)"
                      />
                      
                      {/* 中央符号 */}
                      <Box
                        as="svg"
                        viewBox="0 0 100 100"
                        width="70%"
                        height="70%"
                        fill="none"
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth="1"
                      >
                        <circle cx="50" cy="50" r="45" />
                        <circle cx="50" cy="50" r="30" />
                        <path d="M50 5 L50 95 M5 50 L95 50" />
                        <path d="M26 26 L74 74 M26 74 L74 26" />
                        <circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.7)" />
                      </Box>
                      
                      {/* 边框装饰 */}
                      <Box
                        position="absolute"
                        top="10px"
                        left="10px"
                        right="10px"
                        bottom="10px"
                        border="1px solid"
                        borderColor="rgba(255,255,255,0.2)"
                        pointerEvents="none"
                      />
                    </Box>
                  </Box>
                </MotionBox>
              ))}
            </Flex>
          )}
          
          {/* 抽出的三张牌 */}
          {gameState === 'drawn' && (
            <Flex 
              justify="center" 
              align="center" 
              w="100%" 
              gap={0}
              flexWrap={{ base: "wrap", md: "nowrap" }}
              position="relative"
            >
              {drawnCards.map((card, index) => (
                <MotionBox
                  key={card.id}
                  initial={{ opacity: 1, x: (index - 1) * 120 }}
                  animate={{ opacity: 1, x: (index - 1) * 120 }}
                  onClick={() => flipCard(index)}
                  cursor={flippedCards[index] ? "default" : "pointer"}
                  mx={0}
                >
                  <Box position="relative" w="180px" h="300px">
                    {/* 3D翻牌效果 */}
                    <MotionBox
                      position="relative"
                      width="100%"
                      height="100%"
                      sx={{ 
                        transformStyle: "preserve-3d",
                        perspective: "1000px"
                      }}
                      initial={{ rotateY: 0 }}
                      animate={{ 
                        rotateY: flippedCards[index] ? 180 : 0,
                        transition: { duration: 0.8 }
                      }}
                    >
                      {/* 牌正面（背面朝上） */}
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
                        sx={{ 
                          backfaceVisibility: "hidden"
                        }}
                      >
                        <Box
                          w="180px"
                          h="300px"
                          bg="black"
                          border="1px solid"
                          borderColor="rgba(255,255,255,0.3)"
                          borderRadius="md"
                          boxShadow="0 0 10px rgba(0,0,0,0.5)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          overflow="hidden"
                          position="relative"
                        >
                          {/* 背景纹理 */}
                          <Box
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            bottom="0"
                            opacity="0.05"
                            bgImage="repeating-linear-gradient(45deg, #333 0px, #333 2px, transparent 2px, transparent 4px)"
                          />
                          
                          {/* 中央符号 */}
                          <Box
                            as="svg"
                            viewBox="0 0 100 100"
                            width="70%"
                            height="70%"
                            fill="none"
                            stroke="rgba(255,255,255,0.7)"
                            strokeWidth="1"
                          >
                            <circle cx="50" cy="50" r="45" />
                            <circle cx="50" cy="50" r="30" />
                            <path d="M50 5 L50 95 M5 50 L95 50" />
                            <path d="M26 26 L74 74 M26 74 L74 26" />
                            <circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.7)" />
                          </Box>
                          
                          {/* 边框装饰 */}
                          <Box
                            position="absolute"
                            top="10px"
                            left="10px"
                            right="10px"
                            bottom="10px"
                            border="1px solid"
                            borderColor="rgba(255,255,255,0.2)"
                            pointerEvents="none"
                          />
                        </Box>
                      </Box>
                      
                      {/* 牌背面（正面朝上） */}
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
                        sx={{ 
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)"
                        }}
                      >
                        <TarotCard 
                          card={card} 
                          variant={index % 2 === 0 ? 'normal' : 'inverted'} 
                          deckStyle={deckStyle}
                        />
                      </Box>
                    </MotionBox>
                  </Box>
                </MotionBox>
              ))}
              
              {/* 解读按钮 - 所有牌翻开后显示 */}
              <AnimatePresence mode="wait">
                {allCardsFlipped && !isAnimating && (
                  <MotionBox
                    position="absolute"
                    bottom="-120px"
                    w="80px"
                    h="80px"
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    initial={{ opacity: 0, scale: 0.6, y: 20 }}
                    animate={{ 
                      opacity: 1,
                      scale: 1,
                      y: 0
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
                      delay: 0.5
                    }}
                    onClick={() => {
                      if (!isAnimating) {
                        // 点击时先闪烁一下，然后旋转一圈，最后打开解读
                        const timeline = async () => {
                          setIsAnimating(true);
                          try {
                            // 使用framer-motion的动画控制器来处理动画
                            // 先闪烁
                            await readingSymbolControls.start({
                              filter: 'brightness(2) drop-shadow(0 0 15px white)',
                              transition: { duration: 0.2 }
                            });
                            
                            // 然后旋转一圈
                            await readingSymbolControls.start({
                              rotate: 360,
                              filter: 'brightness(2) drop-shadow(0 0 15px white)',
                              transition: { duration: 0.8, ease: "easeInOut" }
                            });
                            
                            // 重置样式
                            await readingSymbolControls.start({
                              rotate: 0,
                              filter: 'none',
                              transition: { duration: 0.2 }
                            });
                            
                            // 最后打开解读
                            onOpen();
                          } catch (error) {
                            console.error('Animation error:', error);
                          } finally {
                            setIsAnimating(false);
                          }
                        };
                        timeline();
                      }
                    }}
                    whileHover={{ 
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
                    }}
                    whileTap={{ 
                      scale: 0.9,
                      opacity: 0.8,
                      filter: "brightness(1.5)",
                      transition: { duration: 0.1 }
                    }}
                  >
                    {/* 神秘符号 */}
                    <MotionBox
                      as="svg"
                      viewBox="0 0 100 100"
                      width="100%"
                      height="100%"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                      className="reading-symbol"
                      sx={{ transformOrigin: "center" }}
                      animate={readingSymbolControls}
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
                    </MotionBox>
                    
                    {/* 解读文字 */}
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
                      animate={{ opacity: 0.8, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      pointerEvents="none"
                    >
                      解读
                    </MotionBox>
                  </MotionBox>
                )}
              </AnimatePresence>
            </Flex>
          )}
        </Flex>
        
        {/* 重置按钮 */}
        {(gameState !== 'initial') && (
          <Flex justify="center" mt={allCardsFlipped ? 160 : 20}>
            <Button
              variant="outline"
              color="white"
              borderColor="white"
              onClick={resetGame}
              isDisabled={isAnimating}
              _hover={{ bg: 'white', color: 'black' }}
            >
              重新开始
            </Button>
          </Flex>
        )}
      </Box>
      
      {/* 解读结果弹窗 */}
      <ReadingResult 
        isOpen={isOpen} 
        onClose={onClose} 
        selectedCards={drawnCards}
      />
      
      <FooterComponent />
    </Box>
  );
};

// 牌背组件
const CardBack: React.FC = () => {
  return (
    <Box
      w="180px"
      h="300px"
      bg="black"
      border="1px solid"
      borderColor="rgba(255,255,255,0.3)"
      borderRadius="md"
      boxShadow="0 0 10px rgba(0,0,0,0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      position="relative"
    >
      {/* 背景纹理 */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.05"
        bgImage="repeating-linear-gradient(45deg, #333 0px, #333 2px, transparent 2px, transparent 4px)"
      />
      
      {/* 中央符号 */}
      <Box
        as="svg"
        viewBox="0 0 100 100"
        width="70%"
        height="70%"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1"
      >
        <circle cx="50" cy="50" r="45" />
        <circle cx="50" cy="50" r="30" />
        <path d="M50 5 L50 95 M5 50 L95 50" />
        <path d="M26 26 L74 74 M26 74 L74 26" />
        <circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.7)" />
      </Box>
      
      {/* 边框装饰 */}
      <Box
        position="absolute"
        top="10px"
        left="10px"
        right="10px"
        bottom="10px"
        border="1px solid"
        borderColor="rgba(255,255,255,0.2)"
        pointerEvents="none"
      />
    </Box>
  );
};

// 牌堆组件
const DeckStack: React.FC<{ count: number, isAnimating: boolean }> = ({ count, isAnimating }) => {
  return (
    <Box position="relative" w="180px" h="300px">
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={`deck-${i}`}
          position="absolute"
          top={`${i * 0.5}px`}
          left={`${i * 0.5}px`}
          w="180px"
          h="300px"
          bg="black"
          border="1px solid"
          borderColor="rgba(255,255,255,0.3)"
          borderRadius="md"
          boxShadow="dark-lg"
          transform={`rotate(${i * 0.2}deg)`}
          transition="transform 0.3s"
          animation={isAnimating ? `shuffle-${i} ${0.1 + i * 0.01}s ease infinite alternate` : "none"}
          sx={{
            [`@keyframes shuffle-${i}`]: {
              "0%": { transform: `rotate(${i * 0.2}deg)` },
              "100%": { transform: `rotate(${i * 0.2 + 0.8}deg)` }
            }
          }}
        />
      ))}
      
      {/* 顶部牌面 */}
      <Box
        position="absolute"
        top="0"
        left="0"
        zIndex={count}
        sx={{ transformStyle: "preserve-3d" }}
      >
        <CardBack />
      </Box>
    </Box>
  );
};

export default DeckDrawing;