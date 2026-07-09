// ---------------------------------------------------------------------------
// AI Infra & Tooling — 4 topics x 15 questions
// ---------------------------------------------------------------------------

export const langchainAgentsQuestions = [
  {
    id: "infra-langchain-01",
    topicId: "langchain-agents",
    question: "What is LangChain and what problem does it solve for LLM application developers?",
    options: [
      "A framework that provides composable abstractions for building LLM-powered applications — handling chains of prompts, memory, tool use, and retrieval pipelines without boilerplate",
      "A programming language specifically designed for writing prompts for large language models",
      "A cloud hosting service that deploys LLM models on behalf of developers",
      "A fine-tuning library that automates the process of training custom LLMs on proprietary data"
    ],
    correctIndex: 0,
    explanation: "LangChain provides building blocks (LLMs, prompts, chains, memory, tools, vector stores, agents) with a unified interface that works with many providers (OpenAI, Anthropic, HuggingFace, etc.). It eliminates boilerplate for common patterns like RAG, conversation memory, and multi-tool agents, accelerating development of LLM applications."
  },
  {
    id: "infra-langchain-02",
    topicId: "langchain-agents",
    question: "What is an 'LLM Agent' in the context of frameworks like LangChain?",
    options: [
      "An LLM that can decide which tools to use and in what order, executing multi-step workflows autonomously by reasoning about the current state and available actions",
      "A human operator who monitors and manually triggers LLM API calls on behalf of users",
      "A specialized fine-tuned model that only performs agent-specific tasks like scheduling",
      "A wrapper class that adds retry logic and error handling around a single LLM API call"
    ],
    correctIndex: 0,
    explanation: "An LLM agent uses the model's reasoning ability to select actions (tool calls) from a predefined set, observe results, and decide next steps — looping until a goal is achieved. Unlike chains (fixed sequences of steps), agents dynamically determine the execution path based on the LLM's reasoning, enabling flexible multi-step task completion."
  },
  {
    id: "infra-langchain-03",
    topicId: "langchain-agents",
    question: "What is the 'ReAct' agent pattern and how does it work in LangChain?",
    options: [
      "Alternating Thought (reasoning step) → Action (tool call) → Observation (tool result) in a loop until the agent decides to emit a final answer",
      "A React.js integration that renders LLM outputs directly in a browser component",
      "A reactive programming pattern where the LLM subscribes to data stream events and reacts to changes",
      "A technique where the agent reacts differently based on the user's emotional tone detected in the input"
    ],
    correctIndex: 0,
    explanation: "ReAct agents produce a Thought explaining their reasoning, then select an Action (tool name + input), receive the tool's Observation, and continue this loop until they produce a Final Answer. LangChain's AgentExecutor orchestrates this loop, parsing the LLM's output for the action/observation format and calling the appropriate tools."
  },
  {
    id: "infra-langchain-04",
    topicId: "langchain-agents",
    question: "What is 'LangGraph' and how does it differ from LangChain's basic chain/agent abstractions?",
    options: [
      "A LangChain extension for building stateful, multi-actor workflows as directed graphs — enabling loops, conditional branching, human-in-the-loop, and persistent state between steps",
      "A data visualization library that renders LangChain execution traces as interactive graphs",
      "A graph database integration that allows LangChain agents to query Neo4j or similar stores",
      "A tool for visualizing the attention graphs of transformer models used within LangChain pipelines"
    ],
    correctIndex: 0,
    explanation: "LangGraph models agent workflows as directed graphs where nodes are processing steps (LLM calls, tools, human approvals) and edges encode control flow (including conditionals and loops). Unlike chains (which execute sequentially) or basic agents (single-loop), LangGraph supports complex multi-step workflows with persistent state, human intervention points, and parallel branches."
  },
  {
    id: "infra-langchain-05",
    topicId: "langchain-agents",
    question: "What is 'memory' in LangChain and what types exist?",
    options: [
      "A component that persists information across conversation turns; types include ConversationBufferMemory (all messages), ConversationSummaryMemory (LLM-compressed history), and VectorStoreMemory (semantic retrieval of past turns)",
      "A hardware optimization that caches model weights in GPU RAM to reduce model loading time",
      "The context window itself, referred to as memory because it temporarily holds prompt content",
      "A Redis or database integration that stores user preferences between sessions"
    ],
    correctIndex: 0,
    explanation: "LangChain memory components manage how conversation history is stored and retrieved. Buffer memory keeps all messages (limited by context window). Summary memory compresses old turns into a summary (extending effective memory). Entity memory tracks named entities. Vector memory retrieves relevant past turns by similarity. Each trades accuracy for token efficiency differently."
  },
  {
    id: "infra-langchain-06",
    topicId: "langchain-agents",
    question: "What is 'tool calling' (function calling) in modern LLM APIs, and why is it preferable to text-parsed tool use?",
    options: [
      "A native API feature where the model outputs structured JSON matching a predefined function schema, guaranteeing parseable tool selection without regex hacking — more reliable and less prompt-engineering than text-based tool parsing",
      "An API feature that allows the LLM to call Python functions directly during generation for real-time computation",
      "A technique for chaining multiple LLMs together by calling one model's API from another",
      "A specialized prompt format that instructs the model to generate syntactically valid function calls in any programming language"
    ],
    correctIndex: 0,
    explanation: "Function/tool calling (OpenAI, Anthropic, Gemini, etc.) trains the model to output structured JSON like {name: 'search_web', arguments: {query: 'latest AI news'}} rather than embedding tool calls in free text. This eliminates brittle regex parsing, provides a typed schema for arguments, and makes multi-tool selection reliable — a major improvement over text-based tool parsing."
  },
  {
    id: "infra-langchain-07",
    topicId: "langchain-agents",
    question: "What is 'AutoGPT' / autonomous agent style and what are its main limitations in practice?",
    options: [
      "Fully autonomous agents that plan and execute long multi-step tasks with minimal human oversight — limited by error accumulation, hallucination-driven bad decisions, and lack of recovery mechanisms for failures",
      "An automatic prompt optimization system that fine-tunes GPT models without human involvement",
      "A code generation system that automatically generates and runs Python scripts based on user goals",
      "An agent that automatically selects the best GPT model version for each query based on complexity"
    ],
    correctIndex: 0,
    explanation: "Autonomous agents (AutoGPT, BabyAGI style) attempt to complete high-level goals over many steps without human intervention. In practice, they suffer from: error cascades (small mistakes compound over many steps), hallucination-driven dead ends, excessive token consumption, and poor handling of ambiguous or changing goals. Production systems typically add human-in-the-loop checkpoints."
  },
  {
    id: "infra-langchain-08",
    topicId: "langchain-agents",
    question: "What is 'Multi-Agent' architecture and when is it beneficial over a single agent?",
    options: [
      "Using multiple specialized LLM agents collaborating on a task — beneficial for tasks too complex for one context window, requiring parallel work, or needing diverse specialized expertise (e.g., a coder agent + a reviewer agent + a tester agent)",
      "Running the same agent multiple times with different random seeds and taking the consensus result",
      "Using multiple smaller LLMs to replace one large LLM to reduce inference cost",
      "A technique where one agent handles input parsing and another handles output formatting"
    ],
    correctIndex: 0,
    explanation: "Multi-agent systems split complex tasks among specialized agents that communicate via a shared workspace or message queue. Benefits: each agent has focused context (avoiding context overload), work can be parallelized, agents can review each other's output (critic-agent pattern), and specialist agents outperform generalists on domain-specific subtasks. Frameworks like LangGraph, CrewAI, and AutoGen support this."
  },
  {
    id: "infra-langchain-09",
    topicId: "langchain-agents",
    question: "What is a 'retrieval tool' in an agent context, and how does it differ from a standard RAG pipeline?",
    options: [
      "A retrieval tool is one tool among many that an agent can call conditionally; standard RAG always retrieves before generation. The agent decides when retrieval is needed, avoiding unnecessary lookups for queries answerable from parametric memory",
      "A retrieval tool uses keyword search while standard RAG uses semantic search",
      "A retrieval tool retrieves from the web while standard RAG retrieves from a local knowledge base",
      "There is no meaningful difference; retrieval tool and RAG are different names for the same pattern"
    ],
    correctIndex: 0,
    explanation: "In a fixed RAG pipeline, retrieval always runs regardless of the query. In an agent with a retrieval tool, the LLM decides whether to invoke the retrieval tool based on its assessment of whether external knowledge is needed. This avoids unnecessary retrieval for queries the model can answer directly (e.g., 'What is 2+2?') and supports multi-hop retrieval when needed."
  },
  {
    id: "infra-langchain-10",
    topicId: "langchain-agents",
    question: "What is 'LangSmith' and what role does it play in LLM application development?",
    options: [
      "An observability and debugging platform for LangChain applications — providing traces of every LLM call, tool use, and chain step, enabling evaluation, regression testing, and performance monitoring in production",
      "A marketplace for pre-built LangChain chains and agents contributed by the community",
      "A fine-tuning platform that automates training runs based on LangChain evaluation results",
      "A browser extension that logs LLM API calls made by any web application"
    ],
    correctIndex: 0,
    explanation: "LangSmith provides end-to-end visibility into LLM applications: tracing shows the full execution tree (input/output of every LLM call, tool, and prompt), evaluation runs tests against labeled datasets, comparison views show prompt or model changes' effects, and production monitoring tracks latency, cost, and error rates over time."
  },
  {
    id: "infra-langchain-11",
    topicId: "langchain-agents",
    question: "What is 'Guardrails' or 'constitutional AI' checking in agent frameworks?",
    options: [
      "Safety checks that validate agent inputs and outputs against policy constraints (content moderation, data leakage, PII detection) before/after LLM calls — implemented as pre/post-processors in the pipeline",
      "Legal compliance software that ensures LLM applications meet GDPR and HIPAA requirements",
      "A fine-tuning technique that embeds safety rules directly into model weights during training",
      "Hardware-level monitoring that prevents GPU power consumption from exceeding safe thresholds"
    ],
    correctIndex: 0,
    explanation: "Guardrails AI, NVIDIA NeMo Guardrails, and similar tools add validation layers around LLM calls that can: filter inappropriate inputs/outputs, detect PII, enforce topic restrictions, verify output format conformance, and route to safe responses when policies are violated. They're implemented as middleware in the pipeline, separate from (but complementary to) the model's own RLHF-based safety training."
  },
  {
    id: "infra-langchain-12",
    topicId: "langchain-agents",
    question: "What is 'structured output' generation (JSON mode) and why is it critical for agents?",
    options: [
      "Constraining the LLM to generate only valid JSON matching a specified schema — critical for agents because tool call arguments, state updates, and reasoning outputs need to be programmatically parsed without brittle text extraction",
      "A model feature that organizes output into paragraphs, bullet points, and headers automatically",
      "A post-processing step that converts any LLM output format to JSON after generation",
      "A database schema definition language used to describe the format of knowledge base documents"
    ],
    correctIndex: 0,
    explanation: "Agents depend on parsing LLM outputs to decide next actions. Unstructured text requires fragile regex or LLM-based parsing. Structured output (OpenAI's json_schema mode, Anthropic's tool-use, or libraries like Instructor/Outlines) constrains generation to valid JSON at the token level using constrained decoding — making agent state management and tool dispatch reliable and deterministic."
  },
  {
    id: "infra-langchain-13",
    topicId: "langchain-agents",
    question: "What is 'CrewAI' and how does its mental model differ from LangChain's?",
    options: [
      "CrewAI uses a crew/role metaphor — defining agents as team members with specific roles, backstories, and goals collaborating on a task — abstracting away graph-based orchestration for a more human-readable configuration",
      "CrewAI is a visual interface for building LangChain pipelines without writing code",
      "CrewAI is a performance benchmarking tool that compares different LLM agent frameworks",
      "CrewAI handles only customer service use cases, specialized for enterprise helpdesk automation"
    ],
    correctIndex: 0,
    explanation: "CrewAI provides a higher-level abstraction than LangChain's component-level approach. Developers define 'agents' with roles (e.g., 'Senior Researcher'), backstories, and goals, then assemble them into a 'Crew' with a shared task. The framework handles inter-agent communication and task delegation, making it easier to design multi-agent systems through organizational metaphors rather than explicit graph wiring."
  },
  {
    id: "infra-langchain-14",
    topicId: "langchain-agents",
    question: "What is 'Semantic Kernel' and how does it position relative to LangChain?",
    options: [
      "Microsoft's open-source LLM orchestration framework with enterprise features (plugins, planners, memory), offering SDKs in Python, C#, and Java — positioned as a more enterprise-ready alternative to LangChain with tighter Azure integration",
      "A kernel upgrade for Linux systems that enables efficient GPU memory access for LLM inference",
      "A semantic search engine built by Microsoft for querying enterprise document repositories",
      "A fine-tuning framework for creating domain-specific versions of smaller language models"
    ],
    correctIndex: 0,
    explanation: "Semantic Kernel (SK) is Microsoft's answer to LangChain, with key differences: multi-language SDKs (Python, C#, Java), a strong enterprise focus, native Azure OpenAI integration, a planner component that decomposes goals into plugin calls, and a 'memory' system with connectors to various vector stores. It's particularly popular in .NET enterprise environments."
  },
  {
    id: "infra-langchain-15",
    topicId: "langchain-agents",
    question: "What is 'context management' and 'token budget management' in long-running agent systems?",
    options: [
      "Strategies for keeping the agent's context window within token limits over many steps — including summarization of older turns, selective retention of key observations, and choosing when to start a fresh context vs. continuing",
      "A cloud billing feature that sets spending limits on LLM API usage per agent session",
      "A technique that compresses all tool outputs to a maximum token length before adding them to context",
      "A load balancing mechanism that routes agent requests to different model instances based on context load"
    ],
    correctIndex: 0,
    explanation: "Long-running agents accumulate tool outputs, observations, and thoughts that can exceed the context window. Context management strategies include: summarizing old history with an LLM call, persisting important state to external storage (retrieving on demand), using sliding window memory, or strategically discarding intermediate observations once their information is no longer needed."
  }
];

