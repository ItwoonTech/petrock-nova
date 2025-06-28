import { diaryApi } from '@/api/diaryApi';
import { s3Api } from '@/api/s3Api';
import { weatherApi } from '@/api/weatherApi';
import SpeechBubble from '@/components/SpeechBubble';
import { Toaster, toaster } from '@/components/ui/toaster';
import { CAMERA_DISPLAY_SIZE } from '@/constants/photosize';
import { useCamera } from '@/hooks/useCamera';
import { formatDateToYYYYMMDD } from '@/lib/dateUtils';
import DailyPhotoPopup from '@/pages/login/components/login/DailyPhotoPopup';
import { usePetStore } from '@/stores/petStore';
import { useDailyPhotoPopupStore } from '@/stores/PopupStores/DailyPhotoPopupStores';
import { Box, Button, Icon, IconButton, Text, VStack } from '@chakra-ui/react';
import { Camera, CameraIcon, CircleChevronLeft, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const LoginTakeDailyPhoto = () => {
  const { isOpen, openPopup, setCapturedImage, setContent } = useDailyPhotoPopupStore();
  const pet = usePetStore(state => state.pet);
  const [mode, setMode] = useState<string>('user');

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
    stopCamera(); // 一度停止
    await startCamera(newMode); // 新しいmodeで再起動
  }

  /**
   * @function handleDailyPhotoUpload
   * @description 毎日の写真撮影時の完全なフローを実行します
   * @param {string} capturedImage - キャプチャーした画像のBase64データ
   */
  const handleDailyPhotoUpload = async (capturedImage: string) => {
    if (!pet?.pet_id) {
      throw new Error('ペットIDが見つかりません');
    }

    try {
      setIsUploading(true);

      // [1] 画像ファイルuuidを生成
      const fileName = `${uuidv4()}.jpg`;

      // [2] POST /s3/presigned-url → 署名付きURL取得（アップロード用）
      const uploadPresignedUrl = await s3Api.getUploadPresignedUrl(pet.pet_id, fileName);

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

      // [5] POST /daily-record DBにキーを保存
      const weatherData = await weatherApi.fetchWeather();
      await diaryApi.createDailyRecord(pet.pet_id, formatDateToYYYYMMDD(new Date()), {
        picture_name: fileName,
        reacted: false,
        weather: weatherData?.weather || 'sunny',
        temperature: String(weatherData?.temperature ?? '??'),
        category: pet.category,
        birth_date: pet.birth_date,
      });

      console.log('デイリー写真撮影フローが完了しました');
      return capturedImage;
    } catch (error) {
      console.error('デイリー写真撮影フローでエラーが発生しました:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  {
    /* ペットの性別によって敬称を返す関数 */
  }
  const getHonorific = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'くん';
      case 'female':
        return 'ちゃん';
      default:
        return '';
    }
  };

  const capturePhoto = async () => {
    const capturedImage = await capturePhotoBase();

    if (!capturedImage) {
      return;
    }

    try {
      // 毎日の写真撮影フローを実行
      await handleDailyPhotoUpload(capturedImage);

      // キャプチャーした画像を保存
      setCapturedImage(capturedImage);
    } catch (error) {
      console.error('Error:', error);
      toaster.create({
        title: 'エラー',
        description: '写真の撮影に失敗しました',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    // カメラを停止
    stopCamera();
    // コンテンツを設定してからポップアップを表示
    setContent('checkPhoto');
    openPopup();
  };

  // カメラ処理開始
  const handleCameraClick = async () => {
    if (!isCameraActive) {
      await startCamera(mode);
    } else {
      await capturePhoto();
    }
  };

  return (
    <Box
      h="100vh"
      bgGradient="linear-gradient(to bottom, var(--chakra-colors-secondary-500), var(--chakra-colors-secondary-50))"
      overflow="hidden"
    >
      <Box
        position="relative"
        top={-1}
        left={0}
        right={0}
        backgroundImage="url('/forest_upper.svg')"
        backgroundRepeat="no-repeat"
        backgroundSize="100% auto"
        minHeight="1000px"
        backgroundPosition="top center"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          gap={10} // 吹き出しとカメラの間隔
          pt={10} // 上からの余白（必要に応じて調整）
        >
          <SpeechBubble>
            <Text>
              今日の{pet?.name || 'ペット'}
              {getHonorific(pet?.gender || '')}の
              <br />
              写真をとろう！
            </Text>
          </SpeechBubble>
          <Box
            position="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={-10}
          >
            <VStack>
              <Box position="relative">
                <Box w="170px" h="170px" borderRadius="full" bg="tree.500" position="relative" />
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
              </Box>
            </VStack>
          </Box>
          <Button
            position="fixed"
            bottom="20px"
            right="20px"
            rounded="full"
            bg={'orange.400'}
            color={'text'}
            w={150}
            zIndex={3}
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            aria-label="写真撮影をスキップ"
            size="xl"
            onClick={() => openPopup()}
            _hover={{
              transform: 'translateY(-1px)',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            スキップ
          </Button>
        </Box>
        {isCameraActive ? (
          <>
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

            {/* カメラ映像コンテナ */}
            <Box
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width="96%"
              height="600px"
              maxWidth="500px"
              bg="tree.400"
              borderRadius="xl"
              p={4}
              zIndex={1002}
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
                onClick={() => stopCamera()}
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
                width={CAMERA_DISPLAY_SIZE.WIDTH}
                height={CAMERA_DISPLAY_SIZE.HEIGHT}
                borderRadius="lg"
                overflow="hidden"
                mb={4}
                mt={10}
                position="relative"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: `${CAMERA_DISPLAY_SIZE.WIDTH}px`,
                    height: `${CAMERA_DISPLAY_SIZE.HEIGHT}px`,
                    objectFit: 'cover',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
                <Box
                  position="absolute"
                  top="20%"
                  left="20%"
                  width="60%"
                  height="60%"
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
                width="80%"
                onClick={handleCameraClick}
                loading={isCapturing || isUploading}
                loadingText={isCapturing ? '撮影中...' : 'アップロード中...'}
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
        <Toaster />
        {isOpen && <DailyPhotoPopup />}
      </Box>
    </Box>
  );
};

export default LoginTakeDailyPhoto;
