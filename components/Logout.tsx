import { logout } from "../lib/firebase";

export default function Logout() {
  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-500 text-white font-medium rounded-md"
    >
      Logout
    </button>
  );
}
