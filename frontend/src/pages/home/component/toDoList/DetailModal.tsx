'use client';

import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { Box, Button, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddSubtaskModal from './AddSubtaskModal';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  completed: boolean;
  onComplete: () => void;
  showAddSubtaskButton?: boolean;
  onAddSubtask?: () => void;
  addSubtaskModalProps?: {
    todo: any;
    onSuccess?: () => void;
  };
}

/**
 * 汎用的な詳細モーダルコンポーネント
 * タスクやサブタスクの詳細表示、完了状態の切り替え機能を提供
 * @param isOpen - モーダルの表示状態
 * @param onClose - モーダルを閉じる関数
 * @param title - 表示するタイトル
 * @param description - 表示する説明
 * @param completed - 完了状態
 * @param onComplete - 完了状態を切り替える関数
 * @param showAddSubtaskButton - サブタスク追加ボタンを表示するかどうか
 * @param onAddSubtask - サブタスク追加ボタンがクリックされた時の処理
 * @param addSubtaskModalProps - サブタスク追加モーダルのプロパティ
 */
const DetailModal = ({
  isOpen,
  onClose,
  title,
  description,
  completed,
  onComplete,
  showAddSubtaskButton = false,
  onAddSubtask,
  addSubtaskModalProps,
}: DetailModalProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isAddSubtaskOpen, setIsAddSubtaskOpen] = useState(false);

  const handleAddSubtask = () => {
    if (onAddSubtask) {
      onAddSubtask();
    } else {
      setIsAddSubtaskOpen(true);
    }
  };

  const handleCloseAddSubtask = () => {
    setIsAddSubtaskOpen(false);
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
        <Portal>
          <Dialog.Backdrop asChild>
            <Box bg="blackAlpha.600" position="fixed" inset={0} zIndex={999} />
          </Dialog.Backdrop>

          <Dialog.Positioner asChild>
            <Box
              zIndex={1000}
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Dialog.Content asChild>
                <Box
                  bg="white"
                  p={isMobile ? 4 : 6}
                  borderRadius="xl"
                  boxShadow="xl"
                  w="95%"
                  maxW={isMobile ? 'sm' : 'md'}
                  mx="auto"
                >
                  <Dialog.Title asChild>
                    <Text fontSize="xl" fontFamily="'Noto Sans JP', sans-serif">
                      {title}
                    </Text>
                  </Dialog.Title>

                  <VStack gap={4} mt={4}>
                    <Text fontSize="md" color="gray.700" fontFamily="'Noto Sans JP', sans-serif">
                      {description ?? '説明はありません'}
                    </Text>
                  </VStack>

                  <VStack gap={4} mt={4}>
                    {completed ? (
                      <Button
                        variant="outline"
                        colorScheme="blue"
                        w="full"
                        bg="done"
                        onClick={onComplete}
                      >
                        できてない
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        colorScheme="orange"
                        w="full"
                        bg="yet"
                        onClick={onComplete}
                      >
                        できた
                      </Button>
                    )}

                    {showAddSubtaskButton && (
                      <Button
                        size="sm"
                        bg="secondary.500"
                        color="white"
                        _hover={{ bg: 'hover' }}
                        fontFamily="'Noto Sans JP', sans-serif"
                        onClick={handleAddSubtask}
                        w="full"
                      >
                        <Plus size={16} style={{ marginRight: '8px' }} />
                        サブタスクを追加
                      </Button>
                    )}
                  </VStack>

                  <Box mt={4} display="flex" justifyContent="center">
                    <Dialog.CloseTrigger asChild>
                      <Box
                        as="button"
                        mt={4}
                        color="blue.500"
                        fontWeight="semibold"
                        cursor="pointer"
                        _hover={{ textDecoration: 'underline' }}
                        onClick={onClose}
                      >
                        閉じる
                      </Box>
                    </Dialog.CloseTrigger>
                  </Box>
                </Box>
              </Dialog.Content>
            </Box>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* サブタスク追加モーダル */}
      {addSubtaskModalProps && (
        <AddSubtaskModal
          isOpen={isAddSubtaskOpen}
          onClose={handleCloseAddSubtask}
          todo={addSubtaskModalProps.todo}
          onSuccess={() => {
            addSubtaskModalProps.onSuccess?.();
            onClose();
          }}
        />
      )}
    </>
  );
};

export default DetailModal;
