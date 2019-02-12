// @flow
import querystring from "query-string";
import type { Branch, BranchDescriptor, ProjectDescriptor } from "../types";
import BaseEndpoint from "./BaseEndpoint";

export default class Branches extends BaseEndpoint {
  info(descriptor: BranchDescriptor): Promise<Branch> {
    return this.request<Branch>({
      api: () => {
        return this.apiRequest(
          `projects/${descriptor.projectId}/branches/${descriptor.branchId}`
        );
      },

      cli: () => {
        return this.cliRequest([
          "branch",
          "load",
          descriptor.projectId,
          descriptor.branchId
        ]);
      }
    });
  }

  list(
    descriptor: ProjectDescriptor,
    options: { filter?: "active" | "archived" | "mine" } = {}
  ): Promise<Branch[]> {
    return this.request<Branch[]>({
      api: async () => {
        const query = querystring.stringify(options);
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/?${query}`
        );
        return response.data.branches;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "branches",
          descriptor.projectId,
          ...(options.filter ? ["--filter", options.filter] : [])
        ]);
        return response.branches;
      }
    });
  }
}