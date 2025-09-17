'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from '@/lib/api';


export default function CreatePage() {
    const [maxPlayers, setMax] = useState(4);
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    return (
        <main className="space-y-4">
            <h2 className="text-2xl font-semibold">Create Room</h2>
            <div className="card space-y-3">
                <label className="label">Max players (2–6)</label>
                <input type="number" min={2} max={6} className="input" value={maxPlayers}
                    onChange={(e) => setMax(Number(e.target.value))} />
                <button className="btn btn-primary w-full" disabled={loading}
                    onClick={async () => { setLoading(true); try { const res = await createRoom(maxPlayers); router.push(`/room/${res.roomId}/waiting`); } finally { setLoading(false); } }}>
                    {loading ? 'Creating…' : 'Create & Go to Lobby'}
                </button>
            </div>
        </main>
    );
}