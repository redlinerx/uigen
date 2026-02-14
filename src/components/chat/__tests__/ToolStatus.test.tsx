import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolStatus } from "../ToolStatus";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeTool(
  toolName: string,
  args: Record<string, string>,
  state: "result" | "call" = "result"
): ToolInvocation {
  if (state === "result") {
    return {
      toolCallId: "test-id",
      toolName,
      args,
      state: "result",
      result: "Success",
    };
  }
  return {
    toolCallId: "test-id",
    toolName,
    args,
    state: "call",
  };
}

test("str_replace_editor create shows Creating {path}", () => {
  render(
    <ToolStatus
      toolInvocation={makeTool("str_replace_editor", {
        command: "create",
        path: "/App.jsx",
      })}
    />
  );
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("str_replace_editor str_replace shows Editing {path}", () => {
  render(
    <ToolStatus
      toolInvocation={makeTool("str_replace_editor", {
        command: "str_replace",
        path: "/Button.tsx",
      })}
    />
  );
  expect(screen.getByText("Editing /Button.tsx")).toBeDefined();
});

test("str_replace_editor insert shows Editing {path}", () => {
  render(
    <ToolStatus
      toolInvocation={makeTool("str_replace_editor", {
        command: "insert",
        path: "/utils.ts",
      })}
    />
  );
  expect(screen.getByText("Editing /utils.ts")).toBeDefined();
});

test("str_replace_editor view shows Reading {path}", () => {
  render(
    <ToolStatus
      toolInvocation={makeTool("str_replace_editor", {
        command: "view",
        path: "/index.js",
      })}
    />
  );
  expect(screen.getByText("Reading /index.js")).toBeDefined();
});

test("str_replace_editor undo_edit shows Undoing changes to {path}", () => {
  render(
    <ToolStatus
      toolInvocation={makeTool("str_replace_editor", {
        command: "undo_edit",
        path: "/App.jsx",
      })}
    />
  );
  expect(screen.getByText("Undoing changes to /App.jsx")).toBeDefined();
});

test("file_manager rename shows Renaming {path}", () => {
  render(
    <ToolStatus
      toolInvocation={makeTool("file_manager", {
        command: "rename",
        path: "/old.tsx",
      })}
    />
  );
  expect(screen.getByText("Renaming /old.tsx")).toBeDefined();
});

test("file_manager delete shows Deleting {path}", () => {
  render(
    <ToolStatus
      toolInvocation={makeTool("file_manager", {
        command: "delete",
        path: "/temp.tsx",
      })}
    />
  );
  expect(screen.getByText("Deleting /temp.tsx")).toBeDefined();
});

test("shows spinner when state is not result", () => {
  const { container } = render(
    <ToolStatus
      toolInvocation={makeTool(
        "str_replace_editor",
        { command: "create", path: "/App.jsx" },
        "call"
      )}
    />
  );
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows green dot when state is result", () => {
  const { container } = render(
    <ToolStatus
      toolInvocation={makeTool(
        "str_replace_editor",
        { command: "create", path: "/App.jsx" },
        "result"
      )}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("unknown tool name falls back to raw tool name", () => {
  render(
    <ToolStatus
      toolInvocation={makeTool("some_unknown_tool", { command: "do_stuff" })}
    />
  );
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});
