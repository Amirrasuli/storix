import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border bg-card p-8 text-center text-card-foreground shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">خطای ۴۰۴</p>
        <h1 className="mt-3 text-2xl font-bold">صفحه پیدا نشد</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          نشانی واردشده وجود ندارد یا صفحه هنوز در این نسخه ساخته نشده است.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">بازگشت به صفحه اصلی</Link>
        </Button>
      </section>
    </main>
  );
}
