export default function DocsContent() {
    return (
      <div className="flex flex-col gap-12 max-w-4xl mx-auto">
        {/* Welcome */}
        <section id="welcome" className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Neuro</h1>
          <p className="text-gray-400 text-base">
            Neuro is your AI-powered research assistant. We help you find, summarize, and organize academic information quickly and simply. Our goal is to make research easier for everyone.
          </p>
        </section>
  
        {/* About Neuro */}
        <section id="about" className="space-y-2">
          <h2 className="text-2xl font-semibold">About Neuro</h2>
          <p className="text-gray-400 text-base">
            Neuro was founded in 2024 to help students, researchers, and professionals get more from academic literature. We connect you to trusted sources, provide clear summaries, and let you generate citations in seconds. Our team is small, but we care deeply about making research accessible and efficient.
          </p>
        </section>
  
        {/* How It Works */}
        <section id="how-it-works" className="space-y-2">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <ol className="list-decimal pl-5 text-gray-400 text-base space-y-1">
            <li>Ask Neuro a question or enter a research topic.</li>
            <li>Neuro searches academic databases for relevant papers.</li>
            <li>We use AI to summarize key findings and generate citations.</li>
            <li>You can export, save, or share your results.</li>
          </ol>
        </section>
  
        {/* Features */}
        <section id="features" className="space-y-2">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="list-disc pl-5 text-gray-400 text-base space-y-1">
            <li>Fast, accurate citation generator for academic papers.</li>
            <li>Clear, concise summaries of research articles.</li>
            <li>Interactive chat to refine your search and get follow-up answers.</li>
            <li>Export tools for saving and sharing your research sessions.</li>
            <li>Simple, distraction-free interface.</li>
          </ul>
        </section>
  
        {/* FAQ */}
        <section id="faq" className="space-y-2">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="text-gray-400 text-base space-y-3">
            <div>
              <strong>Is Neuro free?</strong>
              <div>Neuro is free to use while we are in beta. We may add paid features in the future, but core research tools will remain accessible.</div>
            </div>
            <div>
              <strong>Where does Neuro get its information?</strong>
              <div>We use trusted academic sources, including Semantic Scholar and other reputable databases.</div>
            </div>
            <div>
              <strong>How accurate are the summaries?</strong>
              <div>Our AI aims for clarity and accuracy, but always double-check important information. Use summaries as a guide, not a replacement for reading the original paper.</div>
            </div>
            <div>
              <strong>Who can use Neuro?</strong>
              <div>Anyone interested in research—students, academics, or lifelong learners.</div>
            </div>
          </div>
        </section>
  
        {/* Contact */}
        <section id="contact" className="space-y-2">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-gray-400 text-base">
            Have questions, feedback, or need support? Email us at <a href="mailto:support@neuroapp.ai" className="text-blue-400 underline">support@neuroapp.ai</a> and we'll get back to you soon.
          </p>
        </section>
      </div>
    );
  }
  