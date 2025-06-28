import { Popover, Button, Portal } from '@chakra-ui/react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './calendar.css';

interface CalendarProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export function Calendar({ date, onSelect }: CalendarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          w="200px"
          justifyContent="start"
          textAlign="left"
          fontWeight="normal"
          bg="#F2ECE3"
          _hover={{ bg: '#F2ECE3' }}
          borderRadius="2xl"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'yyyy年MM月dd日', { locale: ja }) : '　日付を選択'}
        </Button>
      </Popover.Trigger>
      <Portal>
      <Popover.Positioner>
        <Popover.Content p={3} w="auto" bg="white" borderRadius="xl" boxShadow="lg">
          <Popover.Arrow />
          <Popover.Body>
            <DayPicker
              mode="single"
              selected={date}
              onSelect={(date) => {
                onSelect(date);
                setIsOpen(false);
              }}
              locale={ja}
              disabled={{ after: new Date() }}
              classNames={{
                caption: 'day-picker-caption',
                day: 'day-picker-day',
                cell: 'day-picker-cell',
                button: 'day-picker-button'
              }}
            />
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
} 