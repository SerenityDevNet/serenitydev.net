import SharedChatBox from "@/components/general/shared-chat-box";

export default function SharedChatPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-10">
      {/* You can resize this div to fit your OBS needs.
         The component will fill whatever size you give it.
      */}
      <div className="w-[400px] h-[600px]">
        <SharedChatBox className="w-full h-full" />
      </div>
    </main>
  );
}