import SettingsDrawer from '@/pages/settings/SettingsDrawer';
import { usePetStore } from '@/stores/petStore';
import { Box, CloseButton, Drawer, Flex, IconButton, Portal, Text } from '@chakra-ui/react';
import { MenuIcon } from 'lucide-react';

/**
 * アプリケーションのヘッダーコンポーネント
 * @returns ヘッダーUIコンポーネント
 * @description
 * - ユーザーとペットの名前を表示
 * - アカウントとメニューへのアクセスを提供
 * - ページ上部に固定表示
 * - 深い青色の背景と角丸デザインを採用
 */
const Header = () => {
  const petName = usePetStore(state => state.pet?.name) || 'ななし';

  return (
    <Box position="fixed" top={0} left={0} right={0} zIndex={1000}>
      {/* 背景 */}
      <Box
        position="absolute"
        top={0}
        left="0%"
        right="0%"
        height="100%"
        bg="primary.500"
        // boxShadow="0 2px 5px rgba(0,0,0,0.1)"
        zIndex={-1}
      />

      <Box py={2}>
        {/* ユーザー情報とボタン */}
        <Flex justify="space-between" align="center" w="100%" px={6}>
          {/* ユーザー情報 */}
          <Box bg="whiteAlpha.700" px={3} py={1} borderRadius="full">
            <Text color="text" fontWeight="bold">
              {petName}
            </Text>
          </Box>

          <Drawer.Root size="xs">
            <Drawer.Trigger asChild>
              <IconButton
                aria-label="settings"
                as={MenuIcon}
                variant="ghost"
                color="white"
                bg="transparent"
                _hover={{ bg: 'whiteAlpha.400' }}
                // onClick={() => navigate('/app/settings')}
              />
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content bg="tree.400">
                  <Drawer.Header>
                    <Drawer.Title>設定</Drawer.Title>
                  </Drawer.Header>
                  <Drawer.Body>
                    <SettingsDrawer />
                  </Drawer.Body>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="md" bg="transparent" />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </Flex>
      </Box>
    </Box>
  );
};

export default Header;
