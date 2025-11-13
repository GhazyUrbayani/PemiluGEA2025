import { Separator } from "@/components/ui/separator";

function Page() {
  return (
    <main className="flex min-h-[calc(100vh-99.3667px)] flex-col items-center justify-center gap-8 px-6 py-12 sm:px-16">
      <div className="flex items-center gap-4">
        <p className="text-xl sm:text-2xl">404</p>
        <Separator orientation="vertical" className="h-16" />
        <p className="text-xl sm:text-2xl">Page not found</p>
      </div>
    </main>
  );
}

export default Page;
