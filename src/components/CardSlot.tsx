import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface CardSlotProps {
  label: string;
  isActive: boolean;
}

const CardSlot: React.FC<CardSlotProps> = ({ label, isActive }) => {
  return (
    <Box
      w="180px"
      h="300px"
      border="1px dashed"
      borderColor={isActive ? "white" : "rgba(255,255,255,0.3)"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      transition="all 0.3s"
      opacity={isActive ? 1 : 0.7}
    >
      <Text
        color={isActive ? "white" : "rgba(255,255,255,0.5)"}
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing="1px"
      >
        {label}
      </Text>
    </Box>
  );
};

export default CardSlot;