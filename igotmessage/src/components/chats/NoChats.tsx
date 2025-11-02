import { LucideMessageSquareWarning, MessageSquare, MessageSquareDashed } from "lucide-react"; // or import from phosphor-react

export default function NoChats({tabName}: {tabName: string}) {
  return (
    <div className="flex flex-col items-center justify-start h-[80vh] text-[var(--textColor)] p-2 ">
      <div className=" rounded-4xl py-4 px-8 mt-12 mb-4  bg-[var(--wrapperColor)]">
        <LucideMessageSquareWarning strokeWidth={1} className="w-38 h-38 text-[var(--textColor)]/60" />
      </div>
      <div className="text-center text-xl font-semibold">
        No {tabName} available
      </div>
      <div className="text-center text-sm mt-1 text-[var(--textColor)]/60">
        Start a new conversation to see messages here
      </div>
    </div>
  );
}
