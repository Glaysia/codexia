import React from "react";
import { Button } from "../ui/button";
import { PenSquare } from "lucide-react";
import { useChatInputStore } from "@/stores/chatInputStore";
import { useActiveConversationStore } from "@/stores/useActiveConversationStore";

export const ChatToolbar: React.FC = () => {
  const { clearAll, requestFocus } = useChatInputStore();
  const { setActiveConversationId } = useActiveConversationStore();

  const handleNewConversation = React.useCallback(() => {
    setActiveConversationId(null);
    clearAll();
    requestFocus();
  }, [setActiveConversationId, clearAll, requestFocus]);

  // Cmd/Ctrl+N shortcut for new conversation
  React.useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        handleNewConversation();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [handleNewConversation]);

  return (
    <div className="flex justify-between gap-2 px-2 w-full">
      <span className="flex gap-2">
        <Button size="icon" onClick={handleNewConversation} title="New Conversation (Cmd/Ctrl+N)">
          <PenSquare />
        </Button>
      </span>
      <span className="flex gap-2" />
    </div>
  );
};
