// import { CodelyError } from "../../domain/CodelyError.js";

import type { UriScheme } from "./McpResource.ts";
// import { McpResourceErrorResponse } from "./McpResourceErrorResponse.ts";
import { McpResourceListResponse } from "./McpResourceListResponse.ts";
import { McpResourceResponse } from "./McpResourceResponse.ts";

export type McpResourceTemplateCompleteResponse = Record<
  string,
  (value: string) => Promise<string[]>
>;

export interface McpResourceTemplate {
  name: string;
  title: string;
  description: string;
  uriTemplate: `${UriScheme}://${string}{${string}}${string}`;

  handler(uri: string, params: Record<string, string>): Promise<McpResourceResponse>;

  //   onError?(error: CodelyError, uri: string): McpResourceErrorResponse;

  list?(): Promise<McpResourceListResponse>;

  complete?(): McpResourceTemplateCompleteResponse;
}
