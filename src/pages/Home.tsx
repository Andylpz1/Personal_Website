import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  GridItem, 
  Heading, 
  Text, 
  Button, 
  Flex,
  useBreakpointValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TarotCard from '../components/TarotCard';
import { majorArcana } from '../data/tarotCards';

// 创建一个动画盒子组件
const MotionBox = motion(Box);

function Home() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // 选择一些牌来展示
  const featuredCards = majorArcana.slice(0, 3);
  const secondaryCards = majorArcana.slice(3, 9);
  
  // 不再需要fallingCards状态

  return (
    <Box minH="100vh" bg="black">
      <Header />
      
      {/* 英雄区域 - 分屏效果 */}
      <Grid 
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        h={{ base: 'auto', md: '100vh' }}
      >
        <GridItem 
          bg="black" 
          color="white"
          p={{ base: 8, md: 20 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          position="relative"
          overflow="hidden"
        >
          <Box 
            position="absolute" 
            top="0" 
            left="0" 
            width="1px" 
            height="100%" 
            bg="white" 
            opacity="0.2"
          />
          <Box 
            position="absolute" 
            bottom="0" 
            left="0" 
            width="30%" 
            height="1px" 
            bg="white" 
            opacity="0.2"
          />
          <Heading 
            as="h1" 
            size="4xl" 
            mb={8}
            lineHeight="0.9"
            textTransform="uppercase"
            letterSpacing="wider"
            fontWeight="900"
          >
            神秘<br />塔罗
          </Heading>
          <Text 
            fontSize="lg" 
            maxW="400px" 
            mb={10} 
            opacity={0.7}
            letterSpacing="0.5px"
            lineHeight="1.8"
          >
            探索塔罗牌的神秘力量，揭示过去、现在和未来的奥秘。
          </Text>
          <Flex direction={{ base: 'column', sm: 'row' }} gap={4} flexWrap="wrap">
            <Button 
              as={RouterLink}
              to="/reading"
              size="lg" 
              width={{ base: "100%", sm: "180px" }}
              variant="outline"
              borderWidth="1px"
              borderRadius="0"
              letterSpacing="1px"
              fontWeight="400"
              height="56px"
              _hover={{ bg: 'white', color: 'black' }}
            >
              单张解读
            </Button>
            <Button 
              as={RouterLink}
              to="/tarot-reading"
              size="lg" 
              width={{ base: "100%", sm: "180px" }}
              variant="solid"
              bg="white"
              color="black"
              borderRadius="0"
              letterSpacing="1px"
              fontWeight="400"
              height="56px"
              _hover={{ bg: 'gray.100' }}
            >
              三张牌阵
            </Button>
            <Button 
              as={RouterLink}
              to="/deck-drawing"
              size="lg" 
              width={{ base: "100%", sm: "180px" }}
              variant="outline"
              borderWidth="1px"
              borderRadius="0"
              letterSpacing="1px"
              fontWeight="400"
              height="56px"
              borderColor="rgba(255,255,255,0.7)"
              _hover={{ bg: 'white', color: 'black' }}
            >
              抽牌解读
            </Button>
          </Flex>
        </GridItem>
        
        <GridItem 
          bg="white" 
          color="black"
          position="relative"
          overflow="hidden"
          borderLeft="1px solid rgba(0,0,0,0.1)"
        >
          <Box 
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Heading 
              size="4xl" 
              fontWeight="900"
              position="absolute"
              opacity="0.03"
              fontSize={{ base: "150px", lg: "300px" }}
              textTransform="uppercase"
              letterSpacing="-15px"
              fontFamily="serif"
            >
              TAROT
            </Heading>
            
            {/* 大牌展示 */}
            <Box 
              transform={{ base: 'scale(0.7)', md: 'scale(0.8)', lg: 'scale(1)' }}
              position="relative"
              zIndex="1"
            >
              <Flex justify="center" align="center" h="100%">
                {featuredCards.map((card, index) => (
                  <Box
                    key={card.id}
                    transform={`rotate(${(index-1) * 15}deg)`}
                    mx="-20px"
                    transition="transform 0.3s"
                    _hover={{ transform: `rotate(${(index-1) * 15}deg) translateY(-30px)` }}
                  >
                    <TarotCard card={card} variant={index === 1 ? 'inverted' : 'normal'} />
                  </Box>
                ))}
              </Flex>
            </Box>
          </Box>
        </GridItem>
      </Grid>
      
      {/* 分割线 */}
      <Box h="1px" bg="white" opacity={0.2} mx="auto" />
      
      {/* 牌阵展示区 */}
      <Box py={16} px={8} bg="black" position="relative" overflow="hidden">
        
        <Heading 
          as="h2" 
          size="2xl" 
          mb={12} 
          textAlign="center"
          textTransform="uppercase"
          position="relative"
          zIndex={2}
        >
          塔罗牌阵
        </Heading>
        
        <Box 
          height="600px" 
          maxW="1200px"
          mx="auto"
          position="relative"
          zIndex={2}
          border="1px solid rgba(255,255,255,0.1)"
          borderRadius="md"
          p={4}
          bg="rgba(0,0,0,0.3)"
        >
          {/* 掉落的卡牌动画 - 替代静态网格 */}
          <AnimatePresence>
            {majorArcana.slice(0, 30).map((card, index) => (
              <MotionBox
                key={card.id}
                position="absolute"
                left={`${Math.random() * 80 + 10}%`}
                initial={{ 
                  y: -200 - (index % 3) * 100, 
                  x: Math.random() * 30 - 15,
                  rotate: Math.random() * 20 - 10,
                  opacity: 0.9
                }}
                animate={{ 
                  y: ['-100px', '100px', '300px', '500px', '700px'],
                  x: [0, Math.random() * 30 - 15, Math.random() * 40 - 20, Math.random() * 30 - 15, 0],
                  rotateY: [0, 90, 180, 270, 360],
                  rotateZ: [0, Math.random() * 10 - 5, Math.random() * 15 - 7.5, Math.random() * 10 - 5, 0],
                  opacity: [0.9, 1, 0.95, 0.9, 0.8]
                }}
                transition={{ 
                  duration: 5 + Math.random() * 2,
                  delay: Math.random() * 3,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2,
                  ease: "easeIn",
                  times: [0, 0.2, 0.4, 0.7, 1]
                }}
                zIndex={100 - index}
              >
                <Box 
                  transform={`scale(${0.6 + Math.random() * 0.4})`}
                  style={{ transformStyle: 'preserve-3d' }}>
                  <TarotCard 
                    card={card} 
                    variant={Math.random() > 0.5 ? 'normal' : 'inverted'} 
                    size="md"
                  />
                </Box>
              </MotionBox>
            ))}
          </AnimatePresence>
        </Box>
        
        <Flex justify="center" mt={12} gap={6} flexWrap="wrap">
          <Button 
            as={RouterLink}
            to="/reading"
            variant="outline" 
            size="lg"
            borderRadius="0"
            _hover={{ bg: 'white', color: 'black' }}
          >
            单张解读
          </Button>
          <Button 
            as={RouterLink}
            to="/tarot-reading"
            variant="solid"
            bg="white"
            color="black" 
            size="lg"
            borderRadius="0"
            _hover={{ bg: 'gray.200' }}
          >
            三张牌阵
          </Button>
          <Button 
            as={RouterLink}
            to="/deck-drawing"
            variant="outline" 
            size="lg"
            borderRadius="0"
            _hover={{ bg: 'white', color: 'black' }}
          >
            抽牌解读
          </Button>
        </Flex>
      </Box>
      
      <Footer />
    </Box>
  );
}

export default Home;