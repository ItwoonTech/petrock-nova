import SpeechBubble from '@/components/SpeechBubble';
import { toaster } from '@/components/ui/toaster';
import { useUserStore } from '@/stores/userStore';
import { Box, Button, Input, Link, Text, VStack } from '@chakra-ui/react';
import { confirmSignUp, getCurrentUser, resendSignUpCode, signIn } from 'aws-amplify/auth';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SignupVerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || '';
  const password = (location.state as any)?.password || '';
  const { setUserId } = useUserStore();

  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      setErrorMsg('');

      await resendSignUpCode({
        username: email,
      });

      toaster.create({
        title: '確認コードを再送しました',
        description: 'メールを確認してください',
        type: 'success',
        duration: 3000,
      });
    } catch (err: any) {
      console.error('Resend error:', err);
      setErrorMsg(err.message || '確認コードの再送に失敗しました');
    } finally {
      setIsResending(false);
    }
  };

  const handleConfirm = async () => {
    if (!code.trim()) {
      setErrorMsg('確認コードを入力してください');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');

      // 確認コードの検証
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      // 確認成功後、自動的にサインイン
      await signIn({
        username: email,
        password: password,
      });

      // 現在のユーザー情報を取得
      const { userId } = await getCurrentUser();

      // ユーザーIDをストアに保存
      setUserId(userId);

      // 確認成功 → ユーザー名などのフローへ進む
      navigate('/signup/input-user-name');
    } catch (err: any) {
      console.error('Verification error:', err);
      setErrorMsg(err.message || '確認に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box width="85%">
      <SpeechBubble smallText={`（${email} に送信）`}>確認コードを入力してね！</SpeechBubble>
      <VStack gap={4} mt={6}>
        <Input
          placeholder="確認コード"
          width="70%"
          mx="auto"
          display="block"
          bg="white"
          value={code}
          onChange={e => setCode(e.target.value)}
          _invalid={{ borderColor: 'red.500' }}
          textAlign="center"
        />
        {errorMsg && <Text color="red.500">{errorMsg}</Text>}
        <Link
          onClick={handleResendCode}
          color="gray.500"
          fontSize="sm"
          variant="underline"
          cursor={isResending ? 'not-allowed' : 'pointer'}
          opacity={isResending ? 0.5 : 1}
          pointerEvents={isResending ? 'none' : 'auto'}
          _hover={{ textDecoration: 'none' }}
        >
          {isResending ? '送信中...' : '確認コードを再送する'}
        </Link>
        <Button
          onClick={handleConfirm}
          loading={isLoading}
          size="xl"
          rounded="full"
          width="50%"
          mx="auto"
          display="block"
          bg="accent.500"
          color="text"
          mt={10}
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {isLoading ? '確認中...' : '確認する'}
        </Button>
      </VStack>
    </Box>
  );
};

export default SignupVerifyCode;
