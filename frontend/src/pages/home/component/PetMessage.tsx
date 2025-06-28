import noImage from '@/assets/images/no-image.png';
import LineBreakText from '@/components/LineBreakText';
import { formatDateToYYYYMMDD } from '@/lib/dateUtils';
import { useDiaryStore } from '@/stores/diaryStore';
import { usePetStore } from '@/stores/petStore';
import { Box, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const PetMessage = () => {
  const diary = useDiaryStore(state => state.diary);
  const pet = usePetStore(state => state.pet);
  const getPetImageUrl = usePetStore(state => state.getPetImageUrl);

  const [petImageUrl, setPetImageUrl] = useState<string | null>(null);

  // 本日の日付かどうかをチェック
  const isTodayDiary = diary && diary.date === formatDateToYYYYMMDD(new Date());

  // 本日の日記の場合はそのadviceを、そうでなければデフォルトメッセージを使用
  const diaryAdvice = isTodayDiary
    ? diary.advice || '今日も元気に過ごそう！'
    : '写真はもう撮ったかな？';

  useEffect(() => {
    const loadPetImage = async () => {
      if (pet?.image_name) {
        const url = await getPetImageUrl();
        setPetImageUrl(url);
      } else {
        setPetImageUrl(null);
      }
    };
    loadPetImage();
  }, [pet?.image_name, getPetImageUrl]);

  return (
    <Box position="relative" width="full" display="flex" flexDirection="column" alignItems="center">
      {/* 吹き出し */}
      <Box
        bg="white"
        py="10%"
        minH="100%"
        minW="80%"
        maxW="80%"
        borderRadius="2xl"
        mb={4}
        position="relative"
        boxShadow="lg"
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-40px',
          left: '20%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '35px solid transparent',
          borderRight: '0px solid transparent',
          borderTop: '40px solid white',
        }}
      >
        <LineBreakText text={diaryAdvice} textAlign="center" fontSize="xl" fontWeight="bold" />
      </Box>

      {/* ペットアイコン */}
      <Box
        width="250px"
        height="250px"
        borderRadius="full"
        overflow="hidden"
        borderColor="accent.500"
        borderWidth="4px"
        borderStyle="solid"
        boxShadow="lg"
      >
        <Image
          src={petImageUrl || noImage}
          alt="Pet Avatar"
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
    </Box>
  );
};

export default PetMessage;
