'use client';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useGame } from '@/store/game';


// Classic board matching backend
const snakes = [{ from: 98, to: 79 }, { from: 95, to: 75 }, { from: 93, to: 73 }, { from: 87, to: 24 }, { from: 64, to: 60 }, { from: 62, to: 19 }, { from: 54, to: 34 }];
const ladders = [{ from: 4, to: 14 }, { from: 9, to: 31 }, { from: 20, to: 38 }, { from: 28, to: 84 }, { from: 40, to: 59 }, { from: 51, to: 67 }, { from: 63, to: 81 }];


function cellToXY(cell: number) {
    if (cell < 1) cell = 1; if (cell > 100) cell = 100;
    const row = Math.floor((cell - 1) / 10); // 0..9 from bottom
    const colInRow = (cell - 1) % 10;
    const col = row % 2 === 0 ? colInRow : 9 - colInRow; // zig-zag
    const x = col / 9; // 0..1
    const y = row / 9; // 0..1 (bottom to top)
    return { x, y };
}

function Token({ color, pos, index }: { color: string; pos: number; index: number }) {
    const { x, y } = cellToXY(Math.max(1, pos || 1));
    const offset = (index % 4) * 6; // spread tokens within a cell
    return (
        <motion.div
            className="absolute size-4 rounded-full border border-white/30"
            style={{ backgroundColor: color }}
            animate={{ left: `calc(${x * 100}% - 8px + ${offset - 9}px)`, bottom: `calc(${y * 100}% - 8px + ${offset - 9}px)` }}
            transition={{ type: 'spring', stiffness: 240, damping: 25 }}
        />
    );
}


function OverlaySVG() {
    // draw snakes/ladders as lines between cell centers
    const lines = useMemo(() => [
        ...ladders.map(l => ({ from: cellToXY(l.from), to: cellToXY(l.to), type: 'ladder' as const })),
        ...snakes.map(s => ({ from: cellToXY(s.from), to: cellToXY(s.to), type: 'snake' as const })),
    ], []);
    return (
        <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            {lines.map((ln, i) => {
                const x1 = ln.from.x * 100, y1 = (ln.from.y) * 100;
                const x2 = ln.to.x * 100, y2 = (ln.to.y) * 100;
                const stroke = ln.type === 'ladder' ? '#22c55e' : '#ef4444';
                return <line key={i} x1={x1} y1={100 - y1} x2={x2} y2={100 - y2} stroke={stroke} strokeWidth={1.5} strokeOpacity={0.85} />
            })}
        </svg>
    );
}

export default function Board() {
    const room = useGame(s => s.room);
    const players = room?.players || [];
    const positions = room?.positions || {};


    return (
        <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[linear-gradient(135deg,#0f172a,#111827)] p-2 shadow-xl">
                {/* Grid */}
                <div className="absolute inset-2 grid grid-cols-10 grid-rows-10 gap-[2px]">
                    {Array.from({ length: 100 }).map((_, i) => {
                        const n = 100 - i;
                        return <div key={i} className="bg-zinc-800/60 rounded-[6px] text-[10px] flex items-center justify-center text-zinc-400 select-none">{n}</div>
                    })}
                </div>
                <OverlaySVG />
                {/* Tokens */}
                <div className="absolute inset-2">
                    {players.map((p, idx) => {
                        const palette = ['#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#f87171'];
                        return <Token key={p.userId} color={palette[idx % palette.length]} pos={positions[p.userId] || 0} index={idx} />
                    })}
                </div>
            </div>
        </div>
    );
}