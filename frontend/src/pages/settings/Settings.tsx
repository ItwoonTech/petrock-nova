import { toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/authStore';
import { usePetStore } from '@/stores/petStore';
import { useUserStore } from '@/stores/userStore';
import { Box, Button, Center, HStack, Text, VStack } from '@chakra-ui/react';
import { signOut } from 'aws-amplify/auth';
import {
  CameraIcon,
  ChartColumnIncreasing,
  DogIcon,
  ImageIcon,
  InfoIcon,
  LockIcon,
  LogOutIcon,
  MailIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * アプリケーションの設定ページコンポーネント
 * @returns 設定ページを表示するページコンポーネント
 * @description ユーザー情報、設定項目、アカウント管理を表示する
 */

const settings_change = [
  { label: 'ユーザ名変更', key: 'user_name', icon: <UserIcon /> },
  { label: 'ペット名変更', key: 'pet_name', icon: <DogIcon /> },
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

export default function Settings() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuthStore();
  const { user } = useUserStore();
  const { pet } = usePetStore();
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
  return (
    <Box
      minH={{ base: '100vh', md: '150vh' }}
      //bg="secondary.500" // 背景色
      pt={{ base: 12, md: 14 }}
      pb={{ base: '60px', md: '80px' }}
      w="100%"
    >
      <Box
        position="relative"
        width="100%"
        height="300px"
        backgroundImage="url('/SettingSiginBoard.svg')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        mt={5}
      >
        <VStack
          gap={4}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-48%, -50%)"
          width="67%"
          textAlign="center"
        >
          <Text
            mb={4}
            as="h1"
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="text"
          >
            <SettingsIcon style={{ marginRight: 8 }} />
            設定
          </Text>
          <Box position="relative" width="100%">
            <Box
              bg="accent.500"
              px={4}
              py={1}
              borderRadius="full"
              fontWeight="bold"
              fontSize="sm"
              boxShadow="sm"
              zIndex={1}
              position="absolute"
              top="-10px"
              left="0"
            >
              ユーザ名
            </Box>
            {/*ユーザ名を表示*/}
            <Box bg="#F2ECE3" p={3} borderRadius="full" boxShadow="md" width="100%">
              <Text fontWeight="bold" fontSize="xl" color="gray.800">
                {user?.user_name || 'ななし'}
              </Text>
            </Box>
          </Box>
          <Box position="relative" width="100%">
            <Box
              bg="accent.500"
              px={4}
              py={1}
              borderRadius="full"
              fontWeight="bold"
              fontSize="sm"
              boxShadow="sm"
              zIndex={1}
              position="absolute"
              top="-10px"
              left="0"
            >
              ペット名
            </Box>
            {/*ペット名を表示*/}
            <Box bg="#F2ECE3" p={3} borderRadius="full" boxShadow="md" width="100%">
              <Text fontWeight="bold" fontSize="xl" color="gray.800">
                {pet?.name || 'ななし'}
              </Text>
            </Box>
          </Box>
        </VStack>
      </Box>

      {/* 設定セクション */}
      <Box bg="gray.100" py={2} px={4} mt={4}>
        <Text fontSize="md" color="gray.600">
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
            onClick={() => handleSettings(item.key)}
          >
            <Text fontSize="lg">{item.icon}</Text>
            <Text fontSize="lg">{item.label}</Text>
          </HStack>
        ))}
      </VStack>

      <Box bg="gray.100" py={2} px={4} mt={4}>
        <Text fontSize="md" color="gray.600">
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
            onClick={() => handleSettings(item.key)}
          >
            <Text fontSize="lg">{item.icon}</Text>
            <Text fontSize="lg">{item.label}</Text>
          </HStack>
        ))}
      </VStack>
      <Center mt={6} mb={20}>
        <Button bg="red.500" onClick={logout} color="white" size="lg">
          <LogOutIcon />
          ログアウト
        </Button>
      </Center>
    </Box>
  );
}
