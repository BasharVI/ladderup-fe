"use client";
import { create } from "zustand";

export type Player = {
  userId: string;
  name: string;
  seat: number;
  connected: boolean;
  place?: 1 | 2 | 3;
};
export type RoomState = {
  id: string;
  status: "waiting" | "active" | "completed";
  hostId: string | null;
  maxPlayers: number;
  players: Player[];
  order: string[];
  turnIdx: number;
  positions: Record<string, number>;
  finished: string[];
  boardId: string;
  timers: { turnEndsAt?: number | null };
};

type Store = {
  me: { userId: string; name: string } | null;
  room: RoomState | null;
  setMe: (u: { userId: string; name: string }) => void;
  setRoom: (
    r: RoomState | ((prev: RoomState | null) => RoomState | null)
  ) => void;
};

export const useGame = create<Store>((set, get) => ({
  me: null,
  room: null,
  setMe: (u) => set({ me: u }),
  setRoom: (r) =>
    set(
      typeof r === "function"
        ? { room: (r as any)(get().room) }
        : { room: r as RoomState }
    ),
}));
