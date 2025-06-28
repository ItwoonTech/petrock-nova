// src/pages/login/components/LoginForm.tsx
import SpeechBubble from '@/components/SpeechBubble';
import { toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/authStore';
import { useResetPassPopupStore } from '@/stores/PopupStores/ResetPassPopupStore';
import { useUserStore } from '@/stores/userStore';
import { Box, Button, Input, InputGroup, Link, Text, VStack } from '@chakra-ui/react';
import { signIn } from 'aws-amplify/auth';
import { CircleChevronLeft, LockKeyhole, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResetPassPopup from './ResetPassPopup';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { openPopup, isOpen } = useResetPassPopupStore();

  // ログイン状態の管理
  const { isLoggedIn, userId, initializeAuth } = useAuthStore();
  const { setUserId } = useUserStore();

  useEffect(() => {
    // ログイン済みの場合は自動的に遷移
    if (isLoggedIn) {
      navigate('/app/take-daily-photo');
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    try {
      // 入力値のバリデーション
      if (!email || !password) {
        setErrorMsg('メールアドレスとパスワードを入力してください');
        return;
      }

      setIsLoading(true);
      setErrorMsg('');

      // ログイン処理
      await signIn({ username: email, password });
      initializeAuth();
      // const { userId } = await getCurrentUser();
      // setIsLoggedIn(true);
      if (userId) {
        setUserId(userId);
      }
      navigate('/app/take-daily-photo');
    } catch (err: any) {
      setErrorMsg(err.message || 'ログインに失敗しました');
      // エラーメッセージの日本語化
      if (err.name === 'NotAuthorizedException') {
        setErrorMsg('メールアドレスまたはパスワードが間違っています');
      } else if (err.name === 'UserNotFoundException') {
        setErrorMsg('このメールアドレスは登録されていません');
      } else if (err.name === 'UserNotConfirmedException') {
        setErrorMsg('メールアドレスの確認が完了していません');
      } else {
        setErrorMsg('ログインに失敗しました。もう一度お試しください');
      }
      // エラーをトースターで表示
      toaster.create({
        title: 'エラー',
        description: errorMsg,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    openPopup();
  };

  return (
    <Box width="85%">
      <Box position="relative" top={0} left={0} mb={16}>
        <Button
          variant="ghost"
          onClick={() => navigate('/loginselect/')}
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
      <SpeechBubble>まずはログインしよう！</SpeechBubble>
      <VStack gap={4} mt={6} width="90%" alignItems="center" ml="5">
        <InputGroup startElement={<Mail />}>
          <Input
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            textAlign="center"
            width="100%"
            mx="auto"
            display="block"
            bg="white"
            _invalid={{ borderColor: 'red.500' }}
          />
        </InputGroup>
        <InputGroup startElement={<LockKeyhole />}>
          <Input
            placeholder="パスワード"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            textAlign="center"
            width="100%"
            mx="auto"
            display="block"
            bg="white"
            _invalid={{ borderColor: 'red.500' }}
          />
        </InputGroup>
        <Link
          onClick={handleResetPassword}
          color="gray.500"
          fontSize="sm"
          variant="underline"
          cursor={'pointer'}
          opacity={1}
          pointerEvents={'auto'}
          _hover={{ textDecoration: 'none' }}
        >
          パスワードを忘れた方はこちら
        </Link>
        {errorMsg && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {errorMsg}
          </Text>
        )}
        <Button
          onClick={handleLogin}
          size="xl"
          rounded="full"
          width="50%"
          mx="auto"
          display="block"
          bg="accent.500"
          color="text"
          mt={10}
          loading={isLoading}
          loadingText=" ログイン中..."
          spinnerPlacement="start"
        >
          ログイン
        </Button>
      </VStack>
      {isOpen && <ResetPassPopup />}
    </Box>
  );
};

export default LoginForm;
