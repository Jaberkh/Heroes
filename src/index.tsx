import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/middlewares";
import dotenv from "dotenv";

// بارگذاری متغیرهای محیطی از فایل .env
dotenv.config();

// بررسی کلید API
const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY;
if (!AIRSTACK_API_KEY) {
  console.error("AIRSTACK_API_KEY is not defined in the environment variables");
  throw new Error("AIRSTACK_API_KEY is missing");
}

// تعریف اپلیکیشن Frog با پیکربندی اولیه
export const app = new Frog({
  title: "Frog Frame",
  imageAspectRatio: "1:1",
  unstable_metaTags: [
    { property: "og:title", content: "Frog Frame" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://i.imgur.com/x5m4Vy2.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "1200" },
    { property: "og:description", content: "An interactive frame for Frog." },
  ],
  imageOptions: {
    fonts: [
      {
        name: "Lilita One",
        weight: 400,
        source: "google",
      },
    ],
  },
  hub: {
    apiUrl: "https://hubs.airstack.xyz",
    fetchOptions: {
      headers: {
        "x-airstack-hubs": AIRSTACK_API_KEY, // استفاده از کلید API
      },
    },
  },
});

// افزودن میان‌افزار neynar
app.use(
  neynar({
    apiKey: "057737BD-2028-4BC0-BE99-D1359BFD6BFF",
    features: ["interactor", "cast"],
  })
);

// ارائه فایل‌های استاتیک از پوشه public
app.use("/*", serveStatic({ root: "./public" }));

// تغییر در تابع frame برای اضافه کردن دکمه و ارسال کست
app.frame("/", async (c) => {
  // تنظیم متن کست و لینک
  const composeCastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
    "Bring back the Moxy heroes to us!\n\nFrame By @jeyloo"
  )}&embeds[]=${encodeURIComponent(
    "https://0ab9-35-178-91-117.ngrok-free.app"
  )}`;

  // بازگشت پاسخ با تصویر و دکمه
  return c.res({
    image: (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "'Lilita One', sans-serif", // استفاده از فونت Lilita One
        }}
      >
        {/* تصویر اصلی فریم */}
        <img
          src="https://i.imgur.com/Wu4JYpk.png"
          alt="Interactive Frog Frame"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
      </div>
    ),
    intents: [
      <Button.Link href={composeCastUrl}>Join Us For Heroes</Button.Link>,
    ],
  });
});

// راه‌اندازی سرور
const port = 5173;
console.log(`Server is running on port ${port}`);

devtools(app, { serveStatic });
serve({
  fetch: app.fetch,
  port,
});
