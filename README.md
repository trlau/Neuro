# Neuro

**Neuro** is an AI-driven research assistant designed to streamline the process of sourcing and summarizing academic literature. By integrating with Semantic Scholar, Neuro provides users with concise and relevant information based on their queries.

## Features

- **User Queries**: Submit research questions or topics of interest.
- **AI Summarization**: The AI engine condenses user prompts into brief summaries.
- **Semantic Scholar Integration**: Fetches pertinent academic sources to inform responses.
- **Source-Based Summaries**: Generates answers grounded in retrieved scholarly articles.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (version 6 or higher)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/trlau/neuro.git
   cd neuro
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root directory and add your API keys:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   SEMANTIC_SCHOLAR_API_KEY=your_semantic_scholar_api_key
   ```

4. **Start the Application**:

   ```bash
   npm run dev
   ```

   Access the application at `http://localhost:3000`.

## Usage

1. **Sign Up / Log In**: Create an account or log in to access the platform.
2. **Enter a Query**: Input your research question or topic.
3. **Select AI Engine**: Choose from available AI models for response generation.
4. **Receive Summarized Response**: View concise answers with cited sources.
5. **Access Full Articles**: Follow links to original research papers for in-depth reading.

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

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
