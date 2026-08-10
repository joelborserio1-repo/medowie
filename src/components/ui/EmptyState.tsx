export function EmptyState({ heading, message }: { heading: string; message: string }) {
  return (
    <div className="border border-line px-6 py-10 text-center sm:px-10">
      <p className="text-lg text-brown">{heading}</p>
      <p className="mt-2 text-sm text-grey">{message}</p>
    </div>
  );
}
