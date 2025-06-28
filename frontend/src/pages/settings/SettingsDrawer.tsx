import { toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/authStore';
import { usePetStore } from '@/stores/petStore';
import { useUserStore } from '@/stores/userStore';
import { Box, Button, Center, HStack, Text, VStack } from '@chakra-ui/react';
import { signOut } from 'aws-amplify/auth';
import {
  DogIcon,
  CameraIcon,
  ImageIcon,
  InfoIcon,
  MailIcon,
  LockIcon,
  LogOutIcon,
  UserIcon,
  ChartColumnIncreasing,
  UserPen,
  SquarePen,
  RotateCcw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettingPopupStore } from '@/stores/PopupStores/SettingPopupStore';
import SettingPopup from '@/pages/settings/SettingPopup';

/**
 * アプリケーションの設定ページコンポーネント
 * @returns 設定ページを表示するページコンポーネント
 * @description ユーザー情報、設定項目、アカウント管理を表示する
 */

const settings_change = [
  { label: 'ユーザ名変更', key: 'user_name', icon: <UserPen /> },
  { label: 'ペット名変更', key: 'pet_name', icon: <SquarePen /> },
  { label: 'アバター変更', key: 'avatar', icon: <ImageIcon /> },
  { label: '大人用パスワード変更', key: 'parent_password', icon: <LockIcon /> },
];

const settings_account = [
  // { label: 'お知らせ', key: 'notification' },
  { label: '問い合わせ', key: 'contact', icon: <MailIcon /> },
  { label: 'アプリについて', key: 'about', icon: <InfoIcon /> },
  { label: '分析', key: 'analysis', icon: <ChartColumnIncreasing /> },
  { label: '写真の撮り直し', key: 'take_photo', icon: <CameraIcon /> },
];

export default function SettingsDrawer() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuthStore();
  const { user } = useUserStore();
  const { pet } = usePetStore();
  const { openPopup, setContent, isOpen } = useSettingPopupStore();

  // ログアウト処理をする関数
  const logout = async () => {
    try {
      await signOut();
      toaster.create({
        title: 'ログアウトしました',
        description: 'ログイン画面に戻ります',
        type: 'success',
        duration: 3000,
      });
      setIsLoggedIn(false);
      navigate('/loginselect');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
      toaster.create({
        title: 'ログアウトに失敗しました',
        description: '再度お試しください',
        type: 'error',
        duration: 3000,
      });
    }
  };

  // 設定項目をクリックした時の処理
  const handleSettings = (key: string) => {
    switch (key) {
      // case 'user_name':
      //   // API呼び出してユーザー名変更する処理を実装
      //   break;
      // case 'pet_name':
      //   // API呼び出してペット名変更する処理を実装
      //   break;
      // case 'avatar':
      //   // API呼び出してアバター画像する処理を実装
      //   break;
      case 'logout':
        logout();
        break;
      default:
        toaster.create({
          title: '未対応の設定項目です',
          description: `選択された機能は現在サポートされていません．`,
          type: 'error',
          duration: 3000,
        });
        break;
    }
  };

  // 大人用に切り替える
  const handleChangeRole = () => {
    setContent('change_role');
    openPopup();
  };

  return (
    <Box w="100%" mt={0}>
      {/* {user?.user_role === 'child' && ( */}
      <Center>
        <Button
          bg="accent.500"
          color="text"
          _hover={{ bg: 'accent.600' }}
          mb={2}
          onClick={() => {
            handleChangeRole();
          }}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        >
          <RotateCcw />
          {user?.user_role === 'child' ? '大人に切り替える' : '子供に切り替える'}
        </Button>
      </Center>
      {/* )} */}
      <Box bg="tree.500" py={2} px={4} mt={4}>
        <Text fontSize="md" color="white">
          ユーザ情報
        </Text>
      </Box>

      <VStack align="stretch" gap={0}>
        <HStack px={4} py={5} aria-label="ユーザ名" borderBottom="1px solid black" bg="white">
          <Text fontSize="lg">
            <UserIcon />
          </Text>
          <Text fontSize="lg">{user?.user_name || 'ななし'}</Text>
        </HStack>
        <HStack px={4} py={5} aria-label="ペット名" borderBottom="1px solid black" bg="white">
          <Text fontSize="lg">
            <DogIcon />
          </Text>
          <Text fontSize="lg">{pet?.name || 'ななし'}</Text>
        </HStack>
      </VStack>

      {/* 設定セクション */}
      <Box bg="tree.500" py={2} px={4} mt={4}>
        <Text fontSize="md" color="white">
          ユーザ情報変更
        </Text>
      </Box>

      <VStack align="stretch" gap={0}>
        {settings_change.map(item => (
          <HStack
            key={item.key}
            px={4}
            py={5}
            aria-label={item.label}
            borderBottom="1px solid black"
            bg="white"
            _hover={{ bg: 'gray.100' }}
            onClick={() => handleSettings(item.key)}
          >
            <Text fontSize="lg">{item.icon}</Text>
            <Text fontSize="lg">{item.label}</Text>
          </HStack>
        ))}
      </VStack>

      <Box bg="tree.500" py={2} px={4} mt={4}>
        <Text fontSize="md" color="white">
          アカウント管理
        </Text>
      </Box>

      <VStack align="stretch" gap={0}>
        {settings_account.map(item => (
          <HStack
            key={item.key}
            px={4}
            py={5}
            aria-label={item.label}
            borderBottom="1px solid black"
            bg="white"
            _hover={{ bg: 'gray.100' }}
            onClick={() => handleSettings(item.key)}
          >
            <Text fontSize="lg">{item.icon}</Text>
            <Text fontSize="lg">{item.label}</Text>
          </HStack>
        ))}
      </VStack>
      <Center mt={6}>
        <Button
          bg="red.500"
          onClick={logout}
          size="lg"
          _hover={{ bg: 'red.600' }}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          mb={4}
        >
          <LogOutIcon />
          ログアウト
        </Button>
      </Center>
      {isOpen && <SettingPopup />}
    </Box>
  );
}
