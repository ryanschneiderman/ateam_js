import Link from "next/link";
import { Playfair_Display } from "next/font/google";

export default function Home() {
    console.log("PRINTING ROOT");
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Link
                href="/home"
                className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
                <span>Home</span>
            </Link>
        </main>
    );
}
