import Image from "next/image";
import DrawCanvas from "@/components/DrawCanvas";
import GenerateImageForm from "@/components/GenerateImageForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <GenerateImageForm />
    </main>
  );
}