export const vectorDatabasesQuestions = [
  {
    id: "infra-vectordb-01",
    topicId: "vector-databases",
    question: "What is a vector database and how does it differ from a traditional relational database?",
    options: [
      "A vector database stores high-dimensional embedding vectors and specializes in approximate nearest neighbor search; relational DBs store structured tabular data and excel at exact SQL queries",
      "A vector database stores data in a columnar format for faster analytics; relational DBs use row-based storage",
      "A vector database is a distributed version of a traditional database that runs on a GPU cluster",
      "A vector database is a NoSQL document store optimized for JSON documents and full-text search"
    ],
    correctIndex: 0,
    explanation: "Vector databases (Pinecone, Qdrant, Weaviate, Chroma, Milvus) are purpose-built for storing and querying embedding vectors. Their core operation is ANN (approximate nearest neighbor) search — 'find the 10 vectors most similar to this query vector' — which relational databases cannot do efficiently. They also support metadata filtering alongside vector search."
  },
  {
    id: "infra-vectordb-02",
    topicId: "vector-databases",
    question: "What are the key operations a vector database must support for a RAG application?",
    options: [
      "Upsert (insert or update vectors with metadata), Query (ANN search with optional metadata filters), Delete (remove vectors by ID or filter), and optionally Fetch (retrieve a specific vector by ID)",
      "CREATE TABLE, INSERT, SELECT with JOIN, UPDATE, and DELETE in SQL syntax",
      "PUSH (add to queue), POP (retrieve in order), PEEK (inspect next item without removal)",
      "TRAIN (build index), PREDICT (classify new vectors), EVALUATE (measure index quality)"
    ],
    correctIndex: 0,
    explanation: "A RAG system needs to: add embedded document chunks (upsert), find chunks similar to a query embedding (ANN search), filter by metadata like date or source (metadata filtering), and occasionally delete outdated documents. Vector databases optimize all these operations while relational databases offer none of the vector-specific capabilities."
  },
  {
    id: "infra-vectordb-03",
    topicId: "vector-databases",
    question: "What is 'FAISS' (Facebook AI Similarity Search) and how does it relate to dedicated vector databases?",
    options: [
      "FAISS is an open-source library for efficient similarity search and clustering of dense vectors; it provides the core ANN algorithms (IVF, HNSW, PQ) that many vector databases build upon, but without persistence, replication, or server functionality",
      "FAISS is a cloud-hosted vector database service offered by Meta for production use",
      "FAISS is a standardized query language for querying any vector database, similar to SQL",
      "FAISS is a fine-tuning framework that creates specialized embedding models for different domains"
    ],
    correctIndex: 0,
    explanation: "FAISS (Facebook AI Research) is a C++/Python library implementing many ANN algorithms (IVF, HNSW, flat, PQ, etc.) optimized for both CPU and GPU. It's excellent for research and single-machine use. Production vector databases like Milvus and Weaviate use FAISS or its algorithms internally but add persistence, replication, real-time updates, distributed search, and REST/gRPC APIs."
  },
  {
    id: "infra-vectordb-04",
    topicId: "vector-databases",
    question: "What is Pinecone, and what does 'serverless' mode mean in the context of vector databases?",
    options: [
      "Pinecone is a managed cloud vector database; serverless mode automatically scales storage and compute to zero when idle and up on demand, charging only for actual usage rather than reserved capacity",
      "Pinecone is an on-premises vector database that runs without a server process, using file-based storage",
      "Serverless means the vector database runs inside the application process without network overhead",
      "Pinecone's serverless mode removes the need for an embedding model by using rule-based similarity"
    ],
    correctIndex: 0,
    explanation: "Pinecone is a fully managed vector database (no infrastructure management). Its serverless tier decouples storage from compute — indexes sleep when inactive (no cost), scale instantly on query traffic, and charge per query rather than per reserved pod. This is ideal for applications with variable query load, contrast with dedicated pods which reserve fixed compute regardless of usage."
  },
  {
    id: "infra-vectordb-05",
    topicId: "vector-databases",
    question: "What is Chroma DB and why is it popular for local development and prototyping?",
    options: [
      "An open-source, embeddable vector database that runs in-process (no server required) with a simple Python API — perfect for quick prototyping, local development, and small-scale applications without infrastructure setup",
      "A cloud-first vector database with built-in automatic embedding generation requiring no local model installation",
      "A vector database optimized for storing and searching image and video embeddings",
      "A distributed vector database designed for multi-region deployments in enterprise environments"
    ],
    correctIndex: 0,
    explanation: "Chroma can run entirely in-memory or persist to disk as a local file, embedded within a Python application with zero external dependencies. Its `chromadb` pip package gives you a full vector database in seconds. While not designed for production scale (millions of vectors), it's the go-to choice for building and testing RAG prototypes locally before migrating to Pinecone or Qdrant for production."
  },
  {
    id: "infra-vectordb-06",
    topicId: "vector-databases",
    question: "What is Weaviate, and what makes it different from other vector databases?",
    options: [
      "Weaviate is an open-source vector database with a graph-like schema that links objects via references, supports multi-modal search (text, images), and can auto-vectorize content using integrated modules (OpenAI, Cohere, Hugging Face embeddings)",
      "Weaviate is a relational database that adds vector extension columns to standard SQL tables",
      "Weaviate is a time-series database that uses vector indexing to speed up anomaly detection queries",
      "Weaviate is a distributed graph database that replaces embeddings with graph traversal for similarity"
    ],
    correctIndex: 0,
    explanation: "Weaviate distinguishes itself with a schema-based data model (objects with typed properties), cross-references between objects (graph-like structure), vectorizer modules that auto-embed data during import, and hybrid search combining BM25 + vector search out of the box. It supports multi-modal data and has built-in generative search (calling an LLM to answer from retrieved objects)."
  },
  {
    id: "infra-vectordb-07",
    topicId: "vector-databases",
    question: "What is Qdrant, and what is 'payload filtering' in its context?",
    options: [
      "Qdrant is a Rust-based vector database; payload filtering allows pre- or post-filtering vector search results using arbitrary JSON metadata attached to each vector — enabling targeted retrieval within subsets of the collection",
      "Qdrant is a queue-based data processing system; payload filtering removes invalid or malformed messages before processing",
      "Qdrant is a Python library; payload filtering encrypts sensitive vector data before storage",
      "Qdrant is a cloud vector database; payload filtering removes low-relevance vectors based on a confidence threshold"
    ],
    correctIndex: 0,
    explanation: "Qdrant (written in Rust for performance) stores JSON payloads alongside each vector and builds optimized indexes for payload fields. Payload filtering allows queries like 'find the 10 most similar vectors to this query, but only among vectors where payload.source = \"legal\" and payload.date > 2024'. This is essential for multi-tenant applications and domain-scoped retrieval."
  },
  {
    id: "infra-vectordb-08",
    topicId: "vector-databases",
    question: "What is 'pgvector' and when would you choose it over a dedicated vector database?",
    options: [
      "A PostgreSQL extension that adds vector storage and ANN search capabilities to Postgres; preferred when you already use Postgres, want transactional consistency between vector and relational data, and don't need billion-scale vector search",
      "A Python library that converts pandas DataFrames into vector embeddings for machine learning",
      "A visualization tool for plotting high-dimensional vectors in 2D/3D using PCA or TSNE",
      "A vector database built on PostgreSQL's write-ahead log for real-time change data capture"
    ],
    correctIndex: 0,
    explanation: "pgvector extends PostgreSQL with a vector type, L2/cosine/inner-product distance operators, and IVFFlat/HNSW index support. If your application already uses Postgres (for users, products, etc.) and has moderate vector search needs (millions vs. billions of vectors), pgvector avoids introducing a separate database service — you get ACID transactions, JOINs between tables, and vector search in one system."
  },
  {
    id: "infra-vectordb-09",
    topicId: "vector-databases",
    question: "What is 'namespace isolation' in Pinecone, and what production use case does it enable?",
    options: [
      "Logically separating vectors within an index by namespace, so that searches are scoped to a specific namespace — enabling multi-tenant applications where each customer's data is isolated without separate index deployments",
      "Network-level isolation that prevents unauthorized external access to the vector database API",
      "A backup strategy that maintains isolated snapshots of the vector index at different timestamps",
      "CPU/memory namespace separation to prevent one query from impacting another's performance"
    ],
    correctIndex: 0,
    explanation: "Pinecone namespaces partition a single index into isolated partitions. A SaaS application can store all customers' vectors in one index but use customer_id as the namespace — so Company A's search only returns Company A's documents. This is more cost-efficient than separate indexes per customer and simplifies operations (single index to manage) while maintaining data isolation."
  },
  {
    id: "infra-vectordb-10",
    topicId: "vector-databases",
    question: "What is 'real-time ingestion' vs. 'batch indexing' in vector databases and what tradeoff exists?",
    options: [
      "Real-time: insert individual vectors immediately (high freshness, lower throughput per operation); batch: bulk-insert thousands of vectors in one operation (more efficient, delayed freshness) — production systems often use both depending on document update frequency",
      "Real-time uses streaming APIs; batch uses REST APIs — both have identical performance characteristics",
      "Real-time indexing uses approximate methods; batch indexing builds an exact index for perfect recall",
      "Real-time only works for text data; batch indexing supports all data types including images"
    ],
    correctIndex: 0,
    explanation: "Real-time ingestion updates the index immediately when a document changes, maintaining freshness for rapidly updating knowledge bases. However, individual upserts are slower per vector than bulk operations. Batch ingestion processes large document sets efficiently (thousands of vectors in one API call) but has higher latency to availability. Most production systems batch during initial indexing and use real-time for incremental updates."
  },
  {
    id: "infra-vectordb-11",
    topicId: "vector-databases",
    question: "What is 'vector index freshness' and the 'replication vs. consistency' tradeoff in distributed vector databases?",
    options: [
      "Freshness is how recently the index reflects the latest upserts; distributed databases trade between strong consistency (all replicas synchronized before acknowledging writes, slower) and eventual consistency (faster writes, temporary read staleness)",
      "Freshness refers to the age of the embedding model; replication copies the model weights across servers",
      "The tradeoff between having a large index (high recall) vs. a small fresh index (fast queries)",
      "Whether to replicate the vector index or the original documents across data centers"
    ],
    correctIndex: 0,
    explanation: "In distributed vector databases (Milvus, Weaviate cluster, Qdrant distributed), writes must propagate to replicas. Strong consistency guarantees any read sees the latest write (at the cost of write latency). Eventual consistency allows faster writes but a read immediately after a write might return slightly stale results. RAG applications typically tolerate eventual consistency since a few seconds of staleness is acceptable for document indexing."
  },
  {
    id: "infra-vectordb-12",
    topicId: "vector-databases",
    question: "What is Milvus, and what distinguishes it from lighter-weight options like Chroma?",
    options: [
      "Milvus is a production-grade, cloud-native vector database designed for billion-scale vectors with distributed architecture, Kubernetes deployment, multiple ANN index types, and enterprise features like role-based access control",
      "Milvus is a specialized vector database only for image and video embeddings, not text",
      "Milvus is an in-memory-only vector database with no persistence, optimized for low-latency inference",
      "Milvus is a wrapper around FAISS that adds a simple REST API for single-machine deployments"
    ],
    correctIndex: 0,
    explanation: "Milvus (LF AI Foundation project) is designed for production scale: it separates compute and storage, runs on Kubernetes, supports multiple ANN index types (HNSW, IVF, DiskANN for disk-based billion-scale search), offers rich filtering, multi-vector search, and enterprise security. Chroma and FAISS are excellent for prototyping/small scale; Milvus is for billion-scale production deployments."
  },
  {
    id: "infra-vectordb-13",
    topicId: "vector-databases",
    question: "What is 'DiskANN' and what problem does it solve for large-scale vector search?",
    options: [
      "An ANN algorithm that stores the graph index primarily on SSD rather than RAM, enabling billion-scale vector search with a fraction of the memory cost of HNSW while maintaining competitive recall and query performance",
      "An algorithm that computes approximate distances using disk-based lookup tables instead of vector arithmetic",
      "A cloud service that auto-scales vector search by offloading queries to disk when RAM is insufficient",
      "A quantization technique that reduces vector dimensions by mapping them to disk sector addresses"
    ],
    correctIndex: 0,
    explanation: "HNSW requires storing the full graph index in RAM — at 1 billion 768-dim float32 vectors, that's ~3TB, impractical for most systems. DiskANN (Microsoft Research) stores the graph on SSD with only a small in-memory cache, achieving comparable recall to in-memory HNSW but with 100x less RAM. It enables billion-scale search on commodity hardware and is used in Azure AI Search and Milvus."
  },
  {
    id: "infra-vectordb-14",
    topicId: "vector-databases",
    question: "What is 'multi-vector' or 'late interaction' retrieval (e.g., ColBERT) in vector databases, and how do databases like Qdrant support it?",
    options: [
      "Storing multiple vectors per document (one per token) and computing relevance via MaxSim (max cosine similarity between each query token and all document tokens) — Qdrant supports this via multi-vector payloads and late interaction scoring",
      "Searching multiple vector databases simultaneously and merging results using RRF",
      "Storing different embedding model versions of the same document and querying all simultaneously",
      "A technique where each query generates multiple vectors and all are used for separate searches"
    ],
    correctIndex: 0,
    explanation: "ColBERT stores one embedding per token (vs. one per document), enabling fine-grained term-level matching. The relevance score sums the max-similarity between each query token embedding and the best-matching document token embedding. Qdrant's multi-vector support and Vespa's native ColBERT scoring enable this in production. The tradeoff is much higher storage (one document's token vectors vs. one document vector)."
  },
  {
    id: "infra-vectordb-15",
    topicId: "vector-databases",
    question: "What is 'vector database observability' and what metrics should be monitored in production?",
    options: [
      "Monitoring query latency (p50/p95/p99), QPS throughput, recall@k quality, index freshness lag, storage utilization, memory usage, and replication health — critical for maintaining SLA in production RAG systems",
      "Tracking the semantic drift of stored vectors over time to ensure embedding model compatibility",
      "Monitoring the LLM's generation quality metrics as a proxy for vector database retrieval quality",
      "Observing hardware temperatures and power consumption of GPU nodes running vector indexes"
    ],
    correctIndex: 0,
    explanation: "Production vector databases need standard infrastructure observability (latency percentiles, throughput, storage, memory) plus vector-specific metrics: retrieval recall (are the right documents being found?), index freshness (how quickly do new documents become searchable?), and query quality (using eval frameworks like RAGAS). Most vector databases expose Prometheus metrics or have native monitoring dashboards."
  }
];

