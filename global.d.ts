interface ImportMeta {
  readonly env: {
    [key: string]: string | undefined;
    VITE_API_BASE_URL?: string; // Example environment variable
  };
}
