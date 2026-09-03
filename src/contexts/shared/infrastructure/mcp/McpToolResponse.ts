type ToolContent = {
  type: "text";
  text: string;
};

export class McpToolResponse {
  readonly content: ToolContent[];
  readonly structuredContent?: Record<string, string | number | object>;
  readonly isError?: boolean;

  private constructor(
    content: ToolContent[],
    structuredContent?: Record<string, string | number | object>,
    isError?: boolean,
  ) {
    this.content = content;
    this.structuredContent = structuredContent;
    this.isError = isError;
  }

  static text(text: string): McpToolResponse {
    return new McpToolResponse([{ type: "text", text }], undefined, false);
  }

  static structured(data: Record<string, string | number | object>): McpToolResponse {
    const text = JSON.stringify(data);

    return new McpToolResponse([{ type: "text", text }], data, false);
  }

  static error(message: string): McpToolResponse {
    return new McpToolResponse([{ type: "text", text: `${message}` }], undefined, true);
  }
}
