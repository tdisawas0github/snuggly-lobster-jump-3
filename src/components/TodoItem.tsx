import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Check, X } from "lucide-react"; // Added Pencil, Check, X icons
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; // Added Input for editing

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
  };
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void; // Added onEdit prop
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEditSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setEditText(todo.text); // Reset text to original
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0">
      {isEditing ? (
        <div className="flex items-center gap-2 flex-grow">
          <Input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow"
            autoFocus // Automatically focus the input when editing starts
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
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow", // Added flex-grow
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
  );
};

export default TodoItem;