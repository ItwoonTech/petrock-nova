import { Box } from '@chakra-ui/react';

const LoginHeader = () => {
  return (
    <Box position="fixed" top={-10} left={0} right={0} zIndex={1} pointerEvents="none">
      <Box
        w="100vw"
        maxW="none"
        p={0}
        backgroundImage="url('/forest_upper.svg')"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="center"
        minH="200px"
        pointerEvents="none"
      />
    </Box>
  );
};

export default LoginHeader;
