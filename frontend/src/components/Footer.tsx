import { useUserStore } from '@/stores/userStore';
import { Box, Flex, IconButton, Text, VStack } from '@chakra-ui/react';
import { CalendarDays, House, MessagesSquare, Store } from 'lucide-react';
import { FcCalendar, FcFaq, FcHome, FcShop } from 'react-icons/fc';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * アプリケーションのフッターコンポーネント
 * @returns ナビゲーション機能を持つフッターUIコンポーネント
 * @description
 * - カレンダー、ホーム、チャットへのナビゲーションを提供
 * - 現在のページに応じてアクティブなアイコンを強調表示
 * - 固定位置に表示され、角丸の背景デザインを採用
 */
const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();

  return (
    <Box position="fixed" bg="transparent" bottom={0} left={0} right={0} zIndex={1000}>
      {/* 角丸の背景 */}
      <Box
        position="absolute"
        bottom="10px"
        left="5%"
        right="5%"
        height="70px"
        bg="tree.500"
        borderRadius="full"
        boxShadow="md"
        zIndex={-1}
      />

      {/* フッターのメインコンテンツ */}
      <Box py={2} position="relative">
        <Flex maxW="500px" mx="auto" justify="space-around" align="center" px={4}>
          {/* カレンダーボタン */}
          <VStack gap={1}>
            <IconButton
              aria-label="calendar"
              as={location.pathname === '/app/calendar' ? FcCalendar : CalendarDays}
              variant="ghost"
              color="accent.500"
              _hover={{ bg: 'hover' }}
              onClick={() => navigate('/app/calendar')}
              size="lg"
            />
            <Text
              color={location.pathname === '/app/calendar' ? 'secondary.200' : 'accent.500'}
              fontSize="xs"
              fontWeight="bold"
            >
              カレンダー
            </Text>
          </VStack>

          {/* ホームボタン */}
          <VStack gap={1}>
            <IconButton
              aria-label="home"
              as={location.pathname === '/app' ? FcHome : House}
              variant="ghost"
              color="accent.500"
              _hover={{ bg: 'hover' }}
              onClick={() => navigate('/app')}
              size="lg"
            />
            <Text
              color={location.pathname === '/app' ? 'secondary.200' : 'accent.500'}
              fontSize="xs"
              fontWeight="bold"
            >
              ホーム
            </Text>
          </VStack>

          {/* チャットボタン */}
          <VStack gap={1}>
            <IconButton
              aria-label="chat"
              as={location.pathname === '/app/chat' ? FcFaq : MessagesSquare}
              variant="ghost"
              color="accent.500"
              _hover={{ bg: 'hover' }}
              onClick={() => navigate('/app/chat')}
              size="lg"
            />
            <Text
              color={location.pathname === '/app/chat' ? 'secondary.200' : 'accent.500'}
              fontSize="xs"
              fontWeight="bold"
            >
              チャット
            </Text>
          </VStack>
          {user?.user_role === 'general' && (
            <VStack gap={1}>
              <IconButton
                aria-label="recommend"
                as={location.pathname === '/app/recommend' ? FcShop : Store}
                variant="ghost"
                color="accent.500"
                _hover={{ bg: 'hover' }}
                onClick={() => navigate('/app/recommend')}
                size="lg"
              />
              <Text
                color={location.pathname === '/app/recommend' ? 'secondary.200' : 'accent.500'}
                fontSize="xs"
                fontWeight="bold"
              >
                リコメンド
              </Text>
            </VStack>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default Footer;
