import Image from "next/image";
import DrawCanvas from "@/components/DrawCanvas";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-96 h-96">
        <DrawCanvas />
      </div>
    </main>
  );
}
