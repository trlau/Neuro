import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import {motion} from "motion/react";
import { loginWithGoogle, loginWithGitHub } from "../lib/firebase";
import MultiStateBadge from "./motion/MultiStateBadge";

export default function Auth({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex h-screen w-screen items-center justify-center bg-gray-900", className)} {...props}>
      <motion.div initial={{transform: "translateY(20px)", opacity:0}} animate={{transform: "translateY(0px)", opacity:1}} transition={{duration:0.6}}>
        <form className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg flex flex-col gap-6">
          {/* Branding */}
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6 text-white" />
              </div>
              <span className="sr-only">Neuro</span>
            </a>
            <h1 className="text-3xl font-bold text-white">Welcome to Neuro</h1>
            <p className="text-center text-gray-400 text-sm">AI-Powered Research Assistant</p>
          </div>

          {/* Email Login */}
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
              Login
            </Button>
            
          </div>

          {/* Divider */}
          <div className="relative text-center text-sm text-gray-400">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative px-4 bg-gray-800 text-gray-400">
              Or
            </div>
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-4 w-full">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white border-none"
              onClick={loginWithGoogle}
            >
              {/* Google Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              Continue with Google
            </Button>


            <Button
              variant="outline"
              className="w-full flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white border-none"
              onClick={loginWithGitHub}
            >
              {/* GitHub Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Continue with GitHub
            </Button>
          </div>

          {/* Terms and Privacy */}
          <p className="text-center text-xs text-gray-400">
            By clicking continue, you agree to our{" "}
            <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
