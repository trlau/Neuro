import { loginWithGoogle, loginWithGitHub } from "../lib/firebase";

export default function Auth() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center">Sign in to Neuro</h2>
        <button
          onClick={loginWithGoogle}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md"
        >
          Sign in with Google
        </button>
        <button
          onClick={loginWithGitHub}
          className="mt-2 w-full px-4 py-2 bg-gray-700 text-white font-medium rounded-md"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
