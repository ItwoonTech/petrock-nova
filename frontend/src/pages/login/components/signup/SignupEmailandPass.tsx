import SpeechBubble from '@/components/SpeechBubble';
import { Box, Button, Input, InputGroup, Text, VStack } from '@chakra-ui/react';
import { signUp } from 'aws-amplify/auth';
import { CircleChevronLeft, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupEmailAndPass = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignUp = async () => {
    try {
      if (!validateEmail(email)) {
        setErrorMsg('有効なメールアドレスを入力してください');
        return;
      }

      if (!validatePassword(password)) {
        setErrorMsg('パスワードは8文字以上で入力してください');
        return;
      }

      setIsLoading(true);
      setErrorMsg('');

      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      });

      navigate('/signup/verify', { state: { email, password } });
    } catch (err: any) {
      console.error('Signup error:', err);
      setErrorMsg(err.message || '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
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
      <SpeechBubble>
        <Text>
          メールアドレスと
          <br />
          パスワードを入力しよう！
        </Text>
      </SpeechBubble>
      <VStack gap={4} mt={6} width="100%" alignItems="center">
        <InputGroup startElement={<Mail />}>
          <Input
            placeholder="メールアドレス"
            bg="white"
            width="100%"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            _invalid={{ borderColor: 'red.500' }}
            textAlign="center"
          />
        </InputGroup>
        <InputGroup startElement={<LockKeyhole />}>
          <Input
            placeholder="パスワード"
            type="password"
            bg="white"
            width="100%"
            value={password}
            onChange={e => setPassword(e.target.value)}
            _invalid={{ borderColor: 'red.500' }}
            textAlign="center"
          />
        </InputGroup>
        {errorMsg && <Text color="red.500">{errorMsg}</Text>}
        <Button
          onClick={handleSignUp}
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
          {isLoading ? '登録中...' : '登録する'}
        </Button>
      </VStack>
    </Box>
  );
};

export default SignupEmailAndPass;
