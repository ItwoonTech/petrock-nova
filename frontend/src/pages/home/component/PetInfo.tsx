import Board from '@/components/Board';
import { usePetStore } from '@/stores/petStore';
import { Box, Button, Icon, IconButton, Input, Text, VStack } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import {
  Bone,
  Brush,
  CheckCircle,
  Cookie,
  Dog,
  Ellipsis,
  Frown,
  Pencil,
  Plus,
  Rabbit,
  Smile,
  Trash2,
  Utensils,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// アイコンの型定義
export type PetIcon = {
  id: string;
  icon: LucideIcon;
};

// アイコンの種類定義
export const petIcons: PetIcon[] = [
  { id: 'Dog', icon: Dog },
  { id: 'Bone', icon: Bone },
  { id: 'Smile', icon: Smile },
  { id: 'Frown', icon: Frown },
  { id: 'Utensils', icon: Utensils },
  { id: 'Cookie', icon: Cookie },
];

interface PetInfoItem {
  icon: PetIcon;
  label: string;
  value: string;
  color: string;
  isEditing?: boolean;
  id: string;
}

const sketchStyle: React.CSSProperties = {
  filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.3))',
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
};

/**
 * ペット情報を表示・編集するコンポーネント
 * @returns ペットの詳細情報を表示するUIコンポーネント
 * @description
 * - ペットの基本情報（種類、餌、散歩、好きなことなど）を表示
 * - 情報の追加、編集、削除が可能
 * - アイコンの変更やテキストの編集機能を提供
 */
