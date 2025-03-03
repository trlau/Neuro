import { loginWithGoogle, loginWithGitHub } from "../lib/firebase";

export default function Auth() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        {/* Branding */}
        <h2 className="text-3xl font-bold text-center text-white">Neuro</h2>
        <p className="text-center text-gray-400 mt-2">AI-Powered Research Assistant</p>

        {/* Sign-in Buttons */}
        <div className="mt-6 space-y-4">
          <button
            onClick={loginWithGoogle}
            className="flex items-center justify-center w-full px-5 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all duration-200"
          >
            Continue with Google
          </button>

          <button
            onClick={loginWithGitHub}
            className="flex items-center justify-center w-full px-5 py-3 text-lg font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200"
          >
            Continue with GitHub
          </button>
        </div>

        {/* Terms & Privacy */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          By signing in, you agree to our{" "}
          <a href="#" className="text-blue-400 hover:underline">Terms</a> and{" "}
          <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
