import Loading from "./components/Loading";
import Notes from "./components/Notes";
import SearchSection from "./components/SearchSection";
import YtPlayer from "./components/YtPlayer";

export default function Page() {
  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden bg-[radial-gradient(circle_farthest-corner_at_10%_20%,rgba(28,38,47,1)_0%,rgba(37,47,57,1)_90%)]">
      <Loading />
      <SearchSection />
      <main className="flex-1 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-10 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <YtPlayer />
        <Notes />
      </main>
    </div>
  );
}