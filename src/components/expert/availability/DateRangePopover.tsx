import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRangePopoverProps {
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  minDate?: Date;
  disabled?: boolean;
}

export const DateRangePopover: React.FC<DateRangePopoverProps> = ({
  range,
  onChange,
  minDate = new Date(),
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !range?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range?.from ? (
            range.to ? (
              <>
                {format(range.from, "MMM d, yyyy")} – {format(range.to, "MMM d, yyyy")}
              </>
            ) : (
              format(range.from, "MMM d, yyyy")
            )
          ) : (
            <span>Pick a date range</span>
          )}
          {range?.from && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[280px] p-0 z-[100] bg-popover" align="start" sideOffset={8}>
        <Calendar
          mode="range"
          selected={range}
          onSelect={onChange}
          disabled={(date) => date < minDate}
          initialFocus
          numberOfMonths={1}
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};
