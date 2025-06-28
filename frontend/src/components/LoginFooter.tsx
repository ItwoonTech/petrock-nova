import { Box } from '@chakra-ui/react';

const FooterForest = () => {
  return (
    <Box position="fixed" bottom={-20} left={0} right={0} zIndex={1} pointerEvents="none">
      <Box
        w="100vw"
        maxW="none"
        p={0}
        backgroundImage="url('/forest_bottom.svg')"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="center"
        minH="250px"
        pointerEvents="none"
      />
    </Box>
  );
};

export default FooterForest;
