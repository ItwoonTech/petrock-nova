import AIAvatar from '@/assets/images/A cute golden retriever.jpeg';
import SpeechBubble from '@/components/SpeechBubble';
import { usePetStore } from '@/stores/petStore';
import { useImageGenPopupStore } from '@/stores/PopupStores/ImageGenPopupStores';
import { Box, Button, HStack, Image, Progress, VStack } from '@chakra-ui/react';
import { Camera, SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoResultPopup from './PhotoResultPopup';

const SignupPhotoResult = () => {
  const navigate = useNavigate();
  const pet = usePetStore(state => state.pet);
  const { getPetImageUrl } = usePetStore();
  const { isOpen, openPopup } = useImageGenPopupStore();
  const [petImageUrl, setPetImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPetImage = async () => {
      if (pet?.image_name) {
        try {
          setIsLoading(true);
          const url = await getPetImageUrl();
          setPetImageUrl(url);
        } catch (error) {
          console.error('ペット画像の読み込みに失敗しました:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadPetImage();
  }, [pet?.image_name, getPetImageUrl]);

  const handleOpenPopup = () => {
    openPopup();
  };

  return (
    <Box width="85%" mt={150} mb={250}>
      <Box position="fixed" top={5} left={0} right={0} zIndex={2} p={4}>
        <Progress.Root value={90} maxW="sm" size="lg" mx="auto">
          <HStack gap="2">
            <Progress.Track flex="1" bg="#ffffff" borderRadius="full">
              <Progress.Range bg="orange.500" borderRadius="full" />
            </Progress.Track>
          </HStack>
        </Progress.Root>
      </Box>
      <Box mt={16}>
        <SpeechBubble>
          あなたのともだちは
          <br />
          この子かな？
        </SpeechBubble>
      </Box>
      <Box
        position="relative"
        width="100%"
        height="350px"
        backgroundImage="url('/mini_signBoard.svg')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        mt={-16}
      >
        <VStack
          gap={0.5}
          position="absolute"
          top="48%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          {/* BedLockで生成したペットアイコンを表示 */}
          <Box
            width="200px"
            height="200px"
            borderRadius="full"
            overflow="hidden"
            border="4px solid var(--chakra-colors-accent-500)"
            boxShadow="0 4px 6px rgba(48, 34, 157, 0.34)"
            mt={4}
          >
            <Image
              src={isLoading ? AIAvatar : petImageUrl || AIAvatar}
              alt="Pet Avatar"
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
          {/* ペットの種類を表示 */}
          {/* <Box textAlign="center" bg="#F2ECE3" width="270px" height="45px" borderRadius={'xl'}>
            <Text fontSize="3xl" fontWeight="bold" textAlign="center">
              {pet?.category}
            </Text>
          </Box> */}
        </VStack>
      </Box>
      <VStack gap={5} mt={-10}>
        <Button
          size="xl"
          fontSize="xl"
          rounded="full"
          bg={'tree.500'}
          color={'white'}
          w={300}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          aria-label="決定"
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={() => navigate('/signup/submitting')}
        >
          決定
        </Button>
        <Button
          size="xl"
          fontSize="xl"
          rounded="full"
          bg={'accent.500'}
          color={'text'}
          w={300}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          aria-label="もう一度写真を撮る"
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={() => navigate('/signup/take-photo')}
        >
          <Camera />
          もう一度写真を撮る
        </Button>
        <Button
          size="xl"
          fontSize="xl"
          rounded="full"
          bg={'accent.500'}
          color={'text'}
          w={300}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          aria-label="友達を選ぶ"
          onClick={handleOpenPopup}
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <SquarePen />
          ともだちを選ぶ
        </Button>
      </VStack>
      {isOpen ? <PhotoResultPopup /> : null}
    </Box>
  );
};

export default SignupPhotoResult;
