'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getIdentity } from '@/lib/identity';
import { getSocket } from '@/lib/socket';
import { useGame } from '@/store/game';
import { TopBar } from '@/components/TopBar';


export default function WaitingRoom() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { me, room, setMe, setRoom } = useGame();


    useEffect(() => {
        const ident = getIdentity();
        setMe(ident);
        const socket = getSocket(ident.userId);


        const handleState = (st: any) => setRoom(st);
        const handleStarted = (st: any) => { setRoom(st); router.push(`/room/${id}/play`); };


        socket.emit('room.join', { roomId: id, name: ident.name, userId: ident.userId });
        socket.on('room.state', handleState);
        socket.on('room.started', handleStarted);


        return () => {
            socket.off('room.state', handleState);
            socket.off('room.started', handleStarted);
        };
    }, [id, router, setMe, setRoom]);


    const isHost = room && me ? room.hostId === me.userId : false;
    const canStart = (room?.players?.length || 0) >= 2;


    return (
        <main className="space-y-4">
            <TopBar roomId={String(id)} />


            <div className="card space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Waiting Room</h3>
                    <div className="text-sm text-zinc-400">{room?.players.length || 0}/{room?.maxPlayers || 0} joined</div>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {room?.players.map(p => (
                        <li key={p.userId} className="rounded-xl bg-zinc-900 px-3 py-2 flex items-center justify-between">
                            <span className="font-medium">{p.name}</span>
                            <span className="badge">{p.userId === room?.hostId ? 'Host' : 'Player'}</span>
                        </li>
                    ))}
                </ul>
                {isHost ? (
                    <button className="btn btn-primary w-full" disabled={!canStart}
                        onClick={() => getSocket(me!.userId).emit('room.start', { roomId: id })}>
                        {canStart ? 'Start Game' : 'Waiting for players…'}
                    </button>
                ) : (
                    <div className="text-center text-zinc-400">Waiting for host to start…</div>
                )}
            </div>
        </main>
    );
}