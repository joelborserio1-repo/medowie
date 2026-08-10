"use client";

export function DeleteButton({ action, confirmMessage }: { action: () => void; confirmMessage: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button type="submit" className="text-xs font-semibold uppercase tracking-wide text-grey hover:text-orange-dark">
        Delete
      </button>
    </form>
  );
}
