type ResourceContent = {
  uri: string;
  mimeType?: string;
  text: string;
};

export class McpResourceResponse {
  readonly contents: ResourceContent[];

  private constructor(contents: ResourceContent[]) {
    this.contents = contents;
  }

  static success(uri: string, data: unknown): McpResourceResponse {
    return new McpResourceResponse([
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(data),
      },
    ]);
  }
}
