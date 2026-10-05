import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import BottomNav from "@/components/navigation/BottomNav";

import RouterOutlet from "@/routes/RouterOutlet";

function App() {
  // h-dvh follows the phone's visible height as the browser bars show and hide;
  // the side padding keeps content clear of the notch in landscape
  return (
    <div className="fixed inset-x-0 top-0 h-dvh flex flex-col scroll-smooth pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <Header />
      <div className="flex flex-1 min-h-0 w-full">
        <Sidebar />
        <RouterOutlet />
      </div>
      <BottomNav />
    </div>
  );
}

export default App;
