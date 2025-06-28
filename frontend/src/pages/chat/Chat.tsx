import noImage from '@/assets/images/no-image.png';
import LineBreakText from '@/components/LineBreakText';
import { toaster } from '@/components/ui/toaster';
import { useChatStore } from '@/stores/chatStore';
import { useDiaryStore } from '@/stores/diaryStore';
import { usePetStore } from '@/stores/petStore';
import {
  Box,
  Center,
  Flex,
  IconButton,
  Image,
  Spinner,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { format, isSameDay } from 'date-fns';
import { CirclePlus, Mic, Send } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage, fetchChatHistory } = useChatStore();
  const pet = usePetStore(state => state.pet);
  const fetchPet = usePetStore(state => state.fetchPet);
  const getPetImageUrl = usePetStore(state => state.getPetImageUrl);
  const [petImageUrl, setPetImageUrl] = useState<string | null>(null);
  const isLoadingDiary = useDiaryStore(state => state.isLoading);

  const userBubbleColor = 'accent.500';
  const aiBubbleColor = 'white';

  const inputRows = useMemo(() => {
    const newlines = (inputText.match(/\n/g) || []).length;
    return Math.min(Math.max(1, newlines + 1), 4); // 1-4行の間
  }, [inputText]);

  useEffect(() => {
    if (pet?.pet_id) {
      fetchPet(pet.pet_id);
      fetchChatHistory(pet.pet_id);
    }
  }, [pet?.pet_id, fetchChatHistory, fetchPet]);

  useEffect(() => {
    const fetchImage = async () => {
      if (pet?.image_name) {
        const url = await getPetImageUrl();
        setPetImageUrl(url);
      } else {
        setPetImageUrl(null);
      }
    };
    fetchImage();
  }, [pet?.image_name, getPetImageUrl]);

  const isInitialLoad = useRef(true);
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      if (isInitialLoad.current) {
        scrollToBottom(false); // 初回は即ジャンプ
        isInitialLoad.current = false;
      } else {
        scrollToBottom(true); // 2回目以降はスムーズ
      }
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      console.error(error);
      toaster.create({
        description: error,
        type: 'error',
        closable: true,
      });
    }
  }, [error]);

  const handleSend = async () => {
    if (!inputText.trim() || !pet) return;
    await sendMessage(inputText.trim(), pet);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault(); // デフォルトの改行を防ぐ
      handleSend();
    }
    // Shift+Enterの場合は何もしない（デフォルトの改行が実行される）
  };

  return (
    <Box
      h="100vh"
      pt="60px"
      pb="80px"
      overflowX="hidden"
      w="100vw"
      position="fixed"
      left="0"
      top="0"
      bgGradient="linear-gradient(to bottom, var(--chakra-colors-secondary-500), var(--chakra-colors-secondary-50))"
    >
      {isLoadingDiary && (
        <Center
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          zIndex={9999}
          bg="rgba(255,255,255,0.5)"
        >
          <Spinner size="xl" color="teal.500" />
        </Center>
      )}
      <Box
        position="absolute"
        top="-5%"
        left="0"
        right="0"
        height="300px"
        backgroundImage="url('/forest_upper.svg')"
        backgroundRepeat="no-repeat"
        backgroundSize="100% auto"
        backgroundPosition="top center"
        zIndex={-1}
      />
      <Box
        position="absolute"
        bottom="0%"
        left="0"
        right="0"
        height="250px"
        backgroundImage="url('/forest_bottom.svg')"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="top center"
        zIndex={-1}
      />
      <Box w="100%" mx="auto" h="full">
        <Box h="full" overflow="hidden" display="flex" flexDirection="column">
          {/* メッセージエリア */}
          <VStack flex="1" overflowY="auto" p={4} alignItems="stretch" gap={4}>
            {messages.map((msg, index) => {
              const prevMsg = messages[index - 1];
              const showDateLabel =
                !prevMsg || !isSameDay(new Date(prevMsg.created_at), new Date(msg.created_at));
              return (
                <React.Fragment key={index}>
                  {showDateLabel && (
                    <Box w="100%" textAlign="center" my={2}>
                      <Text fontSize="sm" color="white" fontWeight="bold">
                        {format(new Date(msg.created_at), 'M月d日')}
                      </Text>
                    </Box>
                  )}
                  <Flex
                    justify={msg.sender === 'ai' ? 'flex-start' : 'flex-end'}
                    alignItems="flex-end"
                    w="100%"
                  >
                    {msg.sender === 'ai' && (
                      <>
                        <Image
                          src={petImageUrl || noImage}
                          alt="AI Avatar"
                          boxSize="50px"
                          borderRadius="full"
                          objectFit="cover"
                          alignSelf="flex-start"
                          mt={3}
                        />
                        <Box w={4} />
                      </>
                    )}

                    {msg.sender !== 'ai' && (
                      <Text fontSize="xs" color="gray.500" mr={1}>
                        {format(new Date(msg.created_at), 'HH:mm')}
                      </Text>
                    )}

                    <Box
                      maxW="70%"
                      p={3}
                      borderRadius="lg"
                      bg={msg.sender === 'ai' ? aiBubbleColor : userBubbleColor}
                      color={msg.sender === 'ai' ? 'text' : 'text'}
                      position="relative"
                      boxShadow="lg"
                      _after={{
                        content: '""',
                        position: 'absolute',
                        top: '30px',
                        ...(msg.sender === 'ai'
                          ? {
                              left: '-10px',
                              borderTop: '5px solid transparent',
                              borderBottom: '5px solid transparent',
                              color: aiBubbleColor,
                              borderRight: `10px solid`,
                            }
                          : {
                              right: '-10px',
                              borderTop: '5px solid transparent',
                              borderBottom: '5px solid transparent',
                              color: userBubbleColor,
                              borderLeft: `10px solid`,
                            }),
                      }}
                    >
                      <LineBreakText text={msg.content} fontSize="md" textAlign="justify" />
                    </Box>

                    {msg.sender === 'ai' && (
                      <Text fontSize="xs" color="gray.500" ml={1}>
                        {format(new Date(msg.created_at), 'HH:mm')}
                      </Text>
                    )}
                  </Flex>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </VStack>

          {/* 入力エリア */}
          <Box p={4} bg="primary.400" w="100%" borderBottom="3px solid" borderColor="accent.500">
            <Flex gap={2} align="center">
              <IconButton
                as={CirclePlus}
                aria-label="Add attachment"
                bg="transparent"
                color="button"
                strokeWidth="1.5"
                disabled={isLoading}
                _hover={{ bg: 'primary.600' }}
                _active={{ bg: 'primary.700' }}
              />
              <Textarea
                flex="1"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Aa"
                bg="accent.500"
                color="text"
                borderRadius="xl"
                fill="accent.500"
                borderColor="button"
                strokeWidth="1"
                disabled={isLoading}
                boxShadow={'inner'}
                rows={inputRows}
                resize="none"
              />
              {inputText.trim() ? (
                <IconButton
                  as={Send}
                  aria-label="Send message"
                  bg="transparent"
                  onClick={handleSend}
                  loading={isLoading}
                  fill="accent.500"
                  color="button"
                  strokeWidth="1"
                  _hover={{ bg: 'primary.600' }}
                  _active={{ bg: 'primary.700' }}
                />
              ) : (
                <IconButton
                  as={Mic}
                  aria-label="Voice input"
                  bg="transparent"
                  color="button"
                  strokeWidth="1.5"
                  onClick={() => console.log('Voice input clicked')}
                  disabled={isLoading}
                  _hover={{ bg: 'primary.600' }}
                  _active={{ bg: 'primary.700' }}
                />
              )}
            </Flex>
          </Box>
        </Box>
      </Box>
      {error &&
        toaster.create({
          description: 'サーバーエラーが発生しました。しばらくしてから再度お試しください。',
          type: 'error',
          closable: true,
        })}
    </Box>
  );
};

export default Chat;
