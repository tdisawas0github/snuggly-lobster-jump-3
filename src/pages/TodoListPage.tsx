import React, { useState, useEffect } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import { Button } from "@/components/ui/button"; // Import Button

interface Todo {
  id: string;
  text: string;
  completed: boolean;
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

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(), // Simple unique ID
      text,
      completed: false,
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

  const editTodo = (id: string, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Simple Todo App</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todos={todos}
        onToggleComplete={toggleComplete}
        onDelete={deleteTodo}
        onEdit={editTodo} // Pass the editTodo function
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