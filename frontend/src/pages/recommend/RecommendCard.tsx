import {
  Box,
  Image,
  Heading,
  Text,
  Stack,
  Button,
  HStack,
  Icon,
  Badge,
  Center,
} from '@chakra-ui/react';
import { Star, ShoppingCart, CheckCircle } from 'lucide-react';

const NailCircle = ({ top, left }: { top: string; left: string }) => (
  <Box
    position="absolute"
    top={top}
    left={left}
    w="10px"
    h="10px"
    bg="rgb(245, 241, 238)"
    borderRadius="full"
    boxShadow="0 0 3px rgba(0,0,0,0.3)"
    border="2px solid gray.300" // 木の色に合わせた枠線
    zIndex={10}
  />
);

type RecommendedProductCardProps = {
  title: string;
  price: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  productUrl: string;
  badgeMessage: string;
};

export const RecommendedProductCard = ({
  title,
  price,
  rating,
  reviewCount,
  imageUrl,
  productUrl,
  badgeMessage,
}: RecommendedProductCardProps) => {
  return (
    <Box
      maxW="sm"
      borderRadius="2xl"
      boxShadow="md"
      bg="tree.400"
      overflow="hidden"
      w="100%"
      h="35vh"
      mb="20px"
      position="relative"
    >
      <NailCircle top="3%" left="3%" />
      <NailCircle top="3%" left="89%" />
      <NailCircle top="93%" left="3%" />
      <NailCircle top="93%" left="89%" />
      <Box p={0}>
        <Image
          src={imageUrl}
          alt={title}
          borderTopRadius="2xl"
          objectFit="cover"
          w="100%"
          maxH="100px"
        />
      </Box>

      <Box p="6%" position="absolute" top="42%" left="2%">
        <Stack gap={0.8}>
          <Badge
            colorScheme="teal"
            w="fit-content"
            px={2}
            py={0.5}
            borderRadius="full"
            display="inline-flex"
            alignItems="center"
          >
            <Icon as={CheckCircle} boxSize={3} mr={1} />
            {badgeMessage}
          </Badge>

          <Heading size="sm" lineClamp={1}>
            {title}
          </Heading>

          <HStack gap={1}>
            {Array.from({ length: 5 }, (_, i) => (
              <Icon
                as={Star}
                key={i}
                color={i < rating ? 'yellow.400' : 'gray.300'}
                boxSize={3}
                fill="currentColor"
              />
            ))}
            <Text fontSize="xs" color="gray.500">
              ({reviewCount}件)
            </Text>
          </HStack>

          <Text fontSize="md" fontWeight="bold" color="green.600">
            {price}
          </Text>
        </Stack>
      </Box>

      <Box p="5%" mt={-3} position="absolute" bottom="0" left="0" right="0">
        <Center>
          <Button
            bg="accent.500"
            color="text"
            w="80%"
            size="sm"
            h="28px"
            fontSize="13px"
            onClick={() => window.open(productUrl, '_blank')}
          >
            <ShoppingCart size={14} color="black" />
            Amazonで買う
          </Button>
        </Center>
      </Box>
    </Box>
  );
};
