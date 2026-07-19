export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-sm py-xl">
      <div className="pointer-events-none fixed -top-[10%] right-[-5%] h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-5%] h-96 w-96 rounded-full bg-secondary-container/5 blur-[120px]" />
      <main className="relative z-10 w-full max-w-[460px]">{children}</main>
    </div>
  );
}
