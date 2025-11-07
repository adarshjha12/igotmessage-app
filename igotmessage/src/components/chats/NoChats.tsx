import {
  LucideMessageSquareWarning,
  MessageSquare,
  MessageSquareDashed,
} from "lucide-react"; // or import from phosphor-react

export default function NoChats({ tabName }: { tabName: string }) {
  return (
    <div className="flex flex-col mt-[60px] py-16 items-center justify-start text-[var(--textColor)] p-2 ">
      <div className="text-center flex gap-4 items-center text-xl font-semibold">
        <LucideMessageSquareWarning
          strokeWidth={2}
          className="w-6 h-6 text-[var(--textColor)]/60"
        />
        No {tabName} available
      </div>
      <div className="text-center text-sm mt-1 text-[var(--textColor)]/60">
        Start a new conversation to see messages here
      </div>
    </div>
  );
}
