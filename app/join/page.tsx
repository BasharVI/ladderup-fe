'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function JoinPage() {
    const [roomId, setId] = useState('');
    const router = useRouter();
    return (
        <main className="space-y-4">
            <h2 className="text-2xl font-semibold">Join Room</h2>
            <div className="card space-y-3">
                <label className="label">Room ID</label>
                <input className="input" placeholder="e.g. AB12CD" value={roomId} onChange={e => setId(e.target.value.toUpperCase())} />
                <button className="btn btn-primary w-full" onClick={() => roomId && router.push(`/room/${roomId}/waiting`)}>Continue</button>
            </div>
        </main>
    );
}