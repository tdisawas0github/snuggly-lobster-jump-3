import TodoListPage from "./TodoListPage";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle

const Index = () => {
  return (
    <div className="relative"> {/* Add a container for positioning */}
      <div className="absolute top-4 right-4 z-10"> {/* Position the toggle button */}
        <ThemeToggle />
      </div>
      <TodoListPage />
    </div>
  );
};

export default Index;