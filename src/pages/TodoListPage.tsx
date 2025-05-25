import React, { useState, useEffect } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import { Button } from "@/components/ui/button";
import { parseISO } from 'date-fns'; // Import parseISO for sorting
import { ThemeToggle } from '@/components/ThemeToggle'; // Import ThemeToggle

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDateTime?: string; // Added dueDateTime as an optional ISO string
}

const TodoListPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Load todos from local storage on initial render
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // Save todos to local storage whenever the todos state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, dueDateTime?: string) => { // Updated signature to accept dueDateTime
    const newTodo: Todo = {
      id: Date.now().toString(), // Simple unique ID
      text,
      completed: false,
      dueDateTime, // Include dueDateTime
    };
    setTodos([...todos, newTodo]);
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, newText: string, newDueDateTime?: string) => { // Updated signature to accept newDueDateTime
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText, dueDateTime: newDueDateTime } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Sort todos: incomplete first, then by due date/time, then by creation date (id)
  const sortedTodos = [...todos].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;

    // Then sort by due date/time
    // Use Infinity for tasks without a due date/time to place them at the end
    const dateA = a.dueDateTime ? parseISO(a.dueDateTime).getTime() : Infinity;
    const dateB = b.dueDateTime ? parseISO(b.dueDateTime).getTime() : Infinity;

    if (dateA !== dateB) {
      return dateA - dateB;
    }

    // Finally, sort by creation date (using id as timestamp) - newest first for same date/no date
    return parseInt(b.id) - parseInt(a.id);
  });


  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="flex justify-between items-center mb-6"> {/* Flex container for header and toggle */}
        <h1 className="text-2xl font-bold text-center bg-blue-500 text-white py-3 px-6 rounded-md flex-grow mr-4">Simple Todo App</h1> {/* Adjusted header styling */}
        <ThemeToggle /> {/* Add the ThemeToggle component */}
      </div>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todos={sortedTodos} // Use sorted todos
        onToggleComplete={toggleComplete}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />
      {todos.some(todo => todo.completed) && ( // Only show button if there are completed todos
        <div className="text-center mt-4">
          <Button variant="outline" onClick={clearCompleted}>
            Clear Completed ({todos.filter(todo => todo.completed).length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default TodoListPage;