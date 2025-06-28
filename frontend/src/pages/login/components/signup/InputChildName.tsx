import SpeechBubble from '@/components/SpeechBubble';
import { toaster } from '@/components/ui/toaster';
import { useUserStore } from '@/stores/userStore';
import { Box, Button, HStack, Input, Progress, Text } from '@chakra-ui/react';
import { CircleChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupInputChildName = () => {
  const { user, setUserName } = useUserStore();
  const navigate = useNavigate();
  const [usernameLocal, setUsernameLocal] = useState('');

  const handleClick = (path: string) => {
    // バリデーション
    if (!usernameLocal) {
      toaster.create({
        title: 'ニックネームが入力されていないよ',
        description: 'ニックネームを入力してね',
        type: 'error',
        duration: 3000,
      });
      return;
    } else if (usernameLocal.length > 10) {
      toaster.create({
        title: 'ニックネームが長すぎるよ',
        description: 'ニックネームは10文字以内で入力してね',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    // userがnullの場合は更新できないため中断
    if (!user) {
      toaster.create({
        title: 'ユーザー情報が取得できません',
        description: '再度ログインしてください',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    // ユーザー情報を更新
    setUserName(usernameLocal);

    navigate(path);
  };

  return (
    <Box width="85%">
      <Box position="fixed" top={5} left={0} right={0} zIndex={2} p={4}>
        <Progress.Root value={40} maxW="sm" size="lg" mx="auto">
          <HStack gap="2">
            <Progress.Track flex="1" bg="#ffffff" borderRadius="full">
              <Progress.Range bg="orange.500" borderRadius="full" />
            </Progress.Track>
          </HStack>
        </Progress.Root>
      </Box>
      <Box position="relative" top={0} left={0} mb={16}>
        <Button
          variant="ghost"
          onClick={() => navigate('/signup/input-pass')}
          size="xs"
          bg="accent.500"
          color="text"
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          aria-label="前の画面に戻る"
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <CircleChevronLeft size={50} />
          戻る
        </Button>
      </Box>
      <SpeechBubble>
        こどものニックネームを
        <br />
        入力しよう！
      </SpeechBubble>
      <Box position="relative" mb={20} mt={6}>
        <Input
          placeholder="ニックネーム"
          value={usernameLocal}
          onChange={e => setUsernameLocal(e.target.value)}
          variant="subtle"
          width="70%"
          mx="auto"
          display="block"
          bg="white"
        />
        <Text position="absolute" bottom="5%" right="17%" fontSize="xs" color="gray.500">
          {usernameLocal.length}/10
        </Text>
      </Box>
      <Box display="flex" justifyContent="center" width="100%">
        <Button
          rounded="full"
          bg={'accent.500'}
          color={'text'}
          w={150}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          aria-label="パスワードを決定"
          size="xl"
          onClick={() => handleClick('/signup/input-pet-info')}
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          決定
        </Button>
      </Box>
    </Box>
  );
};

export default SignupInputChildName;