export const modelDeploymentApiQuestions = [
  {
    id: "infra-deploy-01",
    topicId: "model-deployment-apis",
    question: "What is 'model serving' and what makes it different from regular web API development?",
    options: [
      "Model serving handles the unique requirements of ML inference: batching multiple requests for GPU efficiency, managing GPU memory for large models, optimizing throughput vs. latency tradeoffs, and handling model-specific formats (tokenization, tensor operations)",
      "Model serving is identical to web API development but uses different programming languages like Julia or Rust",
      "Model serving only applies to batch prediction jobs run on scheduled intervals, not real-time APIs",
      "Model serving requires no special infrastructure beyond a standard Node.js or Flask web server"
    ],
    correctIndex: 0,
    explanation: "LLM serving has unique challenges: models are gigabytes of weights that must fit in GPU memory, inference requires specialized hardware (GPUs/TPUs), efficient batching dramatically improves throughput, and latency optimization requires techniques like continuous batching, KV cache management, and speculative decoding — none of which standard web frameworks handle."
  },
  {
    id: "infra-deploy-02",
    topicId: "model-deployment-apis",
    question: "What is 'continuous batching' (also called iteration-level scheduling) and why is it important for LLM throughput?",
    options: [
      "Adding new requests to a batch mid-generation when some sequences finish, rather than waiting for all sequences in a batch to complete before starting new ones — dramatically increasing GPU utilization",
      "Continuously streaming tokens to the client as they are generated rather than waiting for the full response",
      "Batching embedding computations across multiple GPU nodes for distributed inference",
      "A technique that continuously retrains the model on new incoming data during serving"
    ],
    correctIndex: 0,
    explanation: "Traditional static batching waits for all requests in a batch to finish before starting new ones. Since LLM outputs have variable length, fast sequences waste GPU time waiting for slow ones. Continuous batching (used in vLLM, TGI) slots in new requests as others complete, keeping the GPU continuously utilized and dramatically improving throughput (often 10-20x vs. naive serving)."
  },
  {
    id: "infra-deploy-03",
    topicId: "model-deployment-apis",
    question: "What is 'PagedAttention' (used in vLLM) and what memory problem does it solve?",
    options: [
      "Managing KV cache memory in non-contiguous blocks (like OS virtual memory paging), eliminating GPU memory fragmentation and enabling efficient sharing of KV cache across parallel requests — allowing much higher throughput",
      "Paginating long model outputs into chunks of fixed length for streaming to clients",
      "A technique that offloads KV cache to CPU RAM when GPU memory is exhausted during long generation",
      "Splitting the attention computation across pages of the model's context window for parallelism"
    ],
    correctIndex: 0,
    explanation: "Standard serving pre-allocates KV cache as contiguous GPU memory for maximum sequence length, wasting memory on unused positions. PagedAttention (vLLM, 2023) manages KV cache in fixed-size blocks stored in non-contiguous memory (like OS page tables), virtually eliminating internal and external fragmentation. This enables serving 24x more requests concurrently compared to naive KV cache allocation."
  },
  {
    id: "infra-deploy-04",
    topicId: "model-deployment-apis",
    question: "What is 'speculative decoding' and how does it speed up autoregressive LLM generation?",
    options: [
      "A small fast 'draft' model generates multiple candidate tokens; a large 'target' model verifies them in parallel — accepting correct tokens and regenerating from the first wrong one, achieving target-model quality at draft-model speed",
      "The model speculatively caches likely future tokens based on the current context, retrieving them instead of generating",
      "Multiple models run in parallel on the same input and their outputs are merged via voting for faster consensus",
      "A technique that skips computation for tokens that haven't changed from the previous forward pass"
    ],
    correctIndex: 0,
    explanation: "Autoregressive generation is sequential — one token at a time. Speculative decoding (Leviathan et al., 2023) uses a small draft model to propose k tokens quickly, then the large target model verifies all k tokens in a single forward pass (parallel, since their positions are known). If the target accepts m tokens (m ≤ k), generation advances m steps per target model call, achieving 2-4x speedup."
  },
  {
    id: "infra-deploy-05",
    topicId: "model-deployment-apis",
    question: "What is 'model quantization' for deployment and what are the common formats?",
    options: [
      "Reducing weight precision from float32 to lower precision (int8, int4, GPTQ, AWQ, GGUF) to reduce model size and memory requirements, enabling deployment on smaller hardware with modest quality degradation",
      "Converting model weights from PyTorch format to TensorFlow format for cross-framework compatibility",
      "A technique that replaces attention layers with more efficient alternatives during deployment",
      "Pruning a percentage of model weights to zero to create a sparse model for faster inference"
    ],
    correctIndex: 0,
    explanation: "Quantization maps float32 weights (4 bytes/weight) to int8 (1 byte, 4x compression) or int4 (0.5 bytes, 8x compression). LLaMA 3 8B in float16 requires ~16GB VRAM; in 4-bit GPTQ it needs ~5GB, fitting on a consumer GPU. Formats include GPTQ/AWQ (GPU-optimized with calibration), GGUF (llama.cpp format for CPU/GPU hybrid inference), and bitsandbytes (training-time quantization)."
  },
  {
    id: "infra-deploy-06",
    topicId: "model-deployment-apis",
    question: "What is 'tensor parallelism' (TP) and 'pipeline parallelism' (PP) in multi-GPU LLM deployment?",
    options: [
      "TP splits individual weight matrices across GPUs (same layer, different GPUs); PP splits model layers across GPUs (different layers on different GPUs) — both enable models too large for one GPU but with different communication patterns",
      "TP processes different batches on different GPUs; PP processes different tokens on different GPUs",
      "TP is for training; PP is for inference — they cannot be combined",
      "TP splits the input sequence; PP splits the vocabulary for final token prediction"
    ],
    correctIndex: 0,
    explanation: "Tensor parallelism (Megatron-LM style) splits attention heads and FFN weight matrices across GPUs — each GPU has a column/row shard of every layer's weights. Pipeline parallelism assigns consecutive layers to different GPUs — GPU 0 runs layers 1-16, GPU 1 runs 17-32, etc. TP has higher inter-GPU communication but lower pipeline bubble; PP has lower bandwidth needs but idle bubbles between microbatches."
  },
  {
    id: "infra-deploy-07",
    topicId: "model-deployment-apis",
    question: "What is 'model distillation' and how does it enable efficient deployment?",
    options: [
      "Training a smaller 'student' model to mimic the outputs (and optionally intermediate representations) of a larger 'teacher' model, producing a compact model that retains much of the teacher's capability",
      "Removing redundant neurons from a pre-trained model through iterative pruning based on activation statistics",
      "Converting a model from one architecture (e.g., transformer) to a simpler one (e.g., LSTM) for faster inference",
      "Extracting and distilling the most important training examples from the dataset to train a smaller model from scratch"
    ],
    correctIndex: 0,
    explanation: "Knowledge distillation (Hinton et al., 2015) trains the student on soft labels (the teacher's probability distributions) rather than hard ground-truth labels. The soft labels contain 'dark knowledge' about the relative similarities between classes that hard labels don't capture. Models like DistilBERT (40% smaller, 97% of BERT's performance) and Phi-3 Mini demonstrate how distillation produces deployment-efficient models."
  },
  {
    id: "infra-deploy-08",
    topicId: "model-deployment-apis",
    question: "What is 'Triton Inference Server' and what problems does it solve in production deployments?",
    options: [
      "NVIDIA's production inference server supporting multiple frameworks (PyTorch, TensorFlow, ONNX, TensorRT), dynamic batching, concurrent model execution, model versioning, and gRPC/REST APIs — a standard enterprise inference platform",
      "A Python web framework specifically designed for serving transformer models via HTTP",
      "A cloud service by AWS that manages GPU clusters for LLM inference at scale",
      "A specialized compiler that converts Python model code to optimized C++ for faster serving"
    ],
    correctIndex: 0,
    explanation: "NVIDIA Triton Inference Server handles production ML serving complexity: it supports multiple model frameworks, implements dynamic batching (grouping concurrent requests for GPU efficiency), enables concurrent model instances, provides Prometheus metrics, integrates with TensorRT for optimized execution, and serves via gRPC and REST. It's widely used in enterprise deployments on both cloud and on-premises GPU clusters."
  },
  {
    id: "infra-deploy-09",
    topicId: "model-deployment-apis",
    question: "What is 'OpenAI-compatible API' format and why has it become an industry standard?",
    options: [
      "The /v1/chat/completions and /v1/embeddings endpoint format pioneered by OpenAI that many providers (Anthropic via compatibility layers, Together AI, Groq, Ollama, vLLM) adopted — enabling drop-in provider switching by changing only the base_url",
      "A proprietary API protocol that OpenAI licenses to other companies for a fee",
      "A formal IETF standard for LLM inference APIs submitted by OpenAI to the standards body",
      "A compatibility layer that allows old GPT-3 API calls to work with newer GPT-4 models"
    ],
    correctIndex: 0,
    explanation: "OpenAI's API format (ChatCompletion with messages: [{role, content}], streaming with SSE, usage tokens, etc.) has become the de facto standard for LLM APIs. Providers like Together AI, Groq, Anyscale, and self-hosted vLLM/Ollama serve the same interface, meaning code written for one provider works with another by changing the base_url and API key — dramatically reducing vendor lock-in."
  },
  {
    id: "infra-deploy-10",
    topicId: "model-deployment-apis",
    question: "What is 'streaming token generation' (server-sent events or websockets) and why is it important for UX?",
    options: [
      "Sending each generated token to the client as it is produced (not waiting for the full response) — reducing perceived latency from seconds to milliseconds, since the user sees text appearing progressively rather than waiting for the complete response",
      "A technique that splits the model into streaming shards and processes chunks on different GPUs simultaneously",
      "Batching token generation so multiple tokens are sent in a single network packet to reduce overhead",
      "Pre-generating a stream of likely responses and sending the most relevant one when the user submits the query"
    ],
    correctIndex: 0,
    explanation: "Autoregressive LLMs generate one token at a time. Without streaming, the user stares at a spinner for 5-30 seconds before seeing any text. With streaming (SSE or WebSockets), each token is sent immediately after generation — the user sees 'The answer is...' building word by word, drastically improving perceived responsiveness. All major LLM APIs support streaming, and it's now considered essential for chat UIs."
  },
  {
    id: "infra-deploy-11",
    topicId: "model-deployment-apis",
    question: "What is 'model versioning' and 'canary deployment' in the context of LLM APIs?",
    options: [
      "Model versioning tracks different trained model checkpoints; canary deployment routes a small percentage of traffic to a new model version to validate it in production before full rollout",
      "Versioning refers to API endpoint versions (v1, v2); canary is a safety feature that automatically reverts to the old model if the new one generates harmful content",
      "Model versioning stores multiple copies of weights for rollback; canary deployment tests the model on simulated adversarial inputs before deployment",
      "Both terms refer only to the model training pipeline, not the serving infrastructure"
    ],
    correctIndex: 0,
    explanation: "Model versioning maintains multiple checkpoint versions in the serving system, enabling rollback if a new version regresses. Canary deployment sends 5-10% of real traffic to the new model while the majority still hits the stable version. Metrics (latency, quality scores, error rates) are compared; if the canary performs well for a monitoring period, traffic is gradually shifted 100% to the new version."
  },
  {
    id: "infra-deploy-12",
    topicId: "model-deployment-apis",
    question: "What is 'rate limiting' and 'token-based pricing' in LLM API services?",
    options: [
      "Rate limiting restricts requests per minute/day per API key to prevent abuse and ensure fair resource allocation; token-based pricing charges per input+output token consumed, aligning cost with computational resources used",
      "Rate limiting speeds up inference by caching the most common prompts; token pricing is a budget ceiling that terminates generation when exceeded",
      "Rate limiting applies only to free-tier users; paid users with token-based pricing have no limits",
      "Both mechanisms apply only to embedding models, not chat completion endpoints"
    ],
    correctIndex: 0,
    explanation: "LLM APIs enforce rate limits (requests per minute, tokens per minute, requests per day) to prevent resource monopolization and ensure service stability. Token-based pricing ($/million input tokens + $/million output tokens) reflects that LLM inference cost scales with tokens processed — longer inputs and outputs cost proportionally more. Output tokens cost more because they require sequential generation vs. parallel input processing."
  },
  {
    id: "infra-deploy-13",
    topicId: "model-deployment-apis",
    question: "What is 'inference optimization' with TensorRT and what kinds of improvements does it offer?",
    options: [
      "NVIDIA's SDK for optimizing neural networks for GPU inference — performs layer fusion, precision calibration (FP16/INT8), memory optimization, and kernel autotuning — delivering 2-10x speedup and reduced latency compared to stock PyTorch inference",
      "A training optimization library that reduces CUDA memory allocation during backpropagation",
      "A tool that automatically selects the best NVIDIA GPU model for a given inference workload",
      "A compression technique that prunes transformer layers deemed least important for a specific task"
    ],
    correctIndex: 0,
    explanation: "TensorRT optimizes PyTorch/ONNX models specifically for NVIDIA GPU inference: it fuses multiple operations (e.g., attention computation) into single GPU kernels, selects optimal precision (FP32→FP16→INT8 with calibration), removes unused subgraphs, and runs kernel autotuning for the specific GPU hardware. TensorRT-LLM extends this to LLMs with transformers-specific optimizations."
  },
  {
    id: "infra-deploy-14",
    topicId: "model-deployment-apis",
    question: "What is 'prompt caching' and which LLM providers support it?",
    options: [
      "Reusing the KV cache computed for a repeated prefix (e.g., a long system prompt) across multiple requests, avoiding redundant computation — Anthropic and OpenAI offer explicit prompt caching, dramatically reducing cost and latency for applications with shared prefixes",
      "Storing the final generated response for a prompt and returning it for identical future requests",
      "A client-side browser cache that stores LLM outputs to reduce API calls for repeat queries",
      "Pre-computing responses to anticipated common queries during off-peak hours for reduced latency"
    ],
    correctIndex: 0,
    explanation: "When multiple requests share a common prefix (e.g., a long system prompt with documents), the KV cache for that prefix can be reused rather than recomputed. Anthropic's prompt caching reduces input token cost by 90% for cached prefixes; OpenAI's automatic prompt caching applies to prefixes >1024 tokens with 50% discount. This is crucial for RAG applications where the same retrieved documents appear in many requests."
  },
  {
    id: "infra-deploy-15",
    topicId: "model-deployment-apis",
    question: "What is 'cold start' in serverless LLM deployments and how is it mitigated?",
    options: [
      "The latency spike when a serverless function scales from zero — loading model weights (GBs) from storage to GPU memory — mitigated by warm instance pools, model weight caching on SSDs, and pre-loading popular models in memory",
      "The performance degradation of a freshly deployed model before it has been warmed up with production traffic",
      "The initial slow generation speed due to KV cache being empty at the start of a new conversation",
      "A training phenomenon where models converge slowly when initialized with very small random weights"
    ],
    correctIndex: 0,
    explanation: "Loading a 7B-parameter model (~14GB in FP16) from cloud storage to GPU RAM can take 30-60 seconds — unacceptable for user-facing applications. Mitigation strategies: maintain warm instances (keep some pods always running), use SSD-backed instance stores near GPU for faster model loading, implement model weight caching on the instance, and use weight streaming to start serving before full model is loaded."
  }
];

