import { Box, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface BoardProps {
  children: ReactNode;
}

const Board = ({ children }: BoardProps) => {
  return (
    <VStack
      width="100%"
      py={6}
      px={4}
      gap={0}
      align="center"
      justifyContent="flex-start"
      minH="auto"
    >
      {/* 看板のボード部分 */}
      <Box
        bg="tree.400"
        borderRadius="md"
        pos="relative"
        p={4}
        width="100%"
        boxShadow="lg"
        py={6}
        minH={300}
      >
        {/* 釘 */}
        <Box
          pos="absolute"
          top="4"
          left="4"
          bg="white"
          borderRadius="full"
          boxSize="12px"
          boxShadow="inset 0 0 2px rgba(0,0,0,0.3)"
        />
        <Box
          pos="absolute"
          top="4"
          right="4"
          bg="white"
          borderRadius="full"
          boxSize="12px"
          boxShadow="inset 0 0 2px rgba(0,0,0,0.3)"
        />
        <Box
          pos="absolute"
          bottom="4"
          left="4"
          bg="white"
          borderRadius="full"
          boxSize="12px"
          boxShadow="inset 0 0 2px rgba(0,0,0,0.3)"
        />
        <Box
          pos="absolute"
          bottom="4"
          right="4"
          bg="white"
          borderRadius="full"
          boxSize="12px"
          boxShadow="inset 0 0 2px rgba(0,0,0,0.3)"
        />

        {children}
      </Box>

      {/* 看板の支柱部分 */}
      <Box bg="tree.400" width="60px" height="200px" mt="-4px" borderRadius="sm" mb="-20" />
    </VStack>
  );
};

export default Board;
