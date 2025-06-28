import { diaryApi } from '@/api/diaryApi';
import { s3Api } from '@/api/s3Api';
import { weatherApi } from '@/api/weatherApi';
import SpeechBubble from '@/components/SpeechBubble';
import { toaster } from '@/components/ui/toaster';
import { useCamera } from '@/hooks/useCamera';
import { formatDateToYYYYMMDD } from '@/lib/dateUtils';
import { usePetStore } from '@/stores/petStore';
import { useUserStore } from '@/stores/userStore';
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Progress,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Camera, CameraIcon, CircleChevronLeft, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const SignupTakePhoto = () => {
  const navigate = useNavigate();
  const petId = useUserStore(state => state.user?.pet_id);
  const pet = usePetStore(state => state.pet);
  const { createPet } = usePetStore();
  const setPetImageName = useUserStore(state => state.setPetImageName);
  const [mode, setMode] = useState<string>('environment');
  const [isPopup, setIsPopup] = useState(false);
  const {
    isCameraActive,
    isCapturing,
    isUploading,
    setIsUploading,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto: capturePhotoBase,
  } = useCamera();

  // 外カメラ・内カメラのモードを変更
  const handleChangeMode = async () => {
    const newMode = mode === 'user' ? 'environment' : 'user';
    setMode(newMode);
    stopCamera();
    await startCamera(newMode);
    console.log(newMode);
  };

  const handleInitialPhotoUpload = async (capturedImage: string) => {
    try {
      setIsUploading(true);

      // [1] 画像ファイルuuidを生成
      const fileName = `${uuidv4()}.jpg`;
      console.log('生成されたファイル名:', fileName);

      console.log('ペット情報:', petId);

      // [2] POST /s3/presigned-url → 署名付きURL取得（アップロード用）
      if (!petId) {
        throw new Error('ペットIDが取得できませんでした');
      }
      const uploadPresignedUrl = await s3Api.getUploadPresignedUrl(petId, fileName);
      console.log('取得した署名付きURL:', uploadPresignedUrl);

      // [3] Base64 から Blob変換
      const base64Data = capturedImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: 'image/jpeg' });

      // [4] fetch(PUT)でS3アップロード
      await s3Api.uploadFileToS3(uploadPresignedUrl, blob, 'image/jpeg');
      console.log('画像がS3にアップロードされました:', uploadPresignedUrl);

      // [5] POST /daily-record DBにキーを保存
      const weatherData = await weatherApi.fetchWeather();
      if (!pet) {
        throw new Error('ペット情報が取得できませんでした');
      }
      await diaryApi.createDailyRecord(petId, formatDateToYYYYMMDD(new Date()), {
        picture_name: fileName,
        reacted: false,
        weather: weatherData?.weather || 'sunny',
        temperature: String(weatherData?.temperature ?? '??'),
        category: pet.category,
        birth_date: pet.birth_date,
      });
      console.log('デイリーレコードが作成されました');

      // [6] POST pets/ pet_idをする（バック側でアバターの写真を格納する処理が入る）
      console.log(pet);

      await createPet(petId, {
        name: pet.name,
        category: pet.category,
        birth_date: pet.birth_date,
        gender: pet.gender,
        picture_name: fileName,
      });

      console.log('初回写真撮影フローが完了しました');
      return capturedImage;
    } catch (error) {
      console.error('初回写真撮影フローでエラーが発生しました:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const capturePhoto = async () => {
    const capturedImage = await capturePhotoBase();

    if (!capturedImage) {
      return;
    }

    try {
      // 初回写真撮影フローを実行
      await handleInitialPhotoUpload(capturedImage);

      // キャプチャーした画像を初日のデイリー写真として登録
      setPetImageName(capturedImage);

      // 写真撮影結果画面に遷移
      navigate('/signup/photo-result');
    } catch (error) {
      toaster.create({
        title: 'エラー',
        description: '写真のアップロードに失敗しました',
        type: 'error',
        duration: 3000,
      });
      return;
    }
    stopCamera();
    setIsPopup(false);
  };

  // カメラ処理開始
  const handleCameraClick = async () => {
    if (!isCameraActive) {
      await startCamera(mode);
      setIsPopup(true);
    } else {
      await capturePhoto();
    }
  };

  return (
    <Box width="85%">
      <Box position="fixed" top={5} left={0} right={0} zIndex={2} p={4}>
        <Progress.Root value={70} maxW="sm" size="lg" mx="auto">
          <HStack gap="2">
            <Progress.Track flex="1" bg="#ffffff" borderRadius="full">
              <Progress.Range bg="orange.500" borderRadius="full" />
            </Progress.Track>
          </HStack>
        </Progress.Root>
      </Box>
      <Box position="relative" top={0} left={0} mb={16}>
        <Button
          variant="ghost"
          onClick={() => navigate('/signup/input-pet-info')}
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
      <Box
        position="relative"
        width="100%"
        height="226px"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        mb={4}
      >
        <SpeechBubble>
          一緒にはじめるともだちをつくろう！
          <br />
          あなたのペットの写真を撮ってね！
        </SpeechBubble>
      </Box>
      <Box position="relative" display="flex" justifyContent="center" alignItems="center" mt={-10}>
        <VStack>
          <Box position="relative">
            <Box
              w="170px"
              h="170px"
              borderRadius="full"
              bg="tree.500"
              position="relative"
              boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            />
            <Icon
              boxSize={100}
              color="white"
              position="absolute"
              top="43%"
              left="50%"
              transform="translate(-50%, -50%)"
              onClick={handleCameraClick}
              cursor="pointer"
            >
              <Camera />
            </Icon>
            <Text
              position="absolute"
              top="77%"
              left="50%"
              transform="translate(-50%, -50%)"
              color="white"
              fontSize="2xl"
              fontWeight="bold"
              onClick={handleCameraClick}
              cursor="pointer"
            >
              タップ
            </Text>
            {isPopup ? (
              <>
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

                {/* カメラ映像コンテナ */}
                <Box
                  position="fixed"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  width="96%"
                  maxWidth="500px"
                  bg="tree.400"
                  borderRadius="xl"
                  p={4}
                  zIndex={3}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    position="fixed"
                    top={5}
                    left={5}
                    variant="ghost"
                    onClick={() => {
                      stopCamera();
                      setIsPopup(false);
                    }}
                    size="xs"
                    bg="tree.500"
                    color="white"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                    aria-label="カメラを閉じる"
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
                    height="226px"
                    backgroundSize="contain"
                    backgroundRepeat="no-repeat"
                    backgroundPosition="center"
                    mb={-10}
                    mt={5}
                    pt={14} // 上からの余白（必要に応じて調整）
                  >
                    <SpeechBubble>
                      枠の中にペットを
                      <br />
                      「ハッキリ」写してね！
                    </SpeechBubble>
                  </Box>
                  <Box
                    width="100%"
                    height="100%"
                    borderRadius="lg"
                    overflow="hidden"
                    mb={4}
                    mt={-2}
                    position="relative"
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      style={{
                        width: '100%',
                        height: '400px', // デモするために設定しただけ、パーセンテージ指定したい
                        objectFit: 'cover',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    />
                    <Box
                      position="absolute"
                      top="30%"
                      left="30%"
                      width="40%"
                      height="40%"
                      border="2px dashed white"
                      borderRadius="md"
                      zIndex={10}
                      pointerEvents="none"
                    />
                    <IconButton
                      position="absolute"
                      top="2%"
                      right="5%"
                      rounded="full"
                      size="lg"
                      color="white"
                      variant="ghost"
                      bg="tree.500"
                      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                      onClick={handleChangeMode}
                      aria-label="カメラモード変更"
                      zIndex={10}
                    >
                      <RefreshCcw style={{ width: '70%', height: '70%' }} />
                    </IconButton>
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                  </Box>
                  <Button
                    width="60%"
                    onClick={handleCameraClick}
                    loading={isCapturing || isUploading}
                    spinner={<Spinner size="lg" color="text" animationDuration={'0.8s'} />}
                    color="text"
                    fontSize="2xl"
                    bg="accent.500"
                    size="xl"
                    borderRadius="full"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                    _hover={{
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <CameraIcon />
                    写真をとる
                  </Button>
                </Box>
              </>
            ) : (
              <></>
            )}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default SignupTakePhoto;
