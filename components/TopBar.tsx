'use client';
import CopyButton from './CopyButton';


export function TopBar({ roomId }: { roomId: string }) {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return (
        <div className="flex items-center justify-between gap-3 mb-3">
            <div className="text-sm text-zinc-300">Room: <span className="font-mono font-semibold">{roomId}</span></div>
            <div className="flex gap-2">
                <CopyButton text={roomId} label="Copy ID" />
                <CopyButton text={url} label="Copy Link" />
            </div>
        </div>
    );
}