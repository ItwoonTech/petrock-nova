import noImage from '@/assets/images/no-image.png';
import Board from '@/components/Board';
import LineBreakText from '@/components/LineBreakText';
import { mapDiaryToTodoList } from '@/lib/mappers/diaryToTodo.ts';
import TodoItem from '@/pages/home/component/toDoList/TodoItem.tsx';
import { useDiaryStore } from '@/stores/diaryStore';
import { usePetStore } from '@/stores/petStore';
import { Box, Flex, Icon, IconButton, Image, Text, VStack } from '@chakra-ui/react';
import { Cloud, Heart, SunDim, Umbrella } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface DailySummaryCardProps {
  selectedDate: string;
}

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

const DailySummaryCard = ({ selectedDate }: DailySummaryCardProps) => {
  const pet = usePetStore(state => state.pet);
  const getPetImageUrl = usePetStore(state => state.getPetImageUrl);
  const [petImageUrl, setPetImageUrl] = useState<string | null>(null);
  // const { user } = useAuthStore();
  const setDiaryReaction = useDiaryStore(state => state.setDiaryReaction);
  // const isParent = user?.role === 'parent';
  const selectedDiary = useDiaryStore(state =>
    state.entries.find(entry => entry.date === selectedDate)
  );
  const hasReacted = selectedDiary?.reacted ?? false;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      if (pet?.image_name) {
        const url = await getPetImageUrl();
        setPetImageUrl(url);
      } else {
        setPetImageUrl(null);
      }
    };
    fetchImage();
  }, [pet?.image_name, getPetImageUrl]);

  // 天気アイコンを取得
  const getWeatherIcon = (weatherId: string) => {
    const icon = weatherIcons.find(w => w.id === weatherId);
    return icon ? icon.icon : SunDim;
  };

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

  const WeatherIcon = selectedDiary?.weather ? getWeatherIcon(selectedDiary.weather) : SunDim;
  const weatherColor = selectedDiary?.weather ? getWeatherColor(selectedDiary.weather) : 'sun';

  const handleReactClick = () => {
    if (selectedDiary) {
      setDiaryReaction(selectedDiary.pet_id, selectedDiary.date, !hasReacted);
      setIsAnimating(true);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Chakra UIのIconButtonをmotion化
  const MotionIconButton = motion(IconButton);

  return (
    <Board>
      {selectedDiary && (
        <VStack align="center" justifyContent="flex-start" gap={2} width="100%">
          {/* 日付 */}
          <VStack align="center" mb={2}>
            <Text fontSize="2xl" fontWeight="bold" color="text">
              {new Date(selectedDate)
                .toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
                .replace(/(\d+年)(\d+月)(\d+日)/, '$1 $2 $3')}
            </Text>
            {selectedDiary.weather && selectedDiary.temperature && (
              <Flex align="center" justify="center" gap={2}>
                <Icon
                  as={WeatherIcon}
                  color={weatherColor}
                  fill={weatherColor}
                  boxSize="40px"
                  filter="drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3))"
                />
                <Text fontSize="xl" color="text">
                  {selectedDiary.temperature}°C
                </Text>
              </Flex>
            )}
          </VStack>

          {/* やったことリスト */}
          <VStack align="stretch" gap={2} flexGrow={1} width="100%">
            {mapDiaryToTodoList(selectedDiary).map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onItemClick={() => {
                  /* 何もしない */
                }}
                readOnly={true}
              />
            ))}
            {(selectedDiary.task === undefined || selectedDiary.task.length === 0) && (
              <Text fontSize="md" color="gray.600">
                この日はまだタスクがありません。
              </Text>
            )}
          </VStack>

          {/* コメントセクション全体を相対位置指定のBoxで囲む */}
          <Box pos="relative" width="100%" minH="250px" mt={4}>
            {/* 吹き出し */}
            <Box
              bg="white"
              color="text"
              p={10}
              borderRadius="4xl"
              pos="absolute"
              top="0"
              left="0"
              right="0"
              px={6}
              maxW="100%"
              fontSize="md"
              fontWeight="medium"
              boxShadow="md"
              zIndex={0}
            >
              <LineBreakText
                text={selectedDiary.advice ?? '何をしたかな？'}
                textAlign="center"
                fontSize="md"
              ></LineBreakText>
            </Box>

            {/* アイコン画像 */}
            <Image
              src={petImageUrl || noImage}
              alt="Pet image"
              boxSize="120px"
              borderRadius="full"
              objectFit="cover"
              borderColor="accent.500"
              borderWidth="4px"
              borderStyle="solid"
              boxShadow="lg"
              zIndex={1}
              pos="absolute"
              bottom="0"
              left="0"
            />

            {/* ハートボタン */}
            <MotionIconButton
              as={Heart}
              aria-label="React to diary"
              pos="absolute"
              bottom="5%"
              right="5%"
              bg="white"
              _hover={{ bg: 'white' }}
              onClick={handleReactClick}
              size="2xl"
              borderColor="tree.500"
              borderStyle="solid"
              borderWidth="2px"
              color={hasReacted ? 'red.400' : 'gray.400'}
              fill={hasReacted ? 'red.400' : 'transparent'}
              initial={{ scale: 1 }}
              animate={isAnimating ? { scale: [1, 2, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
            ></MotionIconButton>
          </Box>
        </VStack>
      )}
    </Board>
  );
};

export default DailySummaryCard;
