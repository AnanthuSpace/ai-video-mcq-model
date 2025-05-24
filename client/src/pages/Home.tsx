import VideoUploadWithAssignment from "@/features/video-upload-with-assignment";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Video Assignment Portal</h1>
        <VideoUploadWithAssignment />
      </div>
    </main>
  )
}
