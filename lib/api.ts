export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function createRoom(maxPlayers: number) {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ maxPlayers }),
  });
  if (!res.ok) throw new Error("Failed to create room");
  return res.json() as Promise<{ roomId: string; roomLink: string }>;
}
