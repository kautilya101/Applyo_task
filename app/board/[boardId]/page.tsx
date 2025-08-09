import { TodoList } from '@/components/TodoList';

export default async function BoardItemPage ({params}: {params: Promise<{boardId: string}>}) {
  const { boardId } = await params

  if(!boardId) {
    console.error("Board ID is required to display the board item page.");
    return;
  }

  return (
    <main className="h-full w-full">
      <TodoList boardId={boardId} />
    </main>
  )
}
