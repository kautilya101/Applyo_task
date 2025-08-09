export interface IUser {
  id: string;
  email: string;
  password: string;
}


export interface ITodoItem {
  id: string;
  boardId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

export interface ITodoBoardItem {
  boardId: string; // unique identifier for the board
  userId: string; // users to which it belongs
  title: string; // title of the board
  createdAt: string; // creation date of the board
  todos: ITodoItem[]
}