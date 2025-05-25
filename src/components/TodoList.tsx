import React from 'react';
import TodoItem from './TodoItem';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TodoListProps {
  todos: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void; // Added onEdit prop
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleComplete, onDelete, onEdit }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Todos</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {todos.length === 0 ? (
          <p className="text-center text-muted-foreground p-4">No todos yet! Add one above.</p>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit} // Pass onEdit prop
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TodoList;