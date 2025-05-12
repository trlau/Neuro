# Neuro

**Neuro** is a free, open-source research assistant that makes academic literature accessible to everyone. No paywalls, no subscriptions - just straightforward access to research papers and AI-powered summaries.

## What You Can Do With Neuro

- **Ask Research Questions**: Get AI-powered answers backed by academic papers
- **Read Paper Summaries**: Understand complex research without reading 20+ pages
- **Find Related Papers**: Discover connected research and build your knowledge base
- **Generate Citations**: Get properly formatted citations in any style (APA, MLA, etc.)
- **Export Your Research**: Save and organize your findings for later use

## Current Status

This repository contains the frontend interface for Neuro. The backend service is currently hosted separately. In the future, we'll provide a Docker setup that combines both frontend and backend for self-hosting.

### Quick Start (Frontend Only)

```bash
# Clone and run the frontend
git clone https://github.com/trlau/neuro.git
cd neuro
npm install
npm run dev
```

> **Note**: You'll need to set up your own API keys for OpenAI and Semantic Scholar to use the full features.

### Future Docker Setup

We're working on a complete Docker setup that will include:
- Frontend interface (this repo)
- Backend server
- Database
- All necessary API integrations

This will allow you to run the entire Neuro stack locally or on your own server.

## Installation

### Prerequisites
- Node.js 14+
- npm 6+
- OpenAI API key
- Semantic Scholar API key

### Manual Setup

1. Clone and install:
   ```bash
   git clone https://github.com/trlau/neuro.git
   cd neuro
   npm install
   ```

2. Set up environment variables:
   ```env
OPENAI_API_KEY=your_key
SEMANTIC_SCHOLAR_API_KEY=your_key
   ```

3. Start the app:
   ```bash
   npm run dev
   ```

## Usage

1. Type your research question
2. Get AI-summarized answers with sources
3. Click through to read full papers
4. Export citations in your preferred format

## Why We Built This

Research shouldn't be locked behind paywalls. Whether you're a student, independent researcher, or just curious, Neuro gives you free access to academic papers and AI-powered summaries.

## Contributing

We welcome contributions to enhance Neuro's capabilities:

1. **Fork the Repository**: Click the 'Fork' button on GitHub.

2. **Create a Feature Branch**: 
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Changes**: 
   ```bash
   git commit -m 'Add new feature'
   ```

4. **Push to Branch**: 
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**: Submit your changes for review.

## License

MIT License - feel free to use this for any purpose.

## Support

Found a bug? Have a feature request? Open an issue or email support@neuroapp.ai