export const finetuningVsFewshotQuestions = [
  {
    id: "infra-finetune-01",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'fine-tuning' a pre-trained LLM and when is it preferred over few-shot prompting?",
    options: [
      "Continuing training on a task-specific dataset to update model weights — preferred when: consistent output format/style is needed, the task requires specialized knowledge not in the base model, production costs demand prompt efficiency, or latency requirements prohibit large prompts",
      "Fine-tuning is always preferred because it produces smaller, faster models without any quality tradeoff",
      "Fine-tuning replaces the entire pre-training process with task-specific data from scratch",
      "Fine-tuning only applies to embedding models, not generative language models"
    ],
    correctIndex: 0,
    explanation: "Few-shot prompting is quick to iterate but has costs: long prompts consume tokens every request, performance is sensitive to example order, and behavior can be inconsistent. Fine-tuning bakes the task behavior into weights, enabling shorter prompts, more consistent outputs, and better performance on specialized tasks — at the cost of a training run and dataset curation."
  },
  {
    id: "infra-finetune-02",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'LoRA' (Low-Rank Adaptation) and why is it the dominant fine-tuning technique?",
    options: [
      "A parameter-efficient technique that freezes pre-trained weights and adds small trainable low-rank matrices to each transformer layer — fine-tuning with 0.1-1% of total parameters while matching full fine-tuning quality",
      "A technique that randomly selects a low fraction of model weights to update during fine-tuning",
      "A method that reduces the model's rank (number of layers) for faster fine-tuning on consumer hardware",
      "A regularization technique that adds a low-rank penalty to the loss function to prevent overfitting"
    ],
    correctIndex: 0,
    explanation: "LoRA (Hu et al., 2021) decomposes weight updates ΔW as low-rank matrices: ΔW = BA where B is d×r and A is r×d (r ≪ d). Since r is small (4-64), only B and A are trained — typically 1-10 million parameters vs. 7 billion total. This means fine-tuning fits on consumer GPUs, adapters are small files (<100MB), and multiple adapters can be quickly swapped without storing full model copies."
  },
  {
    id: "infra-finetune-03",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'QLoRA' and what hardware constraint does it address?",
    options: [
      "Quantized LoRA: loading the base model in 4-bit quantization (reducing VRAM from ~14GB to ~5GB for a 7B model) while training LoRA adapters in full precision — enabling fine-tuning of 7B+ models on consumer GPUs with 8-16GB VRAM",
      "A variant of LoRA that uses quantum computing principles for faster matrix operations during training",
      "A technique that applies LoRA only to Q (query) matrices in attention layers for targeted fine-tuning",
      "A quantization-aware training method that fine-tunes a model while simulating quantization noise"
    ],
    correctIndex: 0,
    explanation: "QLoRA (Dettmers et al., 2023) combines 4-bit NormalFloat (NF4) quantization of the frozen base model with LoRA adapters trained in BFloat16. It introduces double quantization (quantizing the quantization constants) and paged optimizers for CPU memory offload. A 65B model that needed 780GB RAM can now be fine-tuned on 48GB GPU RAM — democratizing large model fine-tuning."
  },
  {
    id: "infra-finetune-04",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'Instruction Fine-Tuning' (IFT) and how does it differ from continued pre-training?",
    options: [
      "IFT trains on (instruction, response) pairs to teach the model to follow user commands; continued pre-training trains on raw text to extend domain knowledge — IFT shapes behavior while pre-training shapes knowledge",
      "IFT is the same as RLHF, using human feedback to rank model outputs; continued pre-training uses synthetic data",
      "IFT only updates the model's final output layer weights; continued pre-training updates all layers",
      "IFT is training from scratch on instruction data; continued pre-training is fine-tuning on task-specific examples"
    ],
    correctIndex: 0,
    explanation: "Continued pre-training on domain text (medical papers, legal documents, code) extends the model's knowledge about a domain. Instruction fine-tuning trains on formatted (instruction, input, output) examples that teach the model how to respond to user requests — the format that produces helpful, instruction-following assistants. Models typically undergo pre-training first, then IFT, then alignment (RLHF or DPO)."
  },
  {
    id: "infra-finetune-05",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'RLHF' (Reinforcement Learning from Human Feedback) and what problem does it solve?",
    options: [
      "A training paradigm that uses human preference rankings to train a reward model, then uses that reward model with RL (PPO) to fine-tune the LLM to generate responses humans prefer — aligning model behavior with human values and preferences",
      "A technique where the model learns from reinforcement signals generated by running code it produces",
      "An evaluation framework where humans grade model outputs on a reinforcement scale from 1 to 10",
      "A training method that rewards the model for correct factual statements and penalizes hallucinations using fact-checking APIs"
    ],
    correctIndex: 0,
    explanation: "RLHF (InstructGPT, 2022) has three phases: supervised fine-tuning on demonstrations, training a reward model on human preference rankings (which of two responses do you prefer?), and reinforcement learning (PPO) to optimize the LLM against the reward model. This aligns model behavior with nuanced human preferences (helpfulness, harmlessness, honesty) that are hard to specify as explicit rules."
  },
  {
    id: "infra-finetune-06",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'DPO' (Direct Preference Optimization) and how does it simplify alignment over RLHF?",
    options: [
      "DPO bypasses the reward model and RL training by directly optimizing the LLM on preference pairs using a classification-style loss — simpler, more stable, and computationally cheaper than PPO-based RLHF while achieving comparable alignment",
      "DPO is a data preprocessing technique that filters training examples based on model confidence to create preference-aligned datasets",
      "DPO replaces the supervised fine-tuning phase of RLHF with unsupervised pre-training on preference data",
      "DPO uses dynamic programming to find the optimal policy for responding to user queries"
    ],
    correctIndex: 0,
    explanation: "DPO (Rafailov et al., 2023) shows that the RLHF objective can be re-expressed as a classification loss directly on (prompt, chosen_response, rejected_response) triples without needing an explicit reward model or RL training. The loss increases probability of preferred responses while decreasing rejected ones. DPO is now widely used (Llama-3, Mistral) because it's 10x simpler to implement than PPO-based RLHF."
  },
  {
    id: "infra-finetune-07",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'catastrophic forgetting' in the context of LLM fine-tuning, and how is it mitigated?",
    options: [
      "Fine-tuning on a narrow task can degrade the model's broad pre-trained capabilities; mitigated by parameter-efficient methods (LoRA preserves frozen pre-trained weights), regularization (EWC), data mixing (adding general data to fine-tuning), and careful learning rate selection",
      "When a fine-tuned model forgets all examples from the training dataset to ensure user privacy",
      "When the model loses the ability to generate long-form text after being fine-tuned on short examples",
      "When gradient updates during fine-tuning accidentally zero out entire attention heads, forgetting their learned patterns"
    ],
    correctIndex: 0,
    explanation: "A model fine-tuned on medical QA may lose coding or creative writing ability because gradient updates overwrite pre-trained representations. LoRA mitigates this by keeping pre-trained weights frozen — only the small adapters change. Data mixing (including general instruction data in the fine-tuning set) and lower learning rates also help preserve general capabilities while learning the new task."
  },
  {
    id: "infra-finetune-08",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'few-shot prompting' vs. 'in-context learning' (ICL), and are they the same thing?",
    options: [
      "Yes — both refer to providing examples in the prompt context at inference time without any weight updates; the model learns the task pattern from examples within the prompt, not through gradient descent",
      "Few-shot prompting requires 2-5 examples; in-context learning refers to providing 10+ examples for complex tasks",
      "Few-shot prompting is for text generation; in-context learning only applies to classification tasks",
      "In-context learning updates the model's weights temporarily during inference while few-shot prompting does not"
    ],
    correctIndex: 0,
    explanation: "Few-shot prompting and in-context learning (ICL) are essentially synonymous — both describe providing task examples in the prompt at inference time. The model 'learns' the task from these examples using its pre-trained ability to recognize patterns, without any parameter updates. ICL is an emergent capability that appears in models above a certain scale (few billion parameters)."
  },
  {
    id: "infra-finetune-09",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'synthetic data generation' for fine-tuning and why is it increasingly common?",
    options: [
      "Using a powerful LLM (e.g., GPT-4) to generate instruction-response pairs as training data for fine-tuning a smaller model — enabling high-quality fine-tuning datasets without expensive human annotation",
      "Creating artificial training examples by data augmentation (synonym replacement, paraphrasing) of existing examples",
      "Training models on simulated environments (video games, physics simulators) rather than real-world text",
      "Generating noise-augmented versions of training examples to improve model robustness"
    ],
    correctIndex: 0,
    explanation: "Models like Alpaca (Stanford) used GPT-3.5 to generate 52K instruction-following examples for fine-tuning LLaMA. Phi-1/2/3 (Microsoft) demonstrated that small models fine-tuned on high-quality synthetic 'textbook quality' data can significantly outperform models trained on raw web text. Synthetic data scales cheaply vs. human annotation and can target specific capabilities or formats."
  },
  {
    id: "infra-finetune-10",
    topicId: "finetuning-vs-fewshot",
    question: "What determines whether fine-tuning vs. few-shot prompting is the right choice for a new task?",
    options: [
      "Fine-tune when: examples consistently exceed context limits, behavior must be extremely consistent, training data >1k examples is available, cost/latency at scale prohibits large prompts. Few-shot when: task is simple, needs rapid iteration, training data is scarce, or the capability already exists in a larger model",
      "Fine-tuning is always better quality; few-shot is only used when there's no training data",
      "The choice depends entirely on the hardware available — fine-tuning requires GPUs, few-shot only requires CPUs",
      "Few-shot is always preferred because fine-tuning risks catastrophic forgetting of all pre-trained knowledge"
    ],
    correctIndex: 0,
    explanation: "The decision framework: Does the task require knowledge not in the base model? (→ fine-tune on domain data). Are examples too long to fit in context? (→ fine-tune). Is behavior consistency critical? (→ fine-tune). Is this a prototype/experiment? (→ few-shot first). Is training data available and labeled? (→ fine-tune). For many real tasks, start with few-shot to validate the approach before investing in a fine-tuning pipeline."
  },
  {
    id: "infra-finetune-11",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'PEFT' (Parameter-Efficient Fine-Tuning) and what techniques does it encompass?",
    options: [
      "A family of methods that fine-tune only a small subset of parameters while freezing most of the pre-trained model — including LoRA, Prefix Tuning, Prompt Tuning, IA³, and Adapter modules",
      "A library for parallel fine-tuning across multiple GPU nodes for faster training",
      "A technique specifically for fine-tuning the final classification head of an LLM without changing any transformer layers",
      "A method for evaluating fine-tuning efficiency by measuring perplexity improvement per GPU hour"
    ],
    correctIndex: 0,
    explanation: "PEFT methods train orders of magnitude fewer parameters than full fine-tuning. LoRA adds low-rank matrices; Prefix Tuning prepends learnable 'virtual tokens' to each layer; Prompt Tuning learns soft prompt embeddings at the input layer only; Adapters add small bottleneck layers inside transformer blocks; IA³ injects learned scaling vectors. The HuggingFace `peft` library provides unified access to all these methods."
  },
  {
    id: "infra-finetune-12",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'domain adaptation' fine-tuning and why does it often improve performance on specialized tasks?",
    options: [
      "Continued pre-training on domain-specific text (medical literature, legal documents, code) before task-specific instruction fine-tuning — improving the model's vocabulary distribution, entity recognition, and terminology relevant to that domain",
      "Adapting a model to work in different deployment environments (cloud, edge, mobile) by quantization and pruning",
      "Fine-tuning on translated versions of training data to adapt a monolingual model to new languages",
      "Adjusting a model's output style to match different domain conventions (formal, casual, technical)"
    ],
    correctIndex: 0,
    explanation: "General LLMs see limited domain-specific text during pre-training. Continued pre-training on a medical corpus (PubMed, clinical notes) shifts the model's knowledge distribution toward medical terminology and concepts. Subsequent instruction fine-tuning then teaches task behavior. This two-stage approach (domain adaptation → task fine-tuning) consistently outperforms instruction fine-tuning alone for specialized domains."
  },
  {
    id: "infra-finetune-13",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'data formatting' for fine-tuning and why does the chat template matter?",
    options: [
      "Fine-tuning data must be formatted to match the model's chat template (e.g., Llama's [INST] format, ChatML, Alpaca format) because the model learned to parse these formats during instruction tuning — mismatched format causes degraded instruction following",
      "Data formatting only matters for embedding models, not for generative fine-tuning",
      "Chat templates are only necessary for RLHF training, not for supervised fine-tuning",
      "Any consistent JSON format works for fine-tuning; the specific template used doesn't affect model behavior"
    ],
    correctIndex: 0,
    explanation: "Each base model's instruction-following behavior is conditioned on specific prompt templates (e.g., Llama-3 expects <|begin_of_text|><|start_header_id|>user<|end_header_id|>...). Using the wrong template during fine-tuning creates a mismatch — the model doesn't recognize the format as user input vs. assistant response, causing poor task performance. Always use the model's official chat template (via tokenizer.apply_chat_template())."
  },
  {
    id: "infra-finetune-14",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'Constitutional AI' (CAI) and how does it relate to fine-tuning for safety?",
    options: [
      "An Anthropic technique where an LLM critiques and revises its own outputs based on a set of principles (a 'constitution'), then uses these self-corrected examples to fine-tune the model — reducing reliance on expensive human feedback for safety training",
      "A legal framework governing the ethical use of AI systems, developed by Anthropic lawyers",
      "A fine-tuning method that trains models to always follow user instructions without refusal",
      "A technique that trains multiple specialized constitutional models for different legal jurisdictions"
    ],
    correctIndex: 0,
    explanation: "CAI (Anthropic, 2022) automates safety fine-tuning: an LLM (the 'critic') critiques its own harmful outputs using a written constitution of principles, then revises them. These (harmful prompt, revised response) pairs train a supervised fine-tuned model. A subsequent RL phase uses an AI feedback preference model (not human feedback) to further align the model. Claude is trained with CAI."
  },
  {
    id: "infra-finetune-15",
    topicId: "finetuning-vs-fewshot",
    question: "What is 'model merging' (e.g., SLERP, DARE-TIES) and why is it a useful alternative to fine-tuning from scratch?",
    options: [
      "Combining the weights of multiple fine-tuned models (or a fine-tuned and base model) using interpolation techniques — producing a merged model that benefits from the strengths of each without additional training",
      "Merging multiple LoRA adapters by adding their weight matrices before loading onto the base model",
      "A distributed training technique that merges gradient updates from multiple GPU nodes",
      "A deployment strategy that combines multiple model API calls and selects the best response"
    ],
    correctIndex: 0,
    explanation: "Model merging combines trained model weights directly: SLERP (spherical linear interpolation) smoothly interpolates between two models in weight space; DARE-TIES prunes task vectors and resolves sign conflicts before merging; Model Soups averages fine-tuned checkpoints. Merging enables mixing capabilities (e.g., code + instruction following) without new training data or compute — popular in the open-source community (Mistral-7B Instruct is partially based on merging techniques)."
  }
];
