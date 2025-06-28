import ForestBackground from '@/components/ForestBackground';
import { formatDateToYYYYMMDD } from '@/lib/dateUtils';
import PetInfo from '@/pages/home/component/PetInfo';
import PetMessage from '@/pages/home/component/PetMessage';
import TodoList from '@/pages/home/component/toDoList/TodoList';
import WeatherDisplay from '@/pages/home/component/WeatherDisplay';
import { useDiaryStore } from '@/stores/diaryStore';
import { usePetStore } from '@/stores/petStore';
import { useUserStore } from '@/stores/userStore';
import { Box, Center, Spinner, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';

/**
 * アプリケーションのホームページコンポーネント
 * @returns メインコンテンツを表示するページコンポーネント
 * @description
 */
export default function Home() {
  const pet = usePetStore(state => state.pet);
  const diary = useDiaryStore(state => state.diary);
  const user = useUserStore(state => state.user);
  const fetchDiaryByDate = useDiaryStore(state => state.fetchDiaryByDate);
  const isLoading = useDiaryStore(state => state.isLoading);

  // 本日の日付の日記を取得
  useEffect(() => {
    if (pet?.pet_id) {
      const today = formatDateToYYYYMMDD(new Date());
      fetchDiaryByDate(pet.pet_id, today);
    }
  }, [pet?.pet_id, fetchDiaryByDate]);

  // 本日の日付かどうかをチェック
  const isTodayDiary = diary && diary.date === formatDateToYYYYMMDD(new Date());

  console.log('🐶 Pet:', pet);
  console.log('📘 Diary:', diary);
  console.log('👤 User:', user);
  console.log('📅 Is today diary:', isTodayDiary);

  return (
    <Box position="relative" left={0} right={0} minH="100vh" overflow="hidden">
      {isLoading && (
        <Center
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          zIndex={9999}
          bg="rgba(255,255,255,0.5)"
        >
          <Spinner size="xl" color="teal.500" />
        </Center>
      )}
      <ForestBackground type="top" top="-1" height="300px" zIndex={0} />
      <ForestBackground type="bottom" bottom="-10" height="250px" zIndex={2} />

      <VStack gap={4} align="center" maxW="500px" mx="auto" pos="relative" zIndex={1} pt={10}>
        <WeatherDisplay />
        <PetMessage />
        <TodoList />
        <Box display="flex" justifyContent="center" w="100%">
          <PetInfo />
        </Box>
      </VStack>
    </Box>
  );
}
