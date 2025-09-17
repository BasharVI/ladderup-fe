import Link from 'next/link';


export default function Home() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">LadderUp</h1>
      <p className="text-zinc-400">Create a room or join by ID. Designed mobile-first, smooth animations.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link className="btn btn-primary" href="/create">Create Room</Link>
        <Link className="btn btn-secondary" href="/join">Join Room</Link>
      </div>
    </main>
  );
}