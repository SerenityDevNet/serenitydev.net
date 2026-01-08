export default function SystemPanel({ title, children, accent = "amber" }: any) {
  const borderColor = accent === "red" ? "border-[#ef4444]" : "border-[#f59e0b]";
  const textColor = accent === "red" ? "text-[#ef4444]" : "text-[#f59e0b]";

  return (
    <div className={`bg-[#111] border ${borderColor} p-1 h-full flex flex-col`}>
      {/* Header */}
      <div className={`bg-[#222] p-2 flex justify-between items-center mb-2 border-b ${borderColor} border-dashed`}>
        <span className={`font-mono font-bold ${textColor} uppercase tracking-widest text-sm`}>
          {title}
        </span>
        <div className="flex gap-1">
           <div className={`w-2 h-2 rounded-full ${accent === "red" ? "bg-red-500" : "bg-amber-500"} animate-pulse`} />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow relative overflow-hidden bg-black/50">
        {children}
      </div>
    </div>
  );
}