import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import TarotCard from './TarotCard';
import { TarotCard as TarotCardType } from '../data/tarotCards';

interface ReadingResultProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCards: TarotCardType[];
}

const ReadingResult: React.FC<ReadingResultProps> = ({ 
  isOpen, 
  onClose, 
  selectedCards 
}) => {
  const positions = ['过去', '现在', '未来'];
  
  if (selectedCards.length !== 3) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg="black" color="white" borderRadius="0" p={6} maxW="900px">
        <ModalHeader 
          textTransform="uppercase" 
          textAlign="center" 
          letterSpacing="2px"
          fontWeight="300"
          fontSize="2xl"
          borderBottom="1px solid rgba(255,255,255,0.1)"
          pb={4}
          mb={2}
        >
          塔罗牌解读
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={8}>
            {selectedCards.map((card, index) => (
              <GridItem key={card.id}>
                <Flex direction="column" align="center">
                  <Text mb={2} fontWeight="bold" textTransform="uppercase">
                    {positions[index]}
                  </Text>
                  <Box>
                    <TarotCard 
                      card={card} 
                      variant={index % 2 === 0 ? 'normal' : 'inverted'} 
                      size="sm" 
                    />
                  </Box>
                </Flex>
              </GridItem>
            ))}
          </Grid>
          
          <Box mb={6}>
            <Heading 
              size="md" 
              mb={4} 
              textTransform="uppercase" 
              letterSpacing="1px"
              fontWeight="400"
              display="inline-block"
              pb={2}
              borderBottom="1px solid rgba(255,255,255,0.3)"
            >
              解读
            </Heading>
            <Box p={6} border="1px solid" borderColor="rgba(255,255,255,0.1)" bg="rgba(0,0,0,0.3)">
              <Text mb={4}>
                <Text as="span" fontWeight="bold">过去 ({selectedCards[0].name})：</Text> {selectedCards[0].description}
              </Text>
              <Text mb={4}>
                <Text as="span" fontWeight="bold">现在 ({selectedCards[1].name})：</Text> {selectedCards[1].description}
              </Text>
              <Text mb={4}>
                <Text as="span" fontWeight="bold">未来 ({selectedCards[2].name})：</Text> {selectedCards[2].description}
              </Text>
              <Text>
                <Text as="span" fontWeight="bold">综合解读：</Text> 这三张牌共同讲述了一个从{selectedCards[0].name}（过去）
                到{selectedCards[1].name}（现在）再到{selectedCards[2].name}（未来）的故事。
                思考这些牌之间的联系，可以帮助你更好地理解当前的处境和未来的可能性。
              </Text>
            </Box>
          </Box>
          
          <Flex justify="center" mt={6}>
            <Button 
              variant="outline" 
              onClick={onClose}
              borderRadius="0"
              borderColor="rgba(255,255,255,0.3)"
              letterSpacing="1px"
              fontWeight="400"
              py={5}
              px={8}
              _hover={{ bg: 'white', color: 'black' }}
            >
              返回选牌
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReadingResult;