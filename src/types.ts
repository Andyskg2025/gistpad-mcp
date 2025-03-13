import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StarredGistStore, YourGistStore } from "./store.js";

// GitHub Gist API types

export interface GistComment {
    id: string;
    body: string;
    user: {
        login: string;
    };
    created_at: string;
    updated_at: string;
}

export interface GistFile {
    filename: string;
    type: string;
    language: string;
    raw_url: string;
    size: number;
    content: string;
}

export interface Gist {
    id: string;
    description: string;
    files: { [key: string]: GistFile };
    public: boolean;
    created_at: string;
    updated_at: string;
    owner: {
        login: string;
    };
    comments: number;
    url: string;
    share_url: string;
}

// MCP / GistPad server types

export interface ResourceNotification {
    type: "add" | "delete";
    resourceType: "gist";
    resourceId: string;
}

export interface GistHandlerContext {
    fetchAllGists: () => Promise<Gist[]>;
    fetchStarredGists: () => Promise<Gist[]>;
    dailyNotesGistId: string | null;

    updateGistInCache: (gist: Gist) => void;
    addGistToCache: (gist: Gist) => void;
    removeGistFromCache: (gistId: string) => void;
    invalidateCache: () => void;
}

export interface RequestContext {
    server: Server;
    gistStore: YourGistStore;
    starredGistStore: StarredGistStore;
    axiosInstance: any;
    includeArchived: boolean;
    includeStarred: boolean;
    includeDaily: boolean;

    addStarredGist: (gist: Gist) => void;
    removeStarredGist: (gistId: string) => void;

    // Method to trigger resource notifications when gists are added/deleted
    notifyResourceChange?: (notification: ResourceNotification) => void;
}

export interface RequestWithParams {
    params: {
        name: string;
        arguments?: Record<string, unknown>;
    };
}
export type ToolHandler = (params: any, context: RequestContext) => Promise<any>;

// Define ToolDefinition type or import it if it exists elsewhere
export type ToolDefinition = {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
};

export interface ToolModule {
    definitions: ToolDefinition[];
    handlers: Record<string, ToolHandler>;
}

export interface ResourceHandlers {
    listResources: (context: RequestContext) => Promise<{
        resources: Array<{
            uri: string;
            name: string;
            mimeType: "application/json";
        }>;
    }>;

    listResourceTemplates: () => {
        resourceTemplates: Array<{
            uriTemplate: string;
            name: string;
            mimeType: string;
            description?: string;
        }>;
    };

    readResource: (
        uri: string,
        context: RequestContext
    ) => Promise<{
        contents: Array<{
            uri: string;
            mimeType: string;
            text: string;
        }>;
    }>;
}
