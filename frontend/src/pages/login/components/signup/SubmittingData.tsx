import SpeechBubble from '@/components/SpeechBubble';
import { useAuthStore } from '@/stores/authStore';
import { Box, Center, Spinner, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SubmittingData = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);
  // このコンポーネントで，パスワード・子供のユーザ名等Storeに格納していたデータを送信する処理が必要

  useEffect(() => {
    const submitData = async () => {
      try {
        // 3～4秒の遅延を追加
        await new Promise(resolve => setTimeout(resolve, 3500));

        // 登録完了後、メインページに遷移
        setIsLoggedIn(true);
        navigate('/app');
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    };

    submitData();
  }, [navigate, setIsLoggedIn]);

  return (
    <Box width="85%">
      <SpeechBubble>
        ペットとの生活が始まるよ！
        <br />
        ワクワクするね！
      </SpeechBubble>

      <Center>
        <VStack gap={4}>
          <Spinner size="xl" color="orange.500" borderWidth="10px" />
          <Text fontSize="lg" color="gray.600">
            準備中だよ、少し待ってね...
          </Text>
        </VStack>
      </Center>
    </Box>
  );
};

export default SubmittingData;
