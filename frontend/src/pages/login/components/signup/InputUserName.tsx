import SpeechBubble from '@/components/SpeechBubble';
import { Toaster, toaster } from '@/components/ui/toaster';
import { useUserStore } from '@/stores/userStore';
import type { UserRole } from '@/types/user';
import { Box, Button, HStack, Input, Progress, Text, VStack } from '@chakra-ui/react';
import { UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupInputUserName = () => {
  const { user, setUserBasicInfo } = useUserStore();
  const [username, setUsernameLocal] = useState(''); // 入力中の一時的な値
  const navigate = useNavigate();

  const handleSubmit = async (path: string, role: string) => {
    if (!user?.user_id) {
      toaster.create({
        title: 'ユーザー情報が取得できません',
        description: '再度ログインしてください',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    // ユーザネームの有効性をチェック
    validateUserName();

    // ユーザー情報をストアにセット
    setUserBasicInfo(user.user_id, username, role as UserRole);

    navigate(path);
  };

  const validateUserName = () => {
    if (!username) {
      toaster.create({
        title: 'ユーザー名が入力されていないよ',
        description: 'ユーザー名を入力してね',
        type: 'error',
        duration: 3000,
      });
      return;
    }
    // 文字数制限チェック
    else if (username.length > 10) {
      toaster.create({
        title: 'ユーザー名が長すぎるよ',
        description: 'ユーザー名は10文字以内で入力してね',
        type: 'error',
        duration: 3000,
      });
      return;
    }
  };

  return (
    <Box width="85%">
      <Box position="fixed" top={5} left={0} right={0} zIndex={2} p={4}>
        <Progress.Root value={20} maxW="sm" size="lg" mx="auto">
          <HStack gap="2">
            <Progress.Track flex="1" bg="#ffffff" borderRadius="full">
              <Progress.Range bg="orange.500" borderRadius="full" />
            </Progress.Track>
          </HStack>
        </Progress.Root>
      </Box>
      <SpeechBubble>あなたの名前を教えて！</SpeechBubble>

      <Box position="relative" mb={20} mt={6}>
        <Input
          placeholder="ユーザー名"
          value={username}
          onChange={e => setUsernameLocal(e.target.value)}
          variant="subtle"
          width="70%"
          mx="auto"
          display="block"
          bg="white"
        />
        <Text position="absolute" bottom="5%" right="17%" fontSize="xs" color="gray.500">
          {username.length}/10
        </Text>
      </Box>

      <VStack gap={4} align="center" width="100%">
        <Button
          rounded="xl"
          bg="tree.400"
          color="text"
          w="80%"
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          aria-label="親子で使う"
          onClick={() => handleSubmit('/signup/input-pass', 'child')}
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <UserRoundPlus />
          親子で使う
        </Button>
        <Button
          rounded="xl"
          bg="accent.500"
          color="text"
          w="80%"
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          aria-label="ひとりで使う"
          onClick={() => handleSubmit('/signup/input-pet-info', 'general')}
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          ひとりで使う
        </Button>
      </VStack>
      <Toaster />
    </Box>
  );
};

export default SignupInputUserName;
