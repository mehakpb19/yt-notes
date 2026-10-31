import Loading from "./components/Loading";
import Notes from "./components/Notes";
import SearchSection from "./components/SearchSection";
import YtPlayer from "./components/YtPlayer";
import { useGlobal } from "./context/context";

export default function page() {
  return (
    <div className="w-full overflow-clip h-screen bg-[radial-gradient(circle_farthest-corner_at_10%_20%,rgba(28,38,47,1)_0%,rgba(37,47,57,1)_90%)]">
      <Loading />
      <SearchSection />
      <div className="flex gap-10 justify-center w-full p-5 h-full">
        <YtPlayer />
        <Notes />
      </div>
    </div>
  );
}
