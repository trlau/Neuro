export default function DocsContent() {
    return (
      <div className="flex flex-col gap-12 max-w-4xl mx-auto">
        {/* Welcome */}
        <section id="welcome" className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Neuro</h1>
          <p className="text-gray-400 text-sm">
            Your AI Research Companion. Neuro helps you generate citations, summarize papers, and enhance your academic or research workflow.
          </p>
        </section>
  
        {/* What is Neuro */}
        <section id="what-is-neuro" className="space-y-2">
          <h2 className="text-2xl font-semibold">What is Neuro?</h2>
          <p className="text-gray-400 text-sm">
            Neuro is an AI-powered research assistant that connects to Semantic Scholar’s massive academic database. 
            You can ask questions, generate paper summaries, pull citations, and create research notes all inside a clean UI.
          </p>
        </section>
  
        {/* How Neuro Works */}
        <section id="how-neuro-works" className="space-y-2">
          <h2 className="text-2xl font-semibold">How Neuro Works</h2>
          <p className="text-gray-400 text-sm">
            1. User prompts Neuro with a question or research topic.<br />
            2. Neuro queries Semantic Scholar’s API for matching papers.<br />
            3. Summaries are generated via in-house AI models.<br />
            4. Citations are formatted and returned automatically.
          </p>
        </section>
  
        {/* Features */}
        <section id="features" className="space-y-2">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="list-disc pl-5 text-gray-400 text-sm">
            <li>Fast citation generator from academic papers.</li>
            <li>Accurate paper summaries to save reading time.</li>
            <li>Interactive chat interface to refine searches.</li>
            <li>Document export tools for researchers and students.</li>
          </ul>
        </section>
  
        {/* FAQ */}
        <section id="faq" className="space-y-2">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <p className="text-gray-400 text-sm">
            <strong>Is Neuro free?</strong><br />
            Neuro is free to use during its early beta. Future plans may introduce premium features.<br /><br />
  
            <strong>What sources does Neuro use?</strong><br />
            Neuro queries only academic sources such as Semantic Scholar.<br /><br />
  
            <strong>Can I trust the summaries?</strong><br />
            Summaries are AI-assisted and should be used as a supplement, not a replacement, for direct reading.<br /><br />
  
            <strong>Where can I report bugs?</strong><br />
            Please contact us through the support link provided in the Settings page.
          </p>
        </section>
      </div>
    );
  }
  