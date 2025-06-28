import { useDiaryStore } from '@/stores/diaryStore';
import { Box, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { Cloud, SunDim, Umbrella } from 'lucide-react';

// 天気アイコンの型定義
interface WeatherIcon {
  id: string;
  icon: React.ComponentType;
}

// アイコンの種類定義
export const weatherIcons: WeatherIcon[] = [
  { id: 'sunny', icon: SunDim },
  { id: 'cloudy', icon: Cloud },
  { id: 'rainy', icon: Umbrella },
];

/**
 * 天気表示コンポーネント
 * @returns 天気と気温を表示するUIコンポーネント
 * @description
 * - 天気アイコンと気温を表示
 * - ホーム画面のヘッダー下部に表示
 */
const WeatherDisplay = () => {
  const diary = useDiaryStore(state => state.diary);

  // 天気アイコンを取得
  const getWeatherIcon = (weatherId: string) => {
    const icon = weatherIcons.find(w => w.id === weatherId);
    return icon ? icon.icon : SunDim;
  };

  // 天気アイコンを表示
  const WeatherIcon = diary?.weather ? getWeatherIcon(diary.weather) : SunDim;

  // 天気に応じた色を取得
  const getWeatherColor = (weatherId: string) => {
    switch (weatherId) {
      case 'sunny':
        return 'sun';
      case 'cloudy':
        return 'gray.200';
      case 'rainy':
        return 'secondary.800';
      default:
        return 'sun';
    }
  };

  const weatherColor = diary?.weather ? getWeatherColor(diary.weather) : 'yellow.400';

  return (
    <Box bg="transparent" borderRadius="lg" p={6} width="100%" maxW="500px" mx="auto" mt={0} mb={4}>
      <VStack gap={1}>
        <Flex align="center" justify="center">
          <Icon
            as={WeatherIcon}
            color={weatherColor}
            fill={weatherColor}
            boxSize="50%"
            filter="drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3))"
          />
          <Text
            color="white"
            fontSize="4xl"
            ml={2}
            fontWeight="bold"
            textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
          >
            {diary?.temperature !== undefined && diary?.temperature !== null
              ? `${Number(diary.temperature).toFixed(1)}°C`
              : '--°C'}
          </Text>
        </Flex>
        <Text
          color="white"
          fontSize="2xl"
          fontWeight="bold"
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
          mt={-2}
          mb={5}
        >
          {new Date()
            .toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            .replace(/(\d+年)(\d+月)(\d+日)/, '$1 $2 $3')}
        </Text>
      </VStack>
    </Box>
  );
};

export default WeatherDisplay;
