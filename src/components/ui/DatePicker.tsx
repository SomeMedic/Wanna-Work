import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import type { DateRange, DayPicker as DayPickerType } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Выберите дату',
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        className={cn(
          'w-full justify-start text-left font-normal',
          !value && 'text-gray-500'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, 'PPP', { locale: ru }) : placeholder}
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 z-50">
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <DayPicker
              mode="single"
              defaultMonth={value || undefined}
              selected={value || undefined}
              onSelect={(date) => {
                onChange(date || null);
                setIsOpen(false);
              }}
              disabled={[
                ...(minDate ? [{ before: minDate }] : []),
                ...(maxDate ? [{ after: maxDate }] : []),
              ]}
              locale={ru}
              className="p-0"
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button: cn(
                  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-gray-500 rounded-md w-8 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: cn(
                  'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
                  'first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                ),
                day: cn(
                  'h-8 w-8 p-0 font-normal',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'focus:outline-none focus:ring-2 focus:ring-accent-primary'
                ),
                day_selected: cn(
                  'bg-accent-primary text-white',
                  'hover:bg-accent-primary hover:text-white',
                  'focus:bg-accent-primary focus:text-white'
                ),
                day_today: 'bg-gray-100 dark:bg-gray-800',
                day_outside: 'text-gray-500 opacity-50',
                day_disabled: 'text-gray-500 opacity-50',
                day_range_middle: 'aria-selected:bg-gray-100',
                day_hidden: 'invisible',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 