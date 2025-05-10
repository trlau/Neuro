import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
   async headers() {
     return [
       {
         source: "/login",
         headers: [
           {
             key: "Cross-Origin-Embedder-Policy",
             value: "unsafe-none",
           },
         ],
       },
     ];
   },
 };

export default nextConfig;
