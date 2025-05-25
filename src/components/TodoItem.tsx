import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Check, X, CalendarIcon } from "lucide-react"; // Added CalendarIcon
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns"; // Import parseISO
import { Calendar } from "@/components/ui/calendar"; // Import Calendar
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Import Popover

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
    dueDateTime?: string; // Added dueDateTime
  };
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string, newDueDateTime?: string) => void; // Updated onEdit prop signature
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // Initialize edit date and time states from the todo's dueDateTime
  const initialDueDate = todo.dueDateTime ? parseISO(todo.dueDateTime) : undefined;
  const initialDueTime = todo.dueDateTime ? format(parseISO(todo.dueDateTime), 'HH:mm') : '';

  const [editDate, setEditDate] = useState<Date | undefined>(initialDueDate); // State for editing date
  const [editTime, setEditTime] = useState<string>(initialDueTime); // State for editing time

  const handleEditSave = () => {
    if (editText.trim()) {
      let newDueDateTime: string | undefined = undefined;
      if (editDate) {
        const date = new Date(editDate);
        if (editTime) {
          const [hours, minutes] = editTime.split(':').map(Number);
          date.setHours(hours, minutes, 0, 0);
        } else {
           // Default to start of day if no time is selected during edit
           date.setHours(0, 0, 0, 0);
        }
        newDueDateTime = date.toISOString(); // Store as ISO string
      }

      onEdit(todo.id, editText.trim(), newDueDateTime);
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setEditText(todo.text); // Reset text to original
    setEditDate(initialDueDate); // Reset date state
    setEditTime(initialDueTime); // Reset time state
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  // Format the due date and time for display
  const formattedDueDate = todo.dueDateTime ? format(parseISO(todo.dueDateTime), 'PPP') : null;
  const formattedDueTime = todo.dueDateTime ? format(parseISO(todo.dueDateTime), 'p') : null; // 'p' for short time (e.g., 10:30 AM)

  return (
    <div className="flex flex-col p-3 border-b last:border-b-0"> {/* Changed to flex-col to stack text/checkbox and date/time */}
      <div className="flex items-center justify-between"> {/* Row for checkbox, text, and buttons */}
        {isEditing ? (
          <div className="flex items-center gap-2 flex-grow">
            <Input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={handleEditSave}>
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleEditCancel}>
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-grow">
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={() => onToggleComplete(todo.id)}
            />
            <label
              htmlFor={`todo-${todo.id}`}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow",
                todo.completed ? "line-through text-muted-foreground" : ""
              )}
            >
              {todo.text}
            </label>
          </div>
        )}

        {!isEditing && ( // Only show edit/delete buttons when not editing
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-600/80"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(todo.id)}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {/* Display Due Date/Time below the text */}
      {!isEditing && (formattedDueDate || formattedDueTime) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 ml-7"> {/* Added margin-left to align with text */}
          <CalendarIcon className="h-3 w-3" />
          <span>
            {formattedDueDate} {formattedDueTime}
          </span>
        </div>
      )}
      {/* Editing Date/Time inputs */}
      {isEditing && (
         <div className="flex gap-2 items-center mt-2 ml-7"> {/* Added margin-left to align with text */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[180px] justify-start text-left font-normal", // Adjusted width
                    !editDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editDate ? format(editDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={editDate}
                  onSelect={setEditDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              className="w-auto" // Adjust width
            />
         </div>
      )}
    </div>
  );
};

export default TodoItem;