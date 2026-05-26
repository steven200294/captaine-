"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <span className="w-2 h-2 rounded-full bg-[#1c355e]/40 animate-[bounce_1.4s_infinite_0ms]" />
      <span className="w-2 h-2 rounded-full bg-[#1c355e]/40 animate-[bounce_1.4s_infinite_200ms]" />
      <span className="w-2 h-2 rounded-full bg-[#1c355e]/40 animate-[bounce_1.4s_infinite_400ms]" />
    </div>
  );
}
