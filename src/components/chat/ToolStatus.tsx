import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolStatusProps {
  toolInvocation: ToolInvocation;
}

function getToolMessage(toolInvocation: ToolInvocation): string {
  const args = toolInvocation.args as Record<string, string> | undefined;
  const path = args?.path ?? "";

  switch (toolInvocation.toolName) {
    case "str_replace_editor": {
      switch (args?.command) {
        case "create":
          return `Creating ${path}`;
        case "str_replace":
        case "insert":
          return `Editing ${path}`;
        case "view":
          return `Reading ${path}`;
        case "undo_edit":
          return `Undoing changes to ${path}`;
        default:
          return `Editing ${path}`;
      }
    }
    case "file_manager": {
      switch (args?.command) {
        case "rename":
          return `Renaming ${path}`;
        case "delete":
          return `Deleting ${path}`;
        default:
          return `Managing ${path}`;
      }
    }
    default:
      return toolInvocation.toolName;
  }
}

export function ToolStatus({ toolInvocation }: ToolStatusProps) {
  const message = getToolMessage(toolInvocation);
  const isComplete = toolInvocation.state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{message}</span>
    </div>
  );
}
