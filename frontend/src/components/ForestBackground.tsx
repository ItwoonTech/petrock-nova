import { Box } from '@chakra-ui/react';

interface ForestBackgroundProps {
  type: 'top' | 'bottom' | 'calenderTop';
  height?: string | number;
  top?: string | number;
  bottom?: string | number;
  zIndex?: number;
  heightSize?: string;
}

const ForestBackground = ({
  type,
  height,
  top,
  bottom,
  zIndex,
}: ForestBackgroundProps) => {
  const backgroundImage = type === 'top' ? '/forest_upper_fixed.svg' : type === 'bottom' ? '/forest_bottom.svg' : '/forest_upper.svg';

  return (
    <Box
      backgroundImage={`url('${backgroundImage}')`}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition={type === 'top' ? 'top center' : 'bottom center'}
      h={height}
      pos="absolute"
      left="0"
      right="0"
      zIndex={zIndex}
      pointerEvents="none"
      top={top}
      bottom={bottom}
    />
  );
};

export default ForestBackground;
