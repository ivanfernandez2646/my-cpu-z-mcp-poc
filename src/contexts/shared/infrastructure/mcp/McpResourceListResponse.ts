type Resource = {
  name: string;
  uri: string;
  title: string;
  description: string;
};

export class McpResourceListResponse {
  readonly resources: Resource[];

  private constructor(resources: Resource[]) {
    this.resources = resources;
  }

  static create(resources: Resource[]): McpResourceListResponse {
    return new McpResourceListResponse(resources);
  }
}
