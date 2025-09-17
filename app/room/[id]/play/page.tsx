'use client';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getIdentity } from '@/lib/identity';
import { getSocket } from '@/lib/socket';
import { useGame } from '@/store/game';
import Board from '@/components/Board';
import { TopBar } from '@/components/TopBar';

export default function PlayPage() {
    const { id } = useParams<{ id: string }>();
    const { me, room, setMe, setRoom } = useGame();
    const [rolling, setRolling] = useState(false);
    const [lastRoll, setLastRoll] = useState<number | null>(null);


    const myTurn = useMemo(() => {
        if (!room || !me) return false;
        const uid = room.order[room.turnIdx];
        return uid === me.userId && room.status === 'active';
    }, [room, me]);

    useEffect(() => {
        // connect & subscribe to updates
        const ident = getIdentity();
        setMe(ident);
        const socket = getSocket(ident.userId);


        const handleState = (st: any) => setRoom(st);
        const handleTurn = (msg: any) => { setRoom((prev) => ({ ...(prev || stFallback), ...msg.st || {} } as any)); setLastRoll(msg.dice); setRolling(false); };
        const handleStarted = (st: any) => setRoom(st);
        const handleCompleted = (payload: any) => console.log('completed', payload);


        socket.on('room.state', handleState);
        socket.on('turn.update', (payload) => {
            // server sends: { userId, dice, from, to, positions, nextTurnIdx }
            setRoom((prev) => {
                if (!prev) return prev as any;
                return { ...prev, positions: payload.positions, turnIdx: payload.nextTurnIdx ?? prev.turnIdx } as any;
            });
            setLastRoll(payload.dice);
            setRolling(false);
        });
        socket.on('room.started', handleStarted);
        socket.on('game.completed', handleCompleted);


        // on refresh, ask for state implicitly (server sends on join)
        socket.emit('room.join', { roomId: id, name: ident.name, userId: ident.userId });


        return () => {
            socket.off('room.state', handleState);
            socket.off('turn.update');
            socket.off('room.started', handleStarted);
            socket.off('game.completed', handleCompleted);
        };
    }, [id, setMe, setRoom]);


    return (
        <main className="space-y-4">
            <TopBar roomId={String(id)} />


            <div className="card space-y-3">
                <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">Game</div>
                    {lastRoll !== null && <div className="text-sm text-zinc-300">Last roll: <span className="font-semibold">{lastRoll}</span></div>}
                </div>
                <Board />
                <div className="sticky bottom-4 mt-2">
                    <button
                        className="btn btn-primary w-full"
                        disabled={!myTurn || rolling || room?.status !== 'active'}
                        onClick={() => { setRolling(true); getSocket(me!.userId).emit('action.rollDice', { roomId: id }); }}
                    >
                        {room?.status === 'completed' ? 'Game Completed' : myTurn ? (rolling ? 'Rolling…' : 'Roll Dice') : 'Wait for your turn'}
                    </button>
                </div>
            </div>
        </main>
    );
}