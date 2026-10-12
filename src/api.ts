export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Health {
  readonly service: string;
  readonly ok: boolean;
  readonly commit: string | null;
}

export async function fetchHealth(): Promise<Health> {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) throw new Error(`The API answered ${response.status}.`);
  return (await response.json()) as Health;
}
