import ForestBackground from '@/components/ForestBackground';
import { useUserStore } from '@/stores/userStore';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecommendedProductCard } from './RecommendCard';

const Recommend = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.user_role === 'child') {
      navigate('/app');
    }
  }, [user?.user_role]);

  const productsMock = [
    {
      title: 'ドッグフード',
      price: '¥4,810',
      rating: 4.5,
      reviewCount: 100,
      imageUrl: '/recommenditem/dogfood.jpeg',
      productUrl: 'https://www.google.com',
      badgeMessage: 'そろそろなくなりそう？',
    },
    {
      title: '犬用リード',
      price: '¥2,300',
      rating: 4,
      reviewCount: 76,
      imageUrl: '/recommenditem/neckband.jpeg',
      productUrl: 'https://www.google.com',
      badgeMessage: '夏が近いですね',
    },
    {
      title: 'ロープトイ',
      price: '¥1,200',
      rating: 5,
      reviewCount: 201,
      imageUrl: '/recommenditem/playitem.jpeg',
      productUrl: 'https://www.google.com',
      badgeMessage: '遊び盛り',
    },
    {
      title: 'ドーム型ペットベッド',
      price: '¥4,980',
      rating: 5,
      reviewCount: 1021,
      imageUrl: '/recommenditem/house.jpeg',
      productUrl: 'https://www.google.com',
      badgeMessage: '冬の準備をしますか？',
    },
    {
      title: 'ペット用トイレ',
      price: '¥3,980',
      rating: 4,
      reviewCount: 105,
      imageUrl: '/recommenditem/toilet.jpeg',
      productUrl: 'https://www.google.com',
      badgeMessage: '匂いが気になる季節かも',
    },
    {
      title: 'ペット用ブラシ',
      price: '¥2,480',
      rating: 4,
      reviewCount: 241,
      imageUrl: '/recommenditem/brush.jpg',
      productUrl: 'https://www.google.com',
      badgeMessage: '毛並みを整えませんか？',
    },
  ];

  return (
    <Box
      minH="100vh"
      pt={{ base: 12, md: 14 }}
      pb={{ base: '60px', md: '80px' }}
      w="100%"
      pos="relative"
      overflow="hidden"
    >
      {/* 森上部 */}
      <ForestBackground type="calenderTop" top="2%" height="200px" zIndex={2} />
      <Box mt={70} height="70px" position="relative" zIndex={3} width="100%">
        <Heading
          fontSize="2xl"
          fontWeight="bold"
          color="white"
          zIndex={3}
          position="absolute"
          textAlign="center"
          top="-40%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="100%"
          textShadow="0 0 10px rgba(0, 0, 0, 0.5)"
        >
          あなたの活動に基づく
          <br />
          おすすめ商品
        </Heading>
      </Box>

      <Box
        maxW="container.xl"
        mt={50}
        mb={170}
        mx="auto"
        width="95%"
        display="flex"
        justifyContent="center"
      >
        {/* <Center> */}
        <SimpleGrid columns={{ base: 2, sm: 2 }} gap={3} maxW="600px" width="100%">
          {productsMock.map((item, index) => (
            <RecommendedProductCard key={index} {...item} />
          ))}
        </SimpleGrid>
        {/* </Center> */}
      </Box>
      {/* 森下部 */}
      <ForestBackground type="bottom" bottom="0" height="250px" zIndex={1} />
    </Box>
  );
};

export default Recommend;
