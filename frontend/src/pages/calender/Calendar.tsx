import { s3Api } from '@/api/s3Api';
import noImage from '@/assets/images/no-image.png';
import Board from '@/components/Board';
import ForestBackground from '@/components/ForestBackground';
import LineBreakText from '@/components/LineBreakText';
import { formatDateToYYYYMMDD, getDateString } from '@/lib/dateUtils';
import PawTrail from '@/pages/calender/component/PawTrail';
import { useDiaryStore } from '@/stores/diaryStore';
import { usePetStore } from '@/stores/petStore';
import type { Diary } from '@/types/diary.ts';
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import DailySummaryCard from './component/DailySummaryCard';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateToYYYYMMDD(new Date()));
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [imageUrl, setImageUrl] = useState<string>(noImage);

  const diaryEntries = useDiaryStore(state => state.entries);
  const isLoading = useDiaryStore(state => state.isLoading);
  const fetchDiaryEntriesForMonth = useDiaryStore(state => state.fetchDiariesByMonth);
  const petId = usePetStore(state => state.pet?.pet_id);

  // 月が変わったら日記データを取得
  useEffect(() => {
    if (petId) {
      fetchDiaryEntriesForMonth(currentDate.getFullYear(), currentDate.getMonth(), petId);
    }
  }, [currentDate, petId, fetchDiaryEntriesForMonth]);

  // 選択された日付に対応する日記を更新
  useEffect(() => {
    const diary = diaryEntries.find(entry => formatDateToYYYYMMDD(entry.date) === selectedDate);

    setSelectedDiary(diary || null);
  }, [diaryEntries, selectedDate]);

  // 選択された日記の画像URLを取得
  useEffect(() => {
    const fetchImageUrl = async () => {
      if (!selectedDiary?.picture_name || !petId) {
        setImageUrl(noImage);
        return;
      }

      try {
        // 署名付きURLを直接取得してセット
        const presignedUrl = await s3Api.getDownloadPresignedUrl(petId, selectedDiary.picture_name);
        setImageUrl(presignedUrl);
      } catch (error) {
        console.error('画像URLの取得に失敗しました:', error);
        setImageUrl(noImage);
      }
    };

    fetchImageUrl();
  }, [selectedDiary?.picture_name, petId]);

  const handleDateClick = (day: number) => {
    if (!day) return;
    const clickedDate = getDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (clickedDate === selectedDate) return; // すでに選択中なら何もしない
    setSelectedDate(clickedDate);
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1);
    setCurrentDate(newDate);
  };

  const hasDiary = (day: number): boolean => {
    if (!day) return false;
    const dateStr = getDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
    return diaryEntries.some(entry => formatDateToYYYYMMDD(entry.date) === dateStr);
  };

  // カレンダーの表示日計算
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();

  const daysInMonth = [
    ...Array(firstDayWeekday).fill(null),
    ...Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1),
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
      {/* 森上部 */}
      <ForestBackground type="calenderTop" top="-3%" height="200px" zIndex={2} />

      <VStack align="stretch" maxW="100%" mx="auto" pos="relative" zIndex={1} gap={0}>
        {/* 写真とコメントエリア */}
        <Box position="relative">
          <Image
            src={imageUrl ?? noImage}
            alt="Selected day image"
            objectFit="cover"
            w={{ base: '500px', md: '500px' }}
            h={{ base: '350px', md: '500px' }}
            mx="auto"
          />
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            p={4}
            background="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
            color="white"
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Box
              bg="white"
              color="black"
              p={3}
              borderRadius="xl"
              position="relative"
              maxW="70%"
              fontSize="sm"
              fontWeight="medium"
              _after={{
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: '20px',
                borderStyle: 'solid',
                borderWidth: '8px 8px 0',
                borderColor: 'white transparent transparent transparent',
              }}
            >
              {/* コメントを入れる処理が必要 */}
              <LineBreakText
                text={selectedDiary?.comment || '何をしたかな？'}
                textAlign="center"
                fontSize="md"
              />
            </Box>
            <Text fontSize="5xl" fontWeight="bold">
              {new Date(selectedDate).toLocaleDateString('ja-JP', {
                month: 'numeric',
                day: 'numeric',
              })}
            </Text>
          </Box>
        </Box>

        {/* カレンダー全体 */}
        <VStack>
          {/* 曜日ヘッダー */}
          <Grid templateColumns="repeat(7, 1fr)" gap={0} bg="accent.500" width="100%" px={4}>
            {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
              <Center key={index} h="60px" fontWeight="bold" color="teal.700">
                <Text fontSize="xl" textAlign="center">
                  {day}
                </Text>
              </Center>
            ))}
          </Grid>

          {/* カレンダー */}
          <Box bg="transparent" borderRadius="xl" width="100%" p={0}>
            <HStack justify="space-between" mb={4} px={2}>
              <Button bg="tree.500" onClick={() => changeMonth(-1)}>
                前の月
              </Button>
              <Flex align="end" gap={0}>
                <Text fontSize="3xl" fontWeight="bold" color="calender_text">
                  {currentDate.getMonth() + 1}
                </Text>
                <Text fontSize="xl" color="calender_text" ml={1}>
                  がつ
                </Text>
              </Flex>
              <Button bg="tree.500" onClick={() => changeMonth(1)}>
                次の月
              </Button>
            </HStack>

            <Grid templateColumns="repeat(7, 1fr)" gap={0} px={4}>
              {daysInMonth.map((day, index) => {
                if (!day) return <Box key={index} />;
                const dateStr = getDateString(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                );
                const isSelected = dateStr === selectedDate;

                return (
                  <Box
                    key={index}
                    position="relative"
                    textAlign="center"
                    p={1}
                    width="100%"
                    aspectRatio={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={isSelected ? 'white' : 'transparent'}
                    borderRadius="full"
                    cursor="pointer"
                    onClick={() => handleDateClick(day)}
                  >
                    <Text fontSize="xl" fontWeight="bold" color="calender_text">
                      {day}
                    </Text>

                    {/* --- チェックマーク表示 --- */}
                    {hasDiary(day) && (
                      <Box
                        as={Check}
                        position="absolute"
                        bottom="2px"
                        right="0px"
                        fontSize="xs"
                        color="red.300"
                      />
                    )}
                  </Box>
                );
              })}
            </Grid>
          </Box>
        </VStack>

        <PawTrail />

        {/* 日記表示カード */}
        {selectedDiary ? (
          <DailySummaryCard selectedDate={selectedDate} />
        ) : (
          <Board>
            <Text textAlign="center" fontSize="xl" color="text" mt="30%">
              この日は日記がありません。
            </Text>
          </Board>
        )}
      </VStack>

      {/* 森下部 */}
      <ForestBackground type="bottom" bottom="0" height="250px" zIndex={1} />
    </Box>
  );
};

export default Calendar;
