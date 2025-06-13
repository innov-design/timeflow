
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category?: string;
}

interface TodoListProps {
  todos: TodoItem[];
  onAddTodo: (todo: Omit<TodoItem, 'id'>) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo
}) => {
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    
    onAddTodo({
      text: newTodo,
      completed: false,
      createdAt: new Date()
    });
    
    setNewTodo('');
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Todo List
          </CardTitle>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {completedCount}/{totalCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Todo Form */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
          />
          <Button
            onClick={handleAddTodo}
            disabled={!newTodo.trim()}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Todo Items */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                todo.completed 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-white/10 border border-white/20'
              }`}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => onToggleTodo(todo.id)}
                className="border-white/30"
              />
              <span
                className={`flex-1 text-white ${
                  todo.completed ? 'line-through text-white/60' : ''
                }`}
              >
                {todo.text}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteTodo(todo.id)}
                className="text-white/60 hover:text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <div className="text-white/60 text-center py-8">
            No todos yet. Add one above!
          </div>
        )}

        {/* Progress Indicator */}
        {totalCount > 0 && (
          <div className="pt-4 border-t border-white/20">
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>Progress</span>
              <span>{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
