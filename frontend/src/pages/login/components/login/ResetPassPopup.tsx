import SpeechBubble from '@/components/SpeechBubble';
import { toaster } from '@/components/ui/toaster';
import { useResetPassPopupStore } from '@/stores/PopupStores/ResetPassPopupStore';
import { Box, Button, HStack, Input, InputGroup, Text, VStack } from '@chakra-ui/react';
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth';
import { CircleChevronLeft, KeyRound, LockKeyhole, MailIcon } from 'lucide-react';
import { useState } from 'react';

const ResetPass = () => {
  const { closePopup } = useResetPassPopupStore();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSendCode = async () => {
    try {
      await resetPassword({ username: email });
      toaster.create({
        title: '認証コードを送信しました',
        description: 'メールを確認してください',
        type: 'success',
        duration: 7000,
      });
    } catch (err) {
      toaster.create({
        title: 'エラー',
        description: 'メールアドレスが正しくありません',
        type: 'error',
        duration: 3000,
      });
    }
  };

  const handleConfirmReset = async () => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });
      toaster.create({
        title: 'パスワードが変更されました',
        description: 'ログインしてください',
        type: 'success',
        duration: 5000,
      });
      closePopup();
    } catch (err) {
      toaster.create({
        title: 'エラー',
        description: '認証コードが正しくありません',
        type: 'error',
        duration: 3000,
      });
    }
  };
  const handleClosePopup = async () => {
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
      <SpeechBubble>パスワードをリセットしよう！</SpeechBubble>
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={7}
        mt={6}
      >
        <VStack width="100%" gap={7}>
          <Text fontSize="sm" color="text">
            メールアドレスを入力して、認証コードを送信
          </Text>
          <HStack gap={5} mt={-5}>
            <InputGroup startElement={<MailIcon />}>
              <Input
                placeholder="メールアドレス"
                type="email"
                bg="#F2ECE3"
                width="100%"
                textAlign="center"
                borderRadius="xl"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </InputGroup>
            <Button
              bg="accent.500"
              color="text"
              borderRadius="2xl"
              width="20%"
              textAlign="center"
              boxShadow="0 4px 6px rgba(48, 34, 157, 0.34)"
              _hover={{
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={handleSendCode}
            >
              送信
            </Button>
          </HStack>
          <VStack gap={3}>
            <Text fontSize="sm" color="text" mb={-1}>
              認証コードを入力してパスワードを変更
            </Text>
            <InputGroup startElement={<LockKeyhole />}>
              <Input
                placeholder="認証コード"
                type="number"
                bg="#F2ECE3"
                width="100%"
                borderRadius="xl"
                textAlign="center"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
            </InputGroup>
            <InputGroup startElement={<KeyRound />}>
              <Input
                placeholder="新しいパスワード"
                type="password"
                bg="#F2ECE3"
                width="100%"
                borderRadius="xl"
                textAlign="center"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </InputGroup>
            <Button
              mt={3}
              size="xl"
              bg="accent.500"
              color="text"
              borderRadius="full"
              width="80%"
              textAlign="center"
              boxShadow="0 4px 6px rgba(48, 34, 157, 0.34)"
              _hover={{
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={handleConfirmReset}
            >
              パスワードを変更
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

const ResetPassPopup = () => {
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
        <ResetPass />
      </Box>
    </Box>
  );
};

export default ResetPassPopup;
