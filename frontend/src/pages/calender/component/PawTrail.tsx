import { Grid, Icon } from '@chakra-ui/react';
import { PawPrint } from 'lucide-react';

const PawTrail = () => {
    const pawCount = 15;

  return (
    <Grid
      templateColumns="repeat(auto-fit, minmax(24px, 1fr))"
      w="100%"
      h="40px"
      px={4}
      py={2}
      alignItems="center"
    >
      {Array.from({ length: pawCount }).map((_, i) => (
        <Icon
          as={PawPrint}
          key={i}
          color="white"
          fill="white"
          boxSize={Math.random() * 20 + 10}
          transform={`rotate(${i % 2 === 0 ? -20 : 20}deg) translateY(${i % 2 === 0 ? '-6px' : '6px'})`}
          justifySelf="center"
        />
      ))}
    </Grid>
  );
};

export default PawTrail;
