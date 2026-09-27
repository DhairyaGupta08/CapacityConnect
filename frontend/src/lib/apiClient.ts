import type { ApiError, ApiErrorResponse } from "@/types/api";

export class ApiClientError extends Error {
  code: string;
  details?: Record<string, string>;
  status: number;

  constructor(error: ApiError, status: number) {
    super(error.message);
    this.name = "ApiClientError";
    this.code = error.code;
    this.details = error.details;
    this.status = status;
  }
}

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers = {}, ...customConfig } = options;

  let url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (!url.startsWith("/api") && !url.startsWith("http")) {
    url = `/api${url}`;
  }

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `${url.includes("?") ? "&" : "?"}${queryString}`;
    }
  }

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    method: "GET",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...customConfig,
  };

  const response = await fetch(url, config);

  if (response.status === 204) {
    return {} as T;
  }

  let data: any;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorBody = data as ApiErrorResponse;
    if (errorBody && errorBody.error) {
      throw new ApiClientError(errorBody.error, response.status);
    }
    throw new ApiClientError(
      {
        code: `HTTP_${response.status}`,
        message: typeof data === "string" ? data : response.statusText || "Request failed",
      },
      response.status
    );
  }

  return data as T;
}
