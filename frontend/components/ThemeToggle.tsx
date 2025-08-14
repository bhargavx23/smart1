import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { Switch } from "./ui/switch";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-4 w-4 ${theme === "light" ? "text-black" : "text-gray-400"}`} />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-orange-500"
      />
      <Moon className={`h-4 w-4 ${theme === "dark" ? "text-white" : "text-gray-400"}`} />
    </div>
  );
}
