export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <img
          src="/logo.svg"
          alt="Z.ai Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex gap-4 max-sm:flex-col">
        <a
          href="/websocket"
          className="px-4 py-2 rounded bg-primary text-primary-foreground max-sm:text-center"
        >
          WebSocket Demo
        </a>
        <a
          href="/posts"
          className="px-4 py-2 rounded bg-secondary text-secondary-foreground max-sm:text-center"
        >
          Posts CRUD
        </a>
      </div>
    </div>
  )
}