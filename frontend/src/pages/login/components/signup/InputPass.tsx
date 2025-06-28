import SpeechBubble from '@/components/SpeechBubble';
import { toaster } from '@/components/ui/toaster';
import { useUserStore } from '@/stores/userStore';
import { Box, Button, HStack, PinInput, Progress, Text } from '@chakra-ui/react';
import { CircleChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupInputPass = () => {
  const { setPassword } = useUserStore();
  const navigate = useNavigate();
  const [password, setPasswordLocal] = useState('');

  const handleClick = (path: string) => {
    // バリデーション
    if (!password) {
      toaster.create({
        title: 'パスワードが入力されていないみたい',
        description: 'パスワードを決めてね',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    if (password.length !== 4) {
      toaster.create({
        title: 'パスワードのケタ数が違うみたい',
        description: 'パスワードを4ケタで入力してね',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    // パスワードをストアに設定
    setPassword(password);
    navigate(path);
  };

  return (
    <Box width="85%">
      <Box position="fixed" top={5} left={0} right={0} zIndex={2} p={4}>
        <Progress.Root value={30} maxW="sm" size="lg" mx="auto">
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
          onClick={() => navigate('/signup/input-user-name')}
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
        大人用パスワードを
        <br />
        設定しよう！
      </SpeechBubble>
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={20}
        mt={6}
      >
        <PinInput.Root size="lg">
          <PinInput.HiddenInput onChange={e => setPasswordLocal(e.target.value)} />
          <PinInput.Control>
            <PinInput.Input index={0} bg="white" border="none" placeholder="-" />
            <PinInput.Input index={1} bg="white" border="none" placeholder="-" />
            <PinInput.Input index={2} bg="white" border="none" placeholder="-" />
            <PinInput.Input index={3} bg="white" border="none" placeholder="-" />
          </PinInput.Control>
        </PinInput.Root>
        <Text position="absolute" bottom="-20px" right="20%" fontSize="xs" color="gray.500">
          数字4ケタ
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
          onClick={() => handleClick('/signup/input-child-name')}
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

export default SignupInputPass;
