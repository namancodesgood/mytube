import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";

import RouterOutlet from "@/routes/RouterOutlet";

function App() {
  return (
    <div className="fixed w-full h-screen scroll-smooth flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0 w-full">
        <Sidebar />
        <RouterOutlet />
      </div>
    </div>
  );
}

export default App;
