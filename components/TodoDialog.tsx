"use client";

import { useForm } from "react-hook-form";
import { ITodoItem } from "@/types/index.types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface TodoDialogProps {
  boardId: string;
  onTodoCreate: (boardId: string, newTodo: Partial<ITodoItem>) => void;
}

export const TodoDialog = ({ boardId, onTodoCreate }: TodoDialogProps) => {
  const form = useForm<Partial<ITodoItem>>({
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: ""
    }
  });
  const [open, setOpen] = useState(false);
  
  const onSubmit = async (data: Partial<ITodoItem>) => {
    
    if (onTodoCreate) onTodoCreate(boardId, data);
    setOpen(false); 
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-500">Add Todo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Title" {...form.register("title", { required: true })} />
          <Input placeholder="Description" {...form.register("description")} />

          <Select onValueChange={(val) => form.setValue("status", val as ITodoItem["status"])} defaultValue="pending">
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(val) => form.setValue("priority", val as ITodoItem["priority"])} defaultValue="medium">
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" {...form.register("dueDate")} />
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
