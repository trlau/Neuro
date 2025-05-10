export default function DocsContent() {
    return (
      <div className="flex flex-col gap-12 max-w-4xl mx-auto">
        {/* Welcome */}
        <section id="welcome" className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Neuro</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Neuro is an advanced AI-powered research assistant designed to help you interact with academic literature fast. Our platform combines the latest artificial intelligence models with comprehensive academic databases to provide you with precise, relevant, and well-cited research insights.
          </p>
        </section>
  
        {/* About Neuro */}
        <section id="about" className="space-y-4">
          <h2 className="text-2xl font-semibold">About Neuro</h2>
          <div className="space-y-4 text-gray-400 text-base">
            <p>
              Founded in 2025, Neuro emerged from a vision to democratize academic research and make scholarly information more accessible. Our platform serves a diverse community of researchers, students, and professionals who value efficiency and accuracy in their research process.
            </p>
            <p>
              What sets Neuro apart is our commitment to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Academic integrity and proper citation practices</li>
              <li>Real-time access to peer-reviewed research</li>
              <li>AI-powered analysis that maintains scholarly rigor</li>
              <li>User-friendly interface designed for research efficiency</li>
            </ul>
          </div>
        </section>
  
        {/* How It Works */}
        <section id="how-it-works" className="space-y-4">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <div className="space-y-6">
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">1. Research Query</h3>
              <p className="text-gray-400">
                Enter your research question or topic. Our AI understands natural language queries and can handle complex research topics across various disciplines.
              </p>
            </div>
            
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">2. Intelligent Search</h3>
              <p className="text-gray-400">
                Neuro searches through academic databases, including Semantic Scholar, to find relevant papers and research materials. Our algorithm prioritizes peer-reviewed sources and recent publications.
              </p>
            </div>
            
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">3. AI Analysis</h3>
              <p className="text-gray-400">
                Our AI processes the research materials to generate comprehensive summaries, extract key findings, and identify important methodologies and conclusions.
              </p>
            </div>
            
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">4. Citation & Export</h3>
              <p className="text-gray-400">
                Generate properly formatted citations in multiple styles (APA, MLA, Chicago, etc.) and export your research findings in various formats for easy integration into your work.
              </p>
            </div>
          </div>
        </section>
  
        {/* Features */}
        <section id="features" className="space-y-4">
          <h2 className="text-2xl font-semibold">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">Smart Search</h3>
              <p className="text-gray-400">
                Advanced semantic search capabilities that understand context and research intent, delivering more relevant results than traditional keyword searches.
              </p>
            </div>
            
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">AI Summarization</h3>
              <p className="text-gray-400">
                Intelligent summarization that captures key points, methodologies, and conclusions while maintaining academic accuracy and context.
              </p>
            </div>
            
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">Citation Management</h3>
              <p className="text-gray-400">
                Automated citation generation in multiple formats with support for various academic styles and easy export options.
              </p>
            </div>
            
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">Research Organization</h3>
              <p className="text-gray-400">
                Tools for organizing research materials, creating collections, and managing references across multiple projects.
              </p>
            </div>
          </div>
        </section>
  
        {/* FAQ */}
        <section id="faq" className="space-y-4">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">Is Neuro free to use?</h3>
              <p className="text-gray-400">
                Neuro is currently in beta and offers free access to core features. We plan to introduce premium features in the future while maintaining essential research tools accessible to all users.
              </p>
            </div>
            
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">How accurate are the AI-generated summaries?</h3>
              <p className="text-gray-400">
                Our AI is trained on academic literature and undergoes regular validation against expert reviews. While summaries are designed to be accurate and comprehensive, we recommend reviewing original sources for critical research decisions.
              </p>
            </div>
            
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">What sources does Neuro use?</h3>
              <p className="text-gray-400">
                We primarily use Semantic Scholar and other reputable academic databases. Our sources include peer-reviewed journals, conference proceedings, and preprints from trusted repositories.
              </p>
            </div>
            
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-medium mb-3">Can I export my research?</h3>
              <p className="text-gray-400">
                Yes, Neuro supports multiple export formats including PDF, BibTeX, and plain text. You can also generate formatted citations in various academic styles.
              </p>
            </div>
          </div>
        </section>
  
        {/* Contact */}
        <section id="contact" className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact & Support</h2>
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-white/10">
            <p className="text-gray-400 mb-4">
              We're here to help you make the most of Neuro. Whether you have questions about features, need technical support, or want to provide feedback, our team is ready to assist you.
            </p>
            <div className="space-y-2">
              <p className="text-gray-400">
                <strong>Email:</strong> <a href="mailto:support@neuroapp.ai" className="text-blue-400 hover:text-blue-300 underline">support@neuroapp.ai</a>
              </p>
              <p className="text-gray-400">
                <strong>Documentation:</strong> <a href="/docs" className="text-blue-400 hover:text-blue-300 underline">Full Documentation</a>
              </p>
              <p className="text-gray-400">
                <strong>GitHub:</strong> <a href="https://github.com/trlau/neuro" className="text-blue-400 hover:text-blue-300 underline">View on GitHub</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
  