import { Box, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LoginSelect = () => {
  const navigate = useNavigate();

  return (
    <Box width="85%" mt={-20}>
      <Box
        backgroundImage="url('/Petrock_logo.png')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        aria-label="ペットケアアプリのロゴ"
        role="img"
        display="flex"
        alignItems="center" justifyContent="center"
        w="100%"
        h="350px"
      >
      </Box>
      <VStack gap={6} mt={-10}>
        <Button
          rounded="full"
          bg={'accent.500'}
          color={'text'}
          w="60%"
          size="lg"
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          aria-label="ログインボタン"
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={() => navigate('/loginselect/login')}
        >
          ログイン
        </Button>
        <Button
          rounded="full"
          bg={'accent.500'}
          color={'text'}
          w="60%"
          size="lg"
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          aria-label="新規登録"
          onClick={() => navigate('/signup')}
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          新規登録
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginSelect;
