import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { useRouter } from "next/router";

const Layout = () => {
  const router = useRouter();

  const handleSelectChat = (id: string) => {
    console.log("Switch to chat:", id);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar onSelectChat={handleSelectChat} onLogout={handleLogout} />
      <Chat />
    </div>
  );
};

export default Layout;
