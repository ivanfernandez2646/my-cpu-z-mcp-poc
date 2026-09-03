export type McpPromptMessage = {
  role: "user" | "assistant";
  content: {
    type: "text";
    text: string;
  };
};

export class McpPromptResponse {
  readonly messages: McpPromptMessage[];
  readonly description?: string;

  private constructor(messages: McpPromptMessage[], description?: string) {
    this.messages = messages;
    this.description = description;
  }

  static user(text: string, description?: string): McpPromptResponse {
    return new McpPromptResponse([{ role: "user", content: { type: "text", text } }], description);
  }

  static replicateWithAssistant(text: string, description?: string): McpPromptResponse {
    return new McpPromptResponse(
      [
        { role: "assistant", content: { type: "text", text } },
        { role: "user", content: { type: "text", text } },
      ],
      description,
    );
  }
}
