import SpeechBubble from '@/components/SpeechBubble';
import { toaster } from '@/components/ui/toaster';
import { usePetStore } from '@/stores/petStore';
import { useDailyPhotoPopupStore } from '@/stores/PopupStores/DailyPhotoPopupStores';
import { Box, Button, Image, PinInput, Text, VStack } from '@chakra-ui/react';
import { CircleChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useUserStore } from '@/stores/userStore';

const PassDailyPhoto = () => {
  const navigate = useNavigate();
  const [passwordLocal, setPasswordLocal] = useState('');
  const pet = usePetStore(state => state.pet);
  const { closePopup } = useDailyPhotoPopupStore();
  // const user = useUserStore(state => state.user);

  const handlePasswordSubmit = () => {
    if (passwordLocal.length !== 4) {
      toaster.create({
        title: 'エラー',
        description: '4桁のパスワードを入力してください',
        type: 'error',
        duration: 3000,
      });
      setPasswordLocal('');
      return;
    }

    {
      /* パスワードが一致した場合のとき，user.passwordを参照するが
            今回はnullのため，パスワードが一致した場合のときの処理はコメントアウト*/
    }
    // if (passwordLocal === user?.password) {
    if (passwordLocal.length == 4) {
      closePopup();
      navigate('/app');
    } else {
      // パスワードが一致しない場合
      toaster.create({
        title: 'エラー',
        description: 'パスワードが正しくありません',
        type: 'error',
        duration: 3000,
      });
      setPasswordLocal(''); // パスワードをリセット
    }
  };

  return (
    <Box width="100%">
      <Button
        position="fixed"
        top={5}
        left={5}
        variant="ghost"
        onClick={() => closePopup()}
        size="xs"
        bg="tree.500"
        color="white"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        aria-label="ポップアップを閉じる"
        _hover={{
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease-in-out',
        }}
        zIndex={1003}
      >
        <CircleChevronLeft size={50} />
        戻る
      </Button>
      <SpeechBubble>まずは写真をとろう！</SpeechBubble>
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={10}
        mt={6}
      >
        <VStack>
          <Box
            mt={-8}
            mb={5}
            width="120px"
            height="120px"
            borderRadius="full"
            overflow="hidden"
            border="4px solid var(--chakra-colors-accent-500)" //accent.500が効かない！！！
            boxShadow="0 4px 6px rgba(48, 34, 157, 0.34)"
          >
            <Image
              src={pet?.image_name}
              alt="Pet Avatar"
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
          <Text fontSize="sm" color="gray.500">
            おとなログインはパスワードを入力
          </Text>
          <PinInput.Root size="lg">
            <PinInput.HiddenInput onChange={e => setPasswordLocal(e.target.value)} />
            <PinInput.Control>
              <PinInput.Input index={0} bg="white" border="none" placeholder="-" />
              <PinInput.Input index={1} bg="white" border="none" placeholder="-" />
              <PinInput.Input index={2} bg="white" border="none" placeholder="-" />
              <PinInput.Input index={3} bg="white" border="none" placeholder="-" />
            </PinInput.Control>
          </PinInput.Root>
          <Button
            rounded="full"
            bg={'accent.500'}
            color={'text'}
            w={150}
            mt={10}
            mb={-30}
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            aria-label="パスワードを決定"
            size="xl"
            onClick={handlePasswordSubmit}
            _hover={{
              transform: 'translateY(-1px)',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            ホームへ
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

const CheckPhoto = () => {
  const { capturedImage, closePopup } = useDailyPhotoPopupStore();
  const navigate = useNavigate();

  return (
    <Box width="100%" mt={20}>
      <Button
        position="fixed"
        top={5}
        left={5}
        variant="ghost"
        onClick={() => closePopup()}
        size="xs"
        bg="tree.500"
        color="white"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        aria-label="撮影に戻る"
        _hover={{
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease-in-out',
        }}
        zIndex={1003}
      >
        <CircleChevronLeft size={50} />
        もう一度写真を撮る
      </Button>
      <SpeechBubble>この写真でいいかな？</SpeechBubble>
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={10}
        mt={6}
      >
        <VStack>
          <Box
            mt={-5}
            mb={5}
            width="90%"
            height="90%"
            borderRadius="xl"
            overflow="hidden"
            border="4px solid white"
            boxShadow="0 4px 6px rgba(48, 34, 157, 0.34)"
          >
            {capturedImage ? (
              <Image
                src={capturedImage}
                alt="Captured Photo"
                width="100%"
                height="100%"
                objectFit="cover"
              />
            ) : (
              <Box width="100%" height="100%" bg="gray.200" />
            )}
          </Box>
          <Button
            rounded="full"
            bg={'accent.500'}
            color={'text'}
            w={150}
            mb={-30}
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            aria-label="OK"
            size="xl"
            fontSize="xl"
            onClick={() => {
              // handleOK;
              closePopup();
              navigate('/app');
            }}
            _hover={{
              transform: 'translateY(-1px)',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            OK
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

const DailyPhotoPopup = () => {
  const { content } = useDailyPhotoPopupStore();

  const renderContent = () => {
    switch (content) {
      case 'inputPass':
        return <PassDailyPhoto />;
      case 'checkPhoto':
        return <CheckPhoto />;
      default:
        return <PassDailyPhoto />;
    }
  };

  return (
    <Box>
      {/* オーバーレイ */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.6)"
        zIndex={1001}
      />
      {/* 遷移コンテナ */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="90%"
        maxWidth="500px"
        bg="tree.400"
        borderRadius="3xl"
        p={4}
        zIndex={1002}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default DailyPhotoPopup;
