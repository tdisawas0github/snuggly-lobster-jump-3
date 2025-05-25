import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Import Calendar
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Import Popover
import { format } from "date-fns"; // Import format
import { CalendarIcon } from "lucide-react"; // Import CalendarIcon
import { cn } from "@/lib/utils"; // Import cn

interface TodoFormProps {
  onAddTodo: (text: string, dueDateTime?: string) => void; // Updated prop signature
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [inputText, setInputText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // State for date
  const [selectedTime, setSelectedTime] = useState<string>(''); // State for time (HH:mm string)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      let dueDateTime: string | undefined = undefined;
      if (selectedDate) {
        // Combine date and time
        const date = new Date(selectedDate);
        if (selectedTime) {
          const [hours, minutes] = selectedTime.split(':').map(Number);
          date.setHours(hours, minutes, 0, 0);
        } else {
           // If no time is selected, default to start of day
           date.setHours(0, 0, 0, 0);
        }
        dueDateTime = date.toISOString(); // Store as ISO string
      }

      onAddTodo(inputText.trim(), dueDateTime);
      setInputText('');
      setSelectedDate(undefined); // Reset date
      setSelectedTime(''); // Reset time
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4"> {/* Changed to flex-col for better layout */}
      <Input
        type="text"
        placeholder="Add a new todo..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full" // Use full width
      />
      <div className="flex gap-2 items-center"> {/* Container for date and time pickers */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-auto" // Adjust width for time input
        />
      </div>
      <Button type="submit" className="w-full">Add Todo</Button> {/* Use full width */}
    </form>
  );
};

export default TodoForm;