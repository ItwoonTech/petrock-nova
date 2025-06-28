import { toaster } from '@/components/ui/toaster';
import { useSettingPopupStore } from '@/stores/PopupStores/SettingPopupStore';
import { useUserStore } from '@/stores/userStore';
import { Box, Button, Center, PinInput, Text, VStack } from '@chakra-ui/react';
import { CircleChevronLeft } from 'lucide-react';
import { useState } from 'react';

// 一般ロールに変更
const ChangeRoleToGeneral = () => {
  const [inputPass, setInputPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { closePopup } = useSettingPopupStore();
  const { user, setUserRole } = useUserStore();

  // 入力されたパスワードが正しいかを確認
  const checkPass = () => {
    if (inputPass !== user?.password) {
      return false;
    }
    return true;
  };

  const handleClosePopup = () => {
    closePopup();
  };

  const handleConfirmReset = () => {
    setIsLoading(true);
    if (checkPass()) {
      setUserRole('general');
      setIsLoading(false);
      closePopup();
      // console.log('大人モードに切り替える');
    } else {
      setIsLoading(false);
      toaster.create({
        title: '大人パスワードが間違っています',
        description: '正しいパスワードを入力してください',
        type: 'error',
        duration: 3000,
      });
      // console.log('大人パスワードが間違っています');
    }
  };

  return (
    <Box width="100%">
      <Button
        variant="ghost"
        onClick={handleClosePopup}
        size="xs"
        bg="tree.500"
        color="white"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        aria-label="ポップアップを閉じる"
        _hover={{
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <CircleChevronLeft size={50} />
        戻る
      </Button>
      <Box
        position="relative"
        width="100%"
        height="250px"
        backgroundImage="url('/bubble2.svg')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        mt={-5}
      >
        <Text
          position="absolute"
          top="44%"
          left="50%"
          transform="translate(-50%, -50%)"
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          width="80%"
          lineHeight="1.2"
        >
          大人モードに
          <br />
          切り替えますか？
        </Text>
      </Box>
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={7}
        mt={-10}
      >
        <VStack gap={4} align="center" width="100%">
          <Text fontSize="sm" color="text">
            設定した大人パスワードを入力してください
          </Text>
          <PinInput.Root size="xl">
            <PinInput.HiddenInput onChange={e => setInputPass(e.target.value)} />
            <PinInput.Control>
              <PinInput.Input index={0} bg="white" border="none" placeholder="-" />
              <PinInput.Input index={1} bg="white" border="none" placeholder="-" />
              <PinInput.Input index={2} bg="white" border="none" placeholder="-" />
              <PinInput.Input index={3} bg="white" border="none" placeholder="-" />
            </PinInput.Control>
          </PinInput.Root>
        </VStack>
      </Box>
      <Center>
        <Button
          mt={3}
          mb={5}
          size="xl"
          bg="accent.500"
          color="text"
          borderRadius="full"
          width="60%"
          textAlign="center"
          boxShadow="0 4px 6px rgba(48, 34, 157, 0.34)"
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={handleConfirmReset}
          loading={isLoading}
        >
          大人モードに切り替える
        </Button>
      </Center>
    </Box>
  );
};

// childロールに変更
const ChangeRoleToChild = () => {
  const { closePopup } = useSettingPopupStore();
  const { setUserRole } = useUserStore();

  const handleClosePopup = () => {
    closePopup();
  };

  const handleConfirmReset = () => {
    setUserRole('child');
    console.log('子供モードに切り替え');
    closePopup();
  };

  return (
    <Box width="100%">
      <Button
        variant="ghost"
        onClick={handleClosePopup}
        size="xs"
        bg="tree.500"
        color="white"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        aria-label="ポップアップを閉じる"
        _hover={{
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <CircleChevronLeft size={50} />
        戻る
      </Button>
      <Box
        position="relative"
        width="100%"
        height="250px"
        backgroundImage="url('/bubble2.svg')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        mt={-5}
      >
        <Text
          position="absolute"
          top="44%"
          left="50%"
          transform="translate(-50%, -50%)"
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          width="80%"
          lineHeight="1.2"
        >
          子供モードに
          <br />
          切り替えますか？
        </Text>
      </Box>
      <Center>
        <Button
          mb={5}
          mt={-10}
          size="xl"
          bg="accent.500"
          color="text"
          borderRadius="full"
          width="60%"
          textAlign="center"
          boxShadow="0 4px 6px rgba(48, 34, 157, 0.34)"
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={handleConfirmReset}
        >
          切り替える
        </Button>
      </Center>
    </Box>
  );
};

const ChangeUserName = () => {
  return (
    <Box width="100%">
      <Text>ユーザー名を変更する</Text>
    </Box>
  );
};

const ChangePetName = () => {
  return (
    <Box width="100%">
      <Text>ペット名を変更する</Text>
    </Box>
  );
};

const ChangeAvatar = () => {
  return (
    <Box width="100%">
      <Text>アバターを変更する</Text>
    </Box>
  );
};

const ChangePassword = () => {
  return (
    <Box width="100%">
      <Text>パスワードを変更する</Text>
    </Box>
  );
};

const SettingPopup = () => {
  const { content } = useSettingPopupStore();
  const { user } = useUserStore();

  const renderContent = () => {
    switch (content) {
      case 'change_role':
        return user?.user_role === 'child' ? <ChangeRoleToGeneral /> : <ChangeRoleToChild />;
      case 'user_name':
        return <ChangeUserName />;
      case 'pet_name':
        return <ChangePetName />;
      case 'avatar':
        return <ChangeAvatar />;
      case 'parent_password':
        return <ChangePassword />;
      default:
        return;
    }
  };

  return (
    <Box pl={5} pr={5}>
      {/* オーバーレイ */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.6)"
        zIndex={2}
      />

      {/* 遷移コンテナ */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="90%"
        maxWidth="500px"
        bg="var(--chakra-colors-tree-400)"
        borderRadius="3xl"
        border="5px solid white"
        p={4}
        zIndex={3}
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

export default SettingPopup;
