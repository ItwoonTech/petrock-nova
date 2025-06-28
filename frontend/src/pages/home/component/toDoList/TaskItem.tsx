import { HStack, IconButton, Text } from '@chakra-ui/react';
import { Check, ChevronDown, Pin, Trash2 } from 'lucide-react';

interface TaskItemProps {
  id: string;
  text: string;
  completed: boolean;
  starred?: boolean;
  hasDropdown?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClick: () => void;
  onCheckboxClick?: () => void;
  onStar?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

const TaskItem = ({
  text,
  completed,
  starred,
  hasDropdown = false,
  isExpanded,
  onToggleExpand,
  onClick,
  onCheckboxClick,
  onStar,
  onDelete,
  disabled = false,
}: TaskItemProps) => {
  const getBackgroundColor = () => (completed ? 'done' : 'yet');

  const getTaskCompletedIcon = ({
    completed,
    size = 'sm',
  }: {
    completed: boolean;
    size?: 'xs' | 'sm' | 'md';
  }) => (
    <IconButton
      aria-label={completed ? 'Completed' : 'Incomplete'}
      variant="ghost"
      size={size}
      bg="white"
      color="red"
      border="2px solid"
      borderColor="button_background"
      disabled={disabled}
      onClick={e => {
        e.stopPropagation();
        onCheckboxClick?.();
      }}
    >
      {completed ? <Check size={16} /> : null}
    </IconButton>
  );
  return (
    <HStack
      justifyContent="space-between"
      bg={getBackgroundColor()}
      p={3}
      borderRadius="md"
      w="100%"
      opacity={completed ? 0.6 : 1}
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
    >
      <HStack gap={3}>
        {hasDropdown && onToggleExpand ? (
          <IconButton
            aria-label="Toggle dropdown"
            bg="transparent"
            variant="outline"
            size="xs"
            color="button"
            transform={isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)'}
            transition="transform 0.2s"
            rounded="full"
            border="1px solid"
            onClick={e => {
              e.stopPropagation();
              onToggleExpand();
            }}
          >
            <ChevronDown size={20} />
          </IconButton>
        ) : (
          getTaskCompletedIcon({ completed })
        )}
        <Text fontSize="md" color="text" fontFamily="'Noto Sans JP', sans-serif">
          {text}
        </Text>
      </HStack>

      {completed || starred ? (
        <IconButton
          as={Pin}
          aria-label="Pin"
          variant="ghost"
          size="sm"
          fill="accent.500"
          color="button"
          strokeWidth="1"
          bg="whiteAlpha.400"
          onClick={e => {
            e.stopPropagation();
            onStar?.();
          }}
          disabled={disabled}
        />
      ) : (
        <IconButton
          as={Trash2}
          aria-label="Delete"
          variant="ghost"
          size="sm"
          color="button"
          fill="blue.400"
          strokeWidth="1"
          bg="whiteAlpha.400"
          onClick={e => {
            e.stopPropagation();
            onDelete?.();
          }}
          disabled={disabled}
        />
      )}
    </HStack>
  );
};

export default TaskItem;