const PetInfo = () => {
  // パステルカラーの配色定義
  const colors = ['sticky.yellow', 'sticky.red', 'sticky.blue'];

  // 状態管理
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // petStoreから必要なメソッドを取得
  const { pet, addPetInfo, updatePetInfo, deleteMultiplePetInfo, updatePetInfoIcon } =
    usePetStore();

  // ペット情報の項目データをpetStoreから取得したデータに変換
  const [items, setItems] = useState<PetInfoItem[]>([]);

  // 次のアイコンを取得する関数
  const getNextIcon = (currentIconId: string): PetIcon => {
    const currentIndex = petIcons.findIndex(icon => icon.id === currentIconId);
    const nextIndex = (currentIndex + 1) % petIcons.length;
    return petIcons[nextIndex];
  };

  // petStoreからデータを取得してitemsを更新
  useEffect(() => {
    if (pet?.pet_info) {
      const convertedItems = pet.pet_info.map((info, index) => {
        // アイコンの順番を保持
        const iconIndex = index % petIcons.length;
        const icon = petIcons.find(icon => icon.id === info.pet_info_icon) || petIcons[iconIndex];

        return {
          id: `item-${index}`,
          icon,
          label: info.pet_info_title,
          value: info.pet_info_description,
          color: colors[index % colors.length],
        };
      });
      setItems(convertedItems);
    }
  }, [pet]);

  // 項目を追加する関数
  const handleAddItem = async () => {
    try {
      // 最後に使用されたアイコンを取得
      const lastUsedIcon = items.length > 0 ? items[items.length - 1].icon : petIcons[0];
      // 次のアイコンを取得
      const nextIcon = getNextIcon(lastUsedIcon.id);

      // petStoreのaddPetInfoメソッドを使用
      await addPetInfo('', '', nextIcon.id);

      // ローカル状態も更新
      const newItem: PetInfoItem = {
        id: `item-${Date.now()}`,
        icon: nextIcon,
        label: '',
        value: '',
        color: colors[items.length % 3],
        isEditing: true,
      };
      setItems([...items, newItem]);
    } catch (error) {
      console.error('項目追加エラー:', error);
    }
  };

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

  // アイコンを更新する関数
  const handleUpdateIcon = async (index: number, newIcon: PetIcon) => {
    try {
      // petStoreのupdatePetInfoIconメソッドを使用
      await updatePetInfoIcon(index, newIcon.id);

      // ローカル状態も更新
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        icon: newIcon,
      };
      setItems(newItems);
    } catch (error) {
      console.error('アイコン更新エラー:', error);
    }
  };

  // アイコンを一つずつ順番に切り替える
  const cycleIcon = async (index: number) => {
    const currentIcon = items[index].icon;
    const nextIcon = getNextIcon(currentIcon.id);
    await handleUpdateIcon(index, nextIcon);
  };

  // 編集を開始する関数
  const handleStartEditing = (index: number) => {
    const newItems = items.map((item, i) => ({
      ...item,
      isEditing: i === index,
    }));
    setItems(newItems);
  };

  // 編集を終了する関数
  const handleFinishEditing = async (index: number) => {
    try {
      const item = items[index];

      // petStoreのupdatePetInfoメソッドを使用
      await updatePetInfo(index, item.label, item.value, item.icon.id);

      // ローカル状態も更新
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        isEditing: false,
      };
      setItems(newItems);
    } catch (error) {
      console.error('編集保存エラー:', error);
    }
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
      // 選択された項目のインデックスを取得
      const selectedIndices = items
        .map((item, index) => (selectedItems.includes(item.id) ? index : -1))
        .filter(index => index !== -1);

      // petStoreのdeleteMultiplePetInfoメソッドを使用
      await deleteMultiplePetInfo(selectedIndices);

      // ローカル状態も更新
      const newItems = items.filter(item => !selectedItems.includes(item.id));
      setItems(newItems);
      setSelectedItems([]);
      setIsDeleting(false);
    } catch (error) {
      console.error('削除エラー:', error);
    }
  };

  // 項目のラベルや値を更新する関数
  const handleUpdateItem = async (index: number, field: 'label' | 'value', newValue: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: newValue,
    };
    setItems(newItems);

    // 編集が完了したらpetStoreのupdatePetInfoメソッドを使用
    if (!newItems[index].isEditing) {
      try {
        const item = newItems[index];
        await updatePetInfo(index, item.label, item.value, item.icon.id);
      } catch (error) {
        console.error('保存エラー:', error);
      }
    }
  };

  return (
    <Board>
      {/* ヘッダー部分 - タイトルとメニューボタン */}
      <Box position="relative" mb={4}>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="white"
          textAlign="center"
          textShadow="0 2px 4px rgba(0,0,0,0.4)"
        >
          ペットについて
        </Text>
        {/* 右上のメニューボタン */}
        <Box position="absolute" right={0} top="50%" transform="translateY(-50%)" zIndex={10}>
          <Box position="relative">
            <Button
              ref={buttonRef}
              size="lg"
              variant="ghost"
              color="white"
              bg="rgba(255,255,255,0.1)"
              _hover={{ bg: 'hover' }}
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

      {/* リスト領域 */}
      <VStack gap={3} align="stretch" width="100%">
        {items.map((item, index) => (
          <Box
            key={item.id}
            position="relative"
            bg={item.color}
            p={6}
            pl={8}
            borderRadius="2xl"
            width="100%"
            boxShadow="md"
          >
            {/* 左側のドット */}
            <Box
              position="absolute"
              left="10px"
              top="50%"
              transform="translateY(-50%)"
              width="12px"
              height="12px"
              borderRadius="full"
              bg="tree.400"
              boxShadow="inset 0 0 6px rgba(0,0,0,0.3)"
            />
            {/* 項目のメインコンテンツ */}
            <Box
              display="flex"
              alignItems="center"
              width="100%"
              pr={!isDeleting ? '40px' : 0}
              position="relative"
            >
              <Box display="flex" alignItems="center" width="100%" minWidth={0}>
                {/* 削除モード時のチェックボックス */}
                {isDeleting && (
                  <Box flexShrink={0} mr={2}>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => toggleItemSelection(item.id)}
                      bg={selectedItems.includes(item.id) ? 'red.100' : 'gray.100'}
                      borderColor={selectedItems.includes(item.id) ? 'red.500' : 'gray.300'}
                      _hover={{
                        bg: selectedItems.includes(item.id) ? 'red.200' : 'gray.100',
                      }}
                      p={1}
                      minW="20px"
                      h="20px"
                    >
                      {selectedItems.includes(item.id) ? '✓' : ''}
                    </Button>
                  </Box>
                )}
                {/* アイコン部分 */}
                <Box
                  cursor="pointer"
                  _hover={{ opacity: 0.7 }}
                  onClick={() => cycleIcon(index)}
                  title="クリックしてアイコンを変更"
                  display="flex"
                  alignItems="center"
                  mr={3}
                  flexShrink={0}
                >
                  <Icon as={item.icon.icon} boxSize={5} color="#4A2501" />
                </Box>
                {/* テキストコンテンツ部分 */}
                <Box width="100%" minWidth={0}>
                  {item.isEditing ? (
                    // 編集モード時の入力フォーム
                    <Box width="100%">
                      <Input
                        placeholder="タイトルを入力"
                        value={item.label}
                        onChange={e => handleUpdateItem(index, 'label', e.target.value)}
                        size="sm"
                        mb={2}
                        bg="whiteAlpha.600"
                        width="100%"
                      />
                      <Input
                        placeholder="内容を入力"
                        value={item.value}
                        onChange={e => handleUpdateItem(index, 'value', e.target.value)}
                        size="sm"
                        bg="whiteAlpha.600"
                        width="100%"
                      />
                    </Box>
                  ) : (
                    // 表示モード時のテキスト
                    <Box width="100%" minWidth={0}>
                      <Text
                        fontSize="sm"
                        color="text"
                        fontWeight="bold"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        title={item.label || '（タイトルを入力）'}
                      >
                        {item.label || '（タイトルを入力）'}
                      </Text>
                      <Text
                        fontSize="md"
                        color="text"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        display="-webkit-box"
                        style={{
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        title={item.value || '（内容を入力）'}
                      >
                        {item.value || '（内容を入力）'}
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
              {/* 編集ボタン（削除モード時は非表示） */}
              {!isDeleting && (
                <Box position="absolute" right={0} top="50%" transform="translateY(-50%)">
                  <IconButton
                    as={item.isEditing ? CheckCircle : Pencil}
                    size="md"
                    variant="ghost"
                    color="button"
                    fill="accent.500"
                    strokeWidth="1"
                    bg="whiteAlpha.400"
                    onClick={() =>
                      item.isEditing ? handleFinishEditing(index) : handleStartEditing(index)
                    }
                    p={1}
                    _hover={{ bg: 'hover' }}
                  ></IconButton>
                </Box>
              )}
            </Box>
          </Box>
        ))}
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
      {!isDeleting && (
        <Box textAlign="center" mt={6}>
          <Button
            onClick={handleAddItem}
            colorScheme="green"
            variant="ghost"
            color="white"
            bg="secondary.500"
            _hover={{ bg: 'hover' }}
            fontWeight="bold"
            boxShadow="md"
          >
            <Icon as={Plus} mr={2} />
            項目を追加
          </Button>
        </Box>
      )}
      {/* らくがき風アイコン */}
      <Box textAlign="center" mt={32}>
        <Icon
          as={Brush}
          boxSize="80px"
          color="white"
          pos="absolute"
          bottom="10%"
          left="20px"
          transform="rotate(180deg) scaleY(-1)"
          opacity={0.6}
          zIndex={1}
          style={sketchStyle}
        />
        <Icon
          as={Dog}
          boxSize="80px"
          color="gray.500"
          pos="absolute"
          bottom="2%"
          right="25%"
          transform="rotate(30deg)"
          opacity={0.6}
          zIndex={1}
          style={sketchStyle}
        />
        <Icon
          as={Rabbit}
          boxSize="70px"
          color="pink.400"
          pos="absolute"
          bottom="10%"
          right="20px"
          transform="rotate(-4deg)"
          opacity={0.6}
          zIndex={1}
          style={sketchStyle}
        />
      </Box>
    </Board>
  );
};

export default PetInfo;
