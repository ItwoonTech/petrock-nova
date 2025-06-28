'use client';

import { formatDateToYYYYMMDD } from '@/lib/dateUtils';
import { mapDiaryToTodoList } from '@/lib/mappers/diaryToTodo';
import { useDiaryStore } from '@/stores/diaryStore.ts';
import type { Todo } from '@/types/todo.ts';
import { Box, Button, Container, Icon, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { Ellipsis, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AddTodoModal from './AddTodoModal.tsx';
import { TodoDetailModal } from './TodoDetailModal';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const diary = useDiaryStore(state => state.diary);
  const deleteTodo = useDiaryStore(state => state.deleteTodoFromDiary);

  // 本日の日付かどうかをチェック
  const isTodayDiary = diary && diary.date === formatDateToYYYYMMDD(new Date());

  useEffect(() => {
    if (diary && isTodayDiary) {
      const todos = mapDiaryToTodoList(diary);
      setTodoList(todos);
    } else {
      setTodoList([]);
    }
  }, [diary, isTodayDiary]);

  // メニューの外側クリックで削除ボタンを閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDetailOpen(true);
  };

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedTodo(null);
  };

  // 項目の選択状態（チェック）を オン・オフ切り替える関数
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  // 選択されている項目を一括削除する関数
  const handleDeleteSelected = async () => {
    try {
      // 選択された項目を削除
      for (const itemId of selectedItems) {
        await deleteTodo(itemId);
      }

      // ローカル状態を更新
      const newTodoList = todoList.filter(todo => !selectedItems.includes(todo.id));
      setTodoList(newTodoList);
      setSelectedItems([]);
      setIsDeleting(false);
    } catch (error) {
      console.error('削除エラー:', error);
    }
  };

  return (
    <Box p={4} borderRadius="lg" width="100%">
      <Container maxW="md" centerContent>
        <Box
          bg="white"
          p={4}
          borderRadius="lg"
          w="full"
          maxW="450px"
          position="relative"
          boxShadow="0 10px 30px rgba(0,0,0,0.1)"
        >
          <Box
            position="absolute"
            top="10px"
            left="0"
            right="0"
            display="flex"
            justifyContent="space-around"
          >
            {[...Array(8)].map((_, i) => (
              <Box
                key={i}
                w="12px"
                h="12px"
                bg="secondary.500"
                borderRadius="50%"
                boxShadow="inset 0 0 2px rgba(0,0,0,0.5)"
              />
            ))}
          </Box>

          {/* ヘッダー部分 - タイトルとメニューボタン */}
          <Box position="relative" mb={4} pt={8}>
            <Text
              fontWeight="bold"
              mb={2}
              fontSize="2xl"
              fontFamily="'Noto Sans JP', sans-serif"
              textAlign="center"
            >
              やること
            </Text>
            {/* 右上のメニューボタン */}
            <Box position="absolute" right={0} top="50%" transform="translateY(-50%)" zIndex={10}>
              <Box position="relative">
                <Button
                  ref={buttonRef}
                  size="lg"
                  variant="ghost"
                  color="gray.600"
                  bg="rgba(0,0,0,0.05)"
                  _hover={{ bg: 'rgba(0,0,0,0.1)' }}
                  p={2}
                  minW="auto"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  position="relative"
                  zIndex={10}
                  borderRadius="full"
                >
                  <Icon as={Ellipsis} boxSize={6} />
                </Button>
                {isMenuOpen && (
                  <Box
                    ref={menuRef}
                    position="absolute"
                    top="100%"
                    right={0}
                    mt={1}
                    bg="white"
                    borderRadius="md"
                    boxShadow="lg"
                    minW="120px"
                    zIndex={11}
                  >
                    <Button
                      variant="ghost"
                      width="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                      onClick={() => {
                        setIsDeleting(!isDeleting);
                        setSelectedItems([]);
                        setIsMenuOpen(false);
                      }}
                      color="red.500"
                      px={3}
                      py={2}
                      _hover={{ bg: 'red.50' }}
                    >
                      <Icon as={Trash2} mr={2} />
                      削除
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <VStack gap={3} w="full">
            {isTodayDiary ? (
              todoList.map(todo => (
                <Box key={todo.id} position="relative" width="100%">
                  {/* 削除モード時のチェックボックス */}
                  {isDeleting && (
                    <Box
                      position="absolute"
                      left="-10px"
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={5}
                    >
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => toggleItemSelection(todo.id)}
                        bg={selectedItems.includes(todo.id) ? 'red.100' : 'gray.100'}
                        borderColor={selectedItems.includes(todo.id) ? 'red.500' : 'gray.300'}
                        _hover={{
                          bg: selectedItems.includes(todo.id) ? 'red.200' : 'gray.100',
                        }}
                        p={1}
                        minW="20px"
                        h="20px"
                      >
                        {selectedItems.includes(todo.id) ? '✓' : ''}
                      </Button>
                    </Box>
                  )}
                  <TodoItem todo={todo} onItemClick={handleTodoClick} readOnly={isDeleting} />
                </Box>
              ))
            ) : (
              <Text textAlign="center" fontSize="md" color="gray.500" py={4}>
                何もありません
              </Text>
            )}
          </VStack>

          {/* 削除ボタン（削除モードで項目選択時のみ表示） */}
          {isDeleting && selectedItems.length > 0 && (
            <Box textAlign="center" mt={3}>
              <Button
                mt={4}
                color="red.500"
                bg="white"
                size="sm"
                onClick={handleDeleteSelected}
                fontWeight="bold"
              >
                選択した項目を削除
              </Button>
            </Box>
          )}

          {/* 追加ボタン（通常モード時のみ表示） */}
          {isTodayDiary && !isDeleting && (
            <Box textAlign="center">
              <Button
                mt={2}
                mb={2}
                bg="secondary.500"
                color="white"
                _hover={{ bg: 'hover' }}
                onClick={onOpen}
                fontWeight="bold"
                boxShadow="md"
              >
                <Icon as={Plus} />
                項目を追加
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      <AddTodoModal isOpen={open} onClose={onClose} />
      <TodoDetailModal isOpen={isDetailOpen} onClose={handleDetailClose} todo={selectedTodo} />
    </Box>
  );
};

export default TodoList;
