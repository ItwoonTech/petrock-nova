import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoginFooter from '@/components/LoginFooter';
import { formatDateToYYYYMMDD } from '@/lib/dateUtils';
import { useAuthStore } from '@/stores/authStore';
import { useDiaryStore } from '@/stores/diaryStore';
import { usePetStore } from '@/stores/petStore';
import { useUserStore } from '@/stores/userStore';
import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

/* メインコンテンツを表示
 * ログイン後のアプリ画面全体を管理するコンポーネント
 */
const MainScene = () => {
  const location = useLocation();
  const isTakeDailyPhoto = location.pathname === '/app/take-daily-photo';

  // アプリ画面で共通して必要なペット情報を取得するためのストア
  const { userId } = useAuthStore();
  // const userId = '42c829b1-b69a-4d27-b755-322f4661215d'; // 仮のユーザーID。実際には AuthContext? から取得
  const user = useUserStore(state => state.user);
  const fetchUser = useUserStore(state => state.fetchUser);
  const fetchPet = usePetStore(state => state.fetchPet);
  const pet = usePetStore(state => state.pet);
  const fetchDiaryByDate = useDiaryStore(state => state.fetchDiaryByDate);
  const checkDailyPhotoStatus = useAuthStore(state => state.checkDailyPhotoStatus);

  // 1. userIdからuser情報を取得
  useEffect(() => {
    if (!userId) return;
    fetchUser(userId);
  }, [userId, fetchUser]);
  console.log('user', user);

  // 2. userが取得できたらpetIdでpet情報取得
  useEffect(() => {
    if (!user?.pet_id) return;
    fetchPet(user.pet_id);
  }, [user?.pet_id, fetchPet]);
  console.log('pet', pet);

  // 3. petが取得できたら当日の日記取得
  // 写真の状態チェック
  useEffect(() => {
    if (!pet?.pet_id) return;
    const today = formatDateToYYYYMMDD(new Date());

    const checkDiaryAndPhotoStatus = async () => {
      const diary = await fetchDiaryByDate(pet.pet_id, today);
      if (diary) {
        checkDailyPhotoStatus();
      }
    };

    checkDiaryAndPhotoStatus();
  }, [pet?.pet_id, fetchDiaryByDate, checkDailyPhotoStatus]);

  return (
    <Box position="relative">
      {/* 背景レイヤー */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="primary.500"
        zIndex={0}
        h="100vh"
      />
      {/* メインコンテンツ */}
      <Box position="relative" zIndex={1}>
        <Box bgGradient="linear-gradient(to bottom, var(--chakra-colors-secondary-500), var(--chakra-colors-secondary-50))">
          <Header />
          <Outlet />
          {/* 撮影画面の場合はアイコンのあるフッターを表示しない */}
          {isTakeDailyPhoto ? <LoginFooter /> : <Footer />}
        </Box>
      </Box>
    </Box>
  );
};

export default MainScene;
