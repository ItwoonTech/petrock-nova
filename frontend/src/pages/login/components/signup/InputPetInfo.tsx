import Board from '@/components/Board';
import SpeechBubble from '@/components/SpeechBubble';
import { Calendar } from '@/components/ui/calendar';
import { toaster } from '@/components/ui/toaster';
import { usePetStore } from '@/stores/petStore';
import { useUserStore } from '@/stores/userStore';
import type { CreatePet } from '@/types/pet';
import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  Progress,
  SegmentGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { CircleChevronLeft, Mars, Venus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterInputPetInfo = () => {
  const navigate = useNavigate();
  const [petName, setPetName] = useState('');
  const [gender, setGender] = useState<string>('male');
  const [petCategory, setPetCategory] = useState('');
  const [birthday, setBirthday] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);

  const { setPetBasicInfo, setPetId } = usePetStore();
  const { user, createUser } = useUserStore();

  // バリデーションチェックしてデータ（ユーザ情報：ユーザ名，PIN，子供のニックネーム・ペット情報）を送信画面に送る関数
  const handleSubmit = async () => {
    setIsLoading(true);
    // バリデーション
    if (!petName || !birthday || !petCategory) {
      toaster.create({
        title: '入力エラー',
        description: 'すべての項目を入力してね',
        type: 'error',
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    // 文字数制限チェック
    if (petName.length > 10) {
      toaster.create({
        title: 'なまえの文字数が多すぎるよ',
        description: 'ペットのなまえは10文字以内で入力してね',
        type: 'error',
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
      // CreatePet型のデータを作成
      const petData: CreatePet = {
        name: petName,
        birth_date: birthday ? format(birthday, 'yyyy-MM-dd') : '',
        gender: gender as 'male' | 'female' | 'none',
        category: petCategory || '不明', // デフォルト値を設定
        picture_name: '',
      };

      // ストアにセット（TakePhotoにてペット情報を送信する）
      setPetBasicInfo(petData);

      // ユーザー情報が存在する場合のみcreateUserを実行
      if (user?.user_id && user?.user_name && user?.user_role) {
        await createUser(user.user_id, {
          user_name: user.user_name,
          user_role: user.user_role,
          password: user.password,
        });
        // DBから受け取ったpet_idをストアにセット
        setPetId(user.pet_id);
      }

      navigate('/signup/take-photo');
    } catch (error) {
      console.error('ペット作成に失敗しました:', error);
      toaster.create({
        title: 'エラー',
        description: 'ペット情報の登録に失敗しました。もう一度お試しください。',
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box width="85%" mt={0} mb={36} position="fixed" zIndex={1}>
      <Box top={0} left={0} right={0} zIndex={100} p={4}>
        <Progress.Root value={50} maxW="sm" size="lg" mx="auto">
          <HStack gap="2">
            <Progress.Track flex="1" bg="#ffffff" borderRadius="full">
              <Progress.Range bg="orange.500" borderRadius="full" />
            </Progress.Track>
          </HStack>
        </Progress.Root>
      </Box>
      <Box mb={-8}>
        <Box top={40} left={0} zIndex={-1} mt={10} mb={16}>
          <Button
            variant="ghost"
            onClick={() =>
              user?.user_role === 'child'
                ? navigate('/signup/input-child-name')
                : navigate('/signup/input-user-name')
            }
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
          あなたのペットのことを
          <br />
          教えてね！
        </SpeechBubble>
      </Box>

      <Box width="115%" position="relative" left="50%" transform="translateX(-50%)" mb={-120}>
        <Board>
          <VStack gap={4} width="100%" mt="5%">
            <HStack gap={2} width="100%">
              <Text
                width="30%"
                pl={4}
                fontSize="xl"
                fontWeight="bold"
                borderBottom="1px solid #978264"
              >
                なまえ
              </Text>
              <Box position="relative">
                <Input
                  value={petName}
                  onChange={e => setPetName(e.target.value)}
                  placeholder="ペットのなまえ"
                  width="110%"
                  bg="#F2ECE3"
                  textAlign="center"
                  borderRadius="2xl"
                />
                <Text position="absolute" top="50%" right="-25%" fontSize="xs" color="gray.500">
                  {petName.length}/10
                </Text>
              </Box>
            </HStack>
            <HStack gap={2} width="100%">
              <Text
                width="30%"
                pl={4}
                fontSize="xl"
                fontWeight="bold"
                borderBottom="1px solid #978264"
              >
                種類
              </Text>
              <Box position="relative">
                <Input
                  value={petCategory}
                  onChange={e => setPetCategory(e.target.value)}
                  placeholder="ex.) ゴールデンレトリバー"
                  width="110%"
                  bg="#F2ECE3"
                  textAlign="center"
                  borderRadius="2xl"
                />
              </Box>
            </HStack>
            <HStack gap={2} width="100%">
              <Text
                width="30%"
                pl={4}
                fontSize="xl"
                fontWeight="bold"
                borderBottom="1px solid #978264"
              >
                性別
              </Text>
              <SegmentGroup.Root
                width="70%"
                defaultValue="male"
                value={gender}
                onValueChange={details => {
                  if (details.value) {
                    setGender(details.value);
                  }
                }}
              >
                <SegmentGroup.Indicator />
                <SegmentGroup.Items
                  items={[
                    {
                      value: 'male',
                      label: (
                        <HStack>
                          <Mars />
                          オス
                        </HStack>
                      ),
                    },
                    {
                      value: 'female',
                      label: (
                        <HStack>
                          <Venus />
                          メス
                        </HStack>
                      ),
                    },
                    {
                      value: 'none',
                      label: <HStack>なし</HStack>,
                    },
                  ]}
                />
              </SegmentGroup.Root>
            </HStack>
            <HStack width="100%" gap={4}>
              <HStack width="100%" gap={2}>
                <Text
                  width="30%"
                  pl={4}
                  fontSize="xl"
                  fontWeight="bold"
                  borderBottom="1px solid #978264"
                >
                  誕生日
                </Text>
                <Box position="relative">
                  <Calendar date={birthday} onSelect={setBirthday} />
                </Box>
              </HStack>
            </HStack>
          </VStack>
        </Board>
      </Box>
      <Center mb={-50} position={'relative'} zIndex={10} top={5}>
        <Button
          size="lg"
          fontSize="xl"
          rounded="full"
          bg={'accent.500'}
          color={'text'}
          w={150}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          aria-label="入力完了"
          _hover={{
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={handleSubmit}
          disabled={!petName || !birthday || !petCategory || isLoading}
          loading={isLoading}
          loadingText="送信中..."
        >
          入力完了
        </Button>
      </Center>
    </Box>
  );
};

export default RegisterInputPetInfo;
