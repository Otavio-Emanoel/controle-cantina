interface EmptyStateProps {
  message: string;
  icon?: string;
}

export default function EmptyState({ message, icon = '📋' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-gray-500">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-lg text-center">{message}</p>
    </div>
  );
}
