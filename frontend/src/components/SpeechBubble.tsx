import { Box } from '@chakra-ui/react';
import React from 'react';

interface SpeechBubbleProps {
  children: React.ReactNode;
  smallText?: string;
}

const SpeechBubble = ({ children, smallText }: SpeechBubbleProps) => {
  return (
    <Box
      position="relative"
      bg="white"
      borderRadius="full"
      px={6}
      py={4}
      boxShadow="md"
      width="95%"
      maxW="500px"
      mt={-5}
      mb={10}
      mx="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {/* 子には p ではなく Box や Text を使っても安全 */}
      <Box
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        whiteSpace="pre-wrap"
        position="relative"
        zIndex={1}
      >
        {children}
      </Box>

      {smallText && (
        <Box
          fontSize="sm"
          color="gray.600"
          textAlign="center"
          mt={2}
          position="relative"
          zIndex={1}
        >
          {smallText}
        </Box>
      )}

      {/* 吹き出しの下のとんがり */}
      <Box
        position="absolute"
        bottom="-20px"
        left="70%"
        transform="translateX(-50%)"
        width="0"
        height="0"
        borderLeft="1px solid transparent"
        borderRight="20px solid transparent"
        borderTop="20px solid white"
        zIndex={0}
      />
    </Box>
  );
};

export default SpeechBubble;
