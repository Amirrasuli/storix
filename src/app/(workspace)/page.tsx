import { CheckCircle2 } from "lucide-react";

import { formatMoneyIrt, formatQuantity } from "@/lib/formatting/number";

const setupItems = [
  "Next.js و TypeScript با حالت سخت‌گیرانه",
  "Tailwind CSS و اجزای shadcn/ui با پایه Radix",
  "زبان فارسی، جهت راست‌به‌چپ و قلم وزیرمتن",
  "تست‌های واحد، تست اجزا و تست سرتاسری",
];

export default function SetupPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12 sm:px-6">
      <section className="w-full max-w-2xl rounded-3xl border bg-card p-6 text-card-foreground shadow-sm sm:p-10">
        <p className="text-sm font-medium text-muted-foreground">
          Storix — فاز ۵
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          زیرساخت پروژه آماده است
        </h1>

        <p className="mt-4 max-w-xl leading-8 text-muted-foreground">
          این صفحه فقط وضعیت راه‌اندازی را نشان می‌دهد. صفحات محصول، داشبورد و
          جریان‌های موجودی در فاز بعدی ساخته می‌شوند.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {setupItems.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-2xl border bg-background p-3 text-sm leading-6"
            >
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-8 grid gap-4 rounded-2xl bg-muted p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">نمونه مبلغ</dt>
            <dd className="mt-1 font-semibold">{formatMoneyIrt(160000)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">نمونه تعداد</dt>
            <dd className="mt-1 font-semibold">
              {formatQuantity(1200)} <span className="font-normal">عدد</span>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">شناسه نمونه</dt>
            <dd className="mt-1 font-semibold">
              <bdi dir="ltr">SKU-1001</bdi>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">وضعیت داده</dt>
            <dd className="mt-1 font-semibold">داده‌ای ذخیره نشده است</dd>
          </div>
        </dl>

        <p className="mt-6 text-xs leading-6 text-muted-foreground">
          داده‌های قابل ویرایش در نسخه نهایی فقط در پروفایل همین مرورگر ذخیره
          می‌شوند و بین دستگاه‌ها همگام‌سازی نمی‌شوند.
        </p>
      </section>
    </main>
  );
}
