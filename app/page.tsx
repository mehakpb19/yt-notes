import Notes from "./components/Notes";
import SearchSection from "./components/SearchSection";
import YtPlayer from "./components/YtPlayer";

export default function page() {
  return (
    <div className="p-5 w-full h-screen bg-[radial-gradient(circle_farthest-corner_at_10%_20%,rgba(28,38,47,1)_0%,rgba(37,47,57,1)_90%)]">
      <SearchSection/>
      <YtPlayer />
      <Notes />
    </div>
  );
}