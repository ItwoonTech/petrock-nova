'use client';

import { useAddSubtask } from '@/hooks/useDiaryTodoActions';
import { type Todo } from '@/types/todo.ts';
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import {
  Box,
  Button,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState } from 'react';

interface AddSubtaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
  onSuccess?: () => void; // サブタスク追加成功時のコールバック
}

/**
 * サブタスクを追加するモーダルコンポーネント
 * @param isOpen - モーダルの表示状態
 * @param onClose - モーダルを閉じる関数
 * @param todo - サブタスクを追加する親タスク
 */
const AddSubtaskModal = ({ isOpen, onClose, todo, onSuccess }: AddSubtaskModalProps) => {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const addSubtask = useAddSubtask();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!todo) return null;

  /**
   * サブタスクを追加する処理
   * テキストが空でない場合のみ実行し、入力フィールドをクリアしてモーダルを閉じる
   */
  const handleSubmit = async () => {
    if (text.trim()) {
      try {
        await addSubtask(todo.id, text.trim());
        setText('');
        setDescription('');
        onClose();
        // サブタスク追加成功時にコールバックを呼び出し
        onSuccess?.();
      } catch (error) {
        console.error('Failed to add subtask:', error);
      }
    }
  };

  /**
   * キーボードイベントのハンドラー
   * Enterキーが押された場合にサブタスクを追加
   * Shift + Enterの場合は改行として扱う
   * @param e - キーボードイベント
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /**
   * モーダルを閉じる際の処理
   * フォーカスを外してからモーダルを閉じる
   */
  const handleClose = () => {
    // フォーカスを外す
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setText('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          handleClose();
        }
      }}
    >
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
                    「{todo.text}」にサブタスクを追加
                  </Text>
                </Dialog.Title>

                <VStack gap={4} mt={4}>
                  <Input
                    placeholder="サブタスクを入力してね"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    fontFamily="'Noto Sans JP', sans-serif"
                  />

                  <Textarea
                    placeholder="説明（もしあれば書こう！）"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    fontFamily="'Noto Sans JP', sans-serif"
                    resize="vertical"
                    minH="80px"
                  />
                </VStack>

                <HStack justify="flex-end" mt={6}>
                  <Button
                    variant="ghost"
                    mr={2}
                    border="0.5px solid"
                    _hover={{ bg: 'hover' }}
                    borderColor="button_background"
                    onClick={handleClose}
                  >
                    キャンセル
                  </Button>
                  <Button
                    bg="secondary.500"
                    color="white"
                    _hover={{ bg: 'hover' }}
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                  >
                    追加
                  </Button>
                </HStack>
              </Box>
            </Dialog.Content>
          </Box>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AddSubtaskModal;
