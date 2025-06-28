import AIAvatar from '@/assets/images/A cute golden retriever.jpeg';
import SpeechBubble from '@/components/SpeechBubble';
import { Toaster, toaster } from '@/components/ui/toaster';
import { usePetStore } from '@/stores/petStore';
import { useImageGenPopupStore } from '@/stores/PopupStores/ImageGenPopupStores';
import { useUserStore } from '@/stores/userStore';
import { Box, Button, Center, HStack, Image, Input, Text, VStack } from '@chakra-ui/react';
import { CircleChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// アイコン画像の配列を定義（テスト用に同じ画像を使用）
const PET_ICONS = [AIAvatar, AIAvatar, AIAvatar, AIAvatar, AIAvatar, AIAvatar];

// ペットの種類は前に入力することになったので、このコンポーネントは不使用
const InputPetKind = () => {
  const { setPetCategory } = useUserStore();
  const { setContent } = useImageGenPopupStore();
  const [category, setCategory] = useState('');

  const handleMoveToChooseIcon = () => {
    if (!category) {
      toaster.create({
        title: '入力エラー',
        description: 'ペットの種類を入力してね',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    setPetCategory(category);
    setContent('chooseIcon');
  };

  return (
    <Box width="100%">
      <SpeechBubble>ペットの種類を入力してね！</SpeechBubble>
      <Box position="relative" mb={5} mt={6} display="flex" justifyContent="center" width="100%">
        <VStack>
          <Text fontSize="sm" color="text" mt={-5} mb={-1}>
            種類を省略せずに入力しよう
          </Text>
          <Input
            placeholder="ペットの種類名"
            value={category}
            onChange={e => setCategory(e.target.value)}
            bg="white"
            textAlign="center"
            fontSize="xl"
            borderRadius="2xl"
            height="50px"
            width="130%"
          />
          <Button
            rounded="full"
            bg="accent.500"
            color="text"
            fontSize="xl"
            w="100%"
            mt={5}
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            aria-label="OK"
            _hover={{
              transform: 'translateY(-1px)',
              transition: 'all 0.2s ease-in-out',
            }}
            onClick={handleMoveToChooseIcon}
          >
            OK
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

const ChooseIcon = () => {
  const navigate = useNavigate();
  const { updatePetImageName } = usePetStore();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const { closePopup } = useImageGenPopupStore();

  const handleIconSelect = (iconPath: string) => {
    setSelectedIcon(iconPath);
  };

  const handleSubmit = async () => {
    if (!selectedIcon) {
      toaster.create({
        title: '選択エラー',
        description: 'アイコンを選択してね',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      // ペットの画像名を更新（サーバーとの通信とストアの更新）
      await updatePetImageName(selectedIcon);

      closePopup();
      navigate('/signup/submitting');
    } catch (error) {
      toaster.create({
        title: '更新エラー',
        description: 'ペット画像の更新に失敗しました',
        type: 'error',
        duration: 3000,
      });
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
      <Box
        position="relative"
        width="100%"
        height="250px"
        // backgroundImage="url('/bubble2.svg')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        mb={4}
        mt={5}
        pt={16}
      >
        <SpeechBubble>
          一緒にペットを育てる
          <br />
          ともだちを選んでね！
        </SpeechBubble>
      </Box>
      <Box width="100%" mt={-20}>
        <VStack>
          <HStack gap={5}>
            {PET_ICONS.slice(0, 3).map((iconPath, index) => (
              <Box
                key={index}
                width="100px"
                height="100px"
                borderRadius="full"
                overflow="hidden"
                border={`4px solid ${selectedIcon === iconPath ? '#13C04F' : '#978264'}`}
                boxShadow="0 4px 6px rgba(48, 34, 157, 0.34)"
                cursor="pointer"
                onClick={() => handleIconSelect(iconPath)}
                transition="all 0.2s ease-in-out"
                _hover={{
                  transform: 'scale(1.05)',
                  borderColor: '#13C04F',
                }}
              >
                <Image
                  src={iconPath}
                  alt={`Pet Avatar ${index + 1}`}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              </Box>
            ))}
          </HStack>
          <HStack gap={5}>
            {PET_ICONS.slice(3, 6).map((iconPath, index) => (
              <Box
                key={index + 3}
                width="100px"
                height="100px"
                borderRadius="full"
                overflow="hidden"
                border={`4px solid ${selectedIcon === iconPath ? '#13C04F' : '#978264'}`}
                boxShadow="0 4px 6px rgba(48, 34, 157, 0.34)"
                cursor="pointer"
                onClick={() => handleIconSelect(iconPath)}
                transition="all 0.2s ease-in-out"
                _hover={{
                  transform: 'scale(1.05)',
                  borderColor: '#13C04F',
                }}
              >
                <Image
                  src={iconPath}
                  alt={`Pet Avatar ${index + 4}`}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              </Box>
            ))}
          </HStack>
        </VStack>
        <Center>
          <Button
            rounded="full"
            bg="accent.500"
            color="text"
            fontSize="xl"
            w="70%"
            mt={10}
            mb={5}
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            aria-label="OK"
            _hover={{
              transform: 'translateY(-1px)',
              transition: 'all 0.2s ease-in-out',
            }}
            onClick={handleSubmit}
          >
            OK
          </Button>
        </Center>
      </Box>
    </Box>
  );
};

const LoadingContent = () => {
  return (
    <Box width="100%">
      <SpeechBubble>読み込み中...</SpeechBubble>
      <Box position="relative" mb={5} mt={6} display="flex" justifyContent="center" width="100%">
        <VStack>
          <Text fontSize="sm" color="text" mt={-5} mb={-1}>
            少し待ってね...
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

const PhotoResultPopup = () => {
  const { content } = useImageGenPopupStore();

  const renderContent = () => {
    switch (content) {
      case 'inputName':
        return <InputPetKind />;
      case 'chooseIcon':
        return <ChooseIcon />;
      case 'loading':
        return <LoadingContent />;
      default:
        return <InputPetKind />;
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
        bg="tree.400"
        borderRadius="3xl"
        p={4}
        zIndex={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {renderContent()}
      </Box>
      <Toaster />
    </Box>
  );
};

export default PhotoResultPopup;
