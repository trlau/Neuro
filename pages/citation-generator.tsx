import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../components/Layout"

export default function CitationGeneratorPage() {

    const router = useRouter();
        const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
      
        // Initialize selectedChatId from URL parameter when component mounts
        useEffect(() => {
          if (router.query.id && typeof router.query.id === "string") {
            setSelectedChatId(router.query.id);
          }
        }, [router.query.id]);

    return (
        <>
        <Layout selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId}>
            <div className="flex flex-col h-full w-full bg-gray-900 text-white">
              
            </div>
            
        </Layout>
        </>
    )
}