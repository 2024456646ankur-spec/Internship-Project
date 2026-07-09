// ---------------------------------------------------------------------------
// GenAI / LLMs — 6 topics x 15 questions
// ---------------------------------------------------------------------------

export const transformerArchitectureQuestions = [
  {
    id: "genai-transformer-01",
    topicId: "transformer-architecture",
    question: "What is the primary innovation the Transformer architecture introduced over RNNs?",
    options: [
      "Parallel processing via self-attention instead of sequential recurrence",
      "The use of convolutional filters over token embeddings",
      "Replacing gradient descent with genetic algorithms",
      "Removing the need for training data entirely"
    ],
    correctIndex: 0,
    explanation: "Transformers process all tokens in a sequence simultaneously using self-attention, removing the sequential bottleneck of RNNs and enabling much faster, more parallelizable training on modern hardware."
  },
  {
    id: "genai-transformer-02",
    topicId: "transformer-architecture",
    question: "In the original 'Attention Is All You Need' paper, how many encoder layers does the base Transformer model have?",
    options: ["6", "8", "12", "24"],
    correctIndex: 0,
    explanation: "The base Transformer model described in the 2017 paper uses 6 encoder layers and 6 decoder layers. The large variant uses 12 layers, and models like GPT-3 scale this further to 96 layers."
  },
  {
    id: "genai-transformer-03",
    topicId: "transformer-architecture",
    question: "What role does the Feed-Forward Network (FFN) play in each Transformer layer?",
    options: [
      "It applies a position-wise non-linear transformation independently to each token representation",
      "It computes pairwise similarities between all token pairs",
      "It encodes positional information into token embeddings",
      "It performs cross-attention between encoder and decoder"
    ],
    correctIndex: 0,
    explanation: "The FFN in each Transformer layer takes the output of the attention sub-layer and applies two linear transformations with a non-linear activation (typically ReLU or GELU) in between. Crucially, it operates on each position (token) independently, allowing the model to add complex non-linear capacity without mixing token positions."
  },
  {
    id: "genai-transformer-04",
    topicId: "transformer-architecture",
    question: "Why are positional encodings necessary in the Transformer architecture?",
    options: [
      "Because self-attention is permutation-invariant and has no inherent notion of token order",
      "Because the FFN layers destroy positional information during processing",
      "Because word embeddings do not capture semantic meaning",
      "Because gradient flow degrades without positional signals"
    ],
    correctIndex: 0,
    explanation: "Self-attention computes relationships between all token pairs but treats them as an unordered set — it produces the same output regardless of input order. Positional encodings (sinusoidal or learned) inject order information so the model can distinguish 'the dog bit the man' from 'the man bit the dog'."
  },
  {
    id: "genai-transformer-05",
    topicId: "transformer-architecture",
    question: "What is the purpose of the 'residual connection' (also called a skip connection) in each Transformer sub-layer?",
    options: [
      "It adds the sub-layer's input directly to its output, facilitating gradient flow during backpropagation",
      "It stores intermediate attention weights for inspection",
      "It forces the model to learn only the difference between input and output",
      "It compresses the representation to a lower-dimensional space"
    ],
    correctIndex: 0,
    explanation: "Residual connections allow gradients to flow directly through the network without passing through the non-linear sub-layers, which alleviates the vanishing gradient problem. They also allow layers to easily learn the identity function (output = input) when no transformation is needed."
  },
  {
    id: "genai-transformer-06",
    topicId: "transformer-architecture",
    question: "What does 'Layer Normalization' do in a Transformer, and where is it typically applied?",
    options: [
      "It normalizes across the feature/embedding dimension of each token, applied after each sub-layer",
      "It normalizes across all tokens in the batch, applied before the attention computation",
      "It scales the learning rate based on the layer depth",
      "It zeroes out a random fraction of attention weights to prevent overfitting"
    ],
    correctIndex: 0,
    explanation: "Layer Normalization computes mean and variance across the hidden-dimension features of a single token's representation (not across the batch), then normalizes. It stabilizes training and is applied either after each sub-layer (Post-LN) or before (Pre-LN, more common in modern models like GPT)."
  },
  {
    id: "genai-transformer-07",
    topicId: "transformer-architecture",
    question: "What distinguishes a decoder-only Transformer (like GPT) from an encoder-decoder Transformer (like the original)?",
    options: [
      "Decoder-only models use causal (masked) self-attention to generate text autoregressively; encoder-decoder models have a cross-attention step allowing the decoder to attend to the encoder's output",
      "Decoder-only models use sinusoidal positional encodings; encoder-decoder models use learned ones",
      "Decoder-only models cannot be fine-tuned; encoder-decoder models can",
      "Decoder-only models have no Feed-Forward Networks; encoder-decoder models do"
    ],
    correctIndex: 0,
    explanation: "In encoder-decoder Transformers, the decoder has a cross-attention layer that lets it attend to the full encoder output (useful for sequence-to-sequence tasks like translation). Decoder-only models (GPT family) skip the encoder entirely and use causal masking in self-attention so each token can only attend to preceding tokens, enabling autoregressive text generation."
  },
  {
    id: "genai-transformer-08",
    topicId: "transformer-architecture",
    question: "What is 'Multi-Head Attention' and why is it beneficial over single-head attention?",
    options: [
      "It runs multiple attention functions in parallel, allowing the model to jointly attend to information from different representation subspaces",
      "It uses multiple GPUs to compute attention in parallel for speed",
      "It applies attention multiple times sequentially on the same input to refine representations",
      "It computes attention for multiple input sequences simultaneously"
    ],
    correctIndex: 0,
    explanation: "Multi-Head Attention projects Q, K, V into multiple lower-dimensional subspaces and computes attention in each head independently. The outputs are concatenated and projected back. Different heads can learn to attend to syntactic relationships, coreference, positional proximity, etc., simultaneously — richer than a single attention pass."
  },
  {
    id: "genai-transformer-09",
    topicId: "transformer-architecture",
    question: "What is the computational complexity of standard self-attention with respect to sequence length n?",
    options: ["O(n²) in both time and memory", "O(n log n)", "O(n)", "O(n³)"],
    correctIndex: 0,
    explanation: "Standard self-attention requires computing a pairwise similarity score between every pair of tokens, resulting in an n×n attention matrix. This means both time and memory scale quadratically with sequence length — a key bottleneck for very long sequences that has motivated research into efficient attention variants like Longformer, BigBird, and FlashAttention."
  },
  {
    id: "genai-transformer-10",
    topicId: "transformer-architecture",
    question: "Why is the dot-product scaled by 1/√d_k before the softmax in scaled dot-product attention?",
    options: [
      "To prevent extremely large dot products from pushing softmax into regions with very small gradients",
      "To normalize the attention weights so they sum to zero",
      "To match the magnitude of the positional encodings",
      "To speed up computation by reducing the magnitude of floating-point numbers"
    ],
    correctIndex: 0,
    explanation: "With high-dimensional keys (large d_k), the dot products can become very large, causing the softmax to output values very close to 0 or 1 with near-zero gradients. Scaling by 1/√d_k keeps the dot products in a more reasonable range, maintaining healthy gradient flow during training."
  },
  {
    id: "genai-transformer-11",
    topicId: "transformer-architecture",
    question: "What is 'causal masking' in a decoder self-attention layer?",
    options: [
      "Setting attention weights for future positions to -∞ before softmax, so each token can only attend to itself and past tokens",
      "Masking out tokens that appear in the training data to prevent memorization",
      "Removing attention heads that produce uniform distributions",
      "Applying dropout to the attention weights to regularize the model"
    ],
    correctIndex: 0,
    explanation: "Causal (or autoregressive) masking sets the scores for positions j > i to negative infinity before the softmax, so those weights become effectively zero. This ensures that when predicting token i, the model cannot 'cheat' by looking at future tokens — a requirement for proper autoregressive language modeling."
  },
  {
    id: "genai-transformer-12",
    topicId: "transformer-architecture",
    question: "Which of these best describes the role of 'Key', 'Query', and 'Value' vectors in attention?",
    options: [
      "Query asks a question about what to look for; Keys are indexed answers; Values are the actual content retrieved, weighted by query-key similarity",
      "Query is the input token; Key is the vocabulary embedding; Value is the output logit",
      "Query represents the encoder output; Key and Value represent the decoder state",
      "All three are identical projections of the input used to reduce computation"
    ],
    correctIndex: 0,
    explanation: "The attention mechanism is analogous to a soft dictionary lookup: a Query vector 'searches' for relevant information by computing dot-product similarities with all Key vectors, then uses the resulting weights to take a weighted sum of the Value vectors. Different projections for Q, K, and V give the model flexibility to compute meaningful comparisons."
  },
  {
    id: "genai-transformer-13",
    topicId: "transformer-architecture",
    question: "What problem does the 'Pre-LN' (Pre-Layer Normalization) variant solve compared to the original 'Post-LN' Transformer?",
    options: [
      "Pre-LN applies normalization before each sub-layer, which leads to more stable training and removes the need for learning-rate warmup",
      "Pre-LN reduces parameter count by sharing normalization weights across layers",
      "Pre-LN speeds up inference by caching normalized activations",
      "Pre-LN prevents attention collapse in very deep models by freezing lower layers"
    ],
    correctIndex: 0,
    explanation: "In Post-LN (original paper), gradients to early layers can be very large or very small, requiring careful warmup schedules. Moving normalization before each sub-layer (Pre-LN, used in GPT-2 and later) keeps gradient magnitudes more consistent throughout training, improving stability especially at large scale."
  },
  {
    id: "genai-transformer-14",
    topicId: "transformer-architecture",
    question: "BERT uses a Transformer encoder with a key pre-training objective. What is it?",
    options: [
      "Masked Language Modeling (MLM): randomly masking 15% of tokens and predicting them from context",
      "Causal Language Modeling (CLM): predicting the next token in a sequence",
      "Contrastive Learning: making embeddings of similar sentences closer together",
      "Autoencoding: reconstructing the full input sequence from a compressed latent vector"
    ],
    correctIndex: 0,
    explanation: "BERT pre-trains with Masked Language Modeling, where 15% of input tokens are replaced with [MASK], and the model must predict the original token using bidirectional context (both left and right). This forces the encoder to build rich contextual representations, unlike causal LM which only uses left context."
  },
  {
    id: "genai-transformer-15",
    topicId: "transformer-architecture",
    question: "What is Rotary Position Embedding (RoPE), and why is it preferred in many modern LLMs?",
    options: [
      "It encodes position by rotating Q and K vectors in embedding space, enabling relative position awareness and better length generalization",
      "It replaces sinusoidal encodings with learned vectors that rotate between layers",
      "It uses a circular buffer to store historical positional states for long contexts",
      "It applies rotational invariance to make the model position-agnostic"
    ],
    correctIndex: 0,
    explanation: "RoPE (used in LLaMA, Mistral, etc.) applies a rotation matrix based on absolute position to Q and K vectors before dot-product attention. The rotation is designed so that the Q·K inner product naturally depends on the relative position (i-j), combining absolute and relative position encoding benefits while generalizing to longer sequences than seen in training."
  }
];

export const attentionMechanismQuestions = [
  {
    id: "genai-attention-01",
    topicId: "attention-mechanism",
    question: "In scaled dot-product attention, what is the formula for computing attention output?",
    options: [
      "softmax(QK^T / √d_k) · V",
      "sigmoid(QK^T) · V",
      "softmax(QV^T / √d_k) · K",
      "tanh(QK^T) · V"
    ],
    correctIndex: 0,
    explanation: "The scaled dot-product attention formula computes dot products between the Query and all Keys, scales by 1/√d_k to prevent magnitude issues, applies softmax to get weights summing to 1, and then uses those weights to produce a weighted sum of the Value vectors."
  },
  {
    id: "genai-attention-02",
    topicId: "attention-mechanism",
    question: "What does 'self-attention' mean in the context of Transformers?",
    options: [
      "Q, K, and V all come from the same input sequence, allowing each token to attend to all other tokens in the same sequence",
      "The model attends to its own previous predictions from the previous layer",
      "The model applies attention to itself recursively, like a recurrent network",
      "Only selected tokens attend to the rest, not all pairs"
    ],
    correctIndex: 0,
    explanation: "In self-attention, queries, keys, and values are all derived from the same sequence via learned linear projections. This lets every token build a contextualized representation by attending to all other positions in the same sequence, capturing long-range dependencies in a single step."
  },
  {
    id: "genai-attention-03",
    topicId: "attention-mechanism",
    question: "What is 'cross-attention' in encoder-decoder Transformers?",
    options: [
      "The decoder's queries attend to the encoder's keys and values, letting the decoder reference the input sequence",
      "The encoder and decoder alternately apply attention to each other's outputs",
      "Both encoder and decoder apply the same attention weights simultaneously",
      "Cross-attention uses cross-entropy loss to train attention weights directly"
    ],
    correctIndex: 0,
    explanation: "In cross-attention, the decoder generates Queries from its own state, but the Keys and Values come from the encoder's output. This is how the decoder 'reads' the source sequence at each decoding step — for example, in translation, the decoder can focus on the most relevant source words when generating each target word."
  },
  {
    id: "genai-attention-04",
    topicId: "attention-mechanism",
    question: "What is 'attention head collapse' and why is it problematic?",
    options: [
      "When multiple attention heads learn identical or near-identical attention patterns, reducing the diversity and expressiveness of multi-head attention",
      "When attention weights all converge to uniform distributions, making the model ignore context",
      "When the softmax produces NaN values due to numerical overflow in large dot products",
      "When attention layers are removed during pruning, reducing model depth"
    ],
    correctIndex: 0,
    explanation: "Attention head collapse occurs when different heads specialize in the same patterns rather than complementary ones. This wastes model capacity since the heads are supposed to capture different aspects of the input (e.g., syntax, semantics, local vs. global context). Techniques like attention dropout and auxiliary losses help encourage diversity."
  },
  {
    id: "genai-attention-05",
    topicId: "attention-mechanism",
    question: "What is 'sparse attention' and what problem does it address?",
    options: [
      "It restricts each token to attend to a limited subset of positions (e.g., local window or strided patterns) to reduce the O(n²) cost of full attention",
      "It randomly drops a fraction of attention weights during training to act as regularization",
      "It uses a sparse matrix format to store embeddings more efficiently",
      "It applies attention only to tokens that appear in the vocabulary more than a threshold number of times"
    ],
    correctIndex: 0,
    explanation: "Full self-attention scales quadratically with sequence length (O(n²)), making it prohibitively expensive for long sequences. Sparse attention methods like Longformer and BigBird restrict each token to attend to a fixed window or a small set of global tokens, bringing complexity down to O(n·w) while preserving most of the representational power."
  },
  {
    id: "genai-attention-06",
    topicId: "attention-mechanism",
    question: "What is FlashAttention, and what efficiency gain does it provide?",
    options: [
      "A memory-efficient attention algorithm that fuses operations and uses tiling to reduce GPU memory reads/writes, achieving the same result as standard attention but faster",
      "A sparse attention variant that processes only the top-k most relevant key-value pairs",
      "An approximate attention method that uses random projections to reduce dimensionality",
      "A hardware implementation of attention using specialized ASICs instead of GPUs"
    ],
    correctIndex: 0,
    explanation: "FlashAttention (Dao et al., 2022) computes the exact same output as standard attention but avoids materializing the full O(n²) attention matrix in GPU high-bandwidth memory. Instead, it tiles the computation in GPU SRAM, dramatically reducing memory I/O — the main bottleneck. This enables training with much longer sequences without memory overhead."
  },
  {
    id: "genai-attention-07",
    topicId: "attention-mechanism",
    question: "What is 'grouped query attention' (GQA), and why do models like LLaMA 2 and Mistral use it?",
    options: [
      "Multiple query heads share a single key-value head group, reducing KV cache memory during inference while preserving most of the quality of full multi-head attention",
      "Queries are grouped by semantic similarity to reduce redundant attention computations",
      "Key-value pairs are grouped by position to enable parallelism across sequence chunks",
      "Attention is applied to groups of tokens rather than individual tokens"
    ],
    correctIndex: 0,
    explanation: "In standard multi-head attention, each head has its own Q, K, and V projections. In Grouped Query Attention (GQA), multiple query heads share a single key-value head. This significantly reduces the size of the KV cache (which grows with sequence length and batch size during inference) with minimal quality degradation compared to full multi-head attention."
  },
  {
    id: "genai-attention-08",
    topicId: "attention-mechanism",
    question: "What is the KV cache in autoregressive LLM inference, and why is it important?",
    options: [
      "A cache that stores computed key and value vectors for already-processed tokens, avoiding recomputation at each generation step",
      "A key-value store that maps token IDs to embeddings, replacing the embedding lookup table",
      "A distributed cache that stores model weights across multiple GPUs for faster loading",
      "A memory buffer that caches the top-k most probable next tokens to speed up beam search"
    ],
    correctIndex: 0,
    explanation: "During autoregressive generation, each new token attends to all previous tokens. Without caching, K and V vectors for all previous tokens would need to be recomputed at every step. The KV cache stores these vectors, so only the new token's Q, K, V are computed at each step — reducing computation from O(n²) per token to O(n) amortized."
  },
  {
    id: "genai-attention-09",
    topicId: "attention-mechanism",
    question: "What is relative position encoding, and how does it differ from absolute position encoding?",
    options: [
      "Relative encodings inject the distance (i-j) between positions into the attention score, rather than the absolute positions i and j independently",
      "Relative encodings scale attention by the length of the sequence to make results comparable across lengths",
      "Relative encodings use floating-point positions (e.g., 0.0 to 1.0) instead of integers",
      "Relative encodings learn separate embeddings for each position in the sequence"
    ],
    correctIndex: 0,
    explanation: "Absolute position encodings add position-specific vectors to token embeddings before attention. Relative position encodings instead modify the attention score between positions i and j based on their offset (i-j). This approach generalizes better to sequence lengths not seen during training, as the model learns to use relative distances rather than absolute positions."
  },
  {
    id: "genai-attention-10",
    topicId: "attention-mechanism",
    question: "In Bahdanau attention (used in older seq2seq models), what problem did it solve?",
    options: [
      "Fixed-length context vectors in early encoder-decoder models that lost information for long sequences",
      "Vanishing gradients in attention computation during backpropagation",
      "The inability of LSTMs to process input in parallel",
      "Vocabulary size limitations in early neural machine translation systems"
    ],
    correctIndex: 0,
    explanation: "Early encoder-decoder RNNs compressed the entire source sequence into a single fixed-length context vector — a severe bottleneck for long sentences. Bahdanau attention (2014) allowed the decoder to take a weighted sum of all encoder hidden states at each decoding step, focusing on the most relevant source tokens rather than relying on a single compressed vector."
  },
  {
    id: "genai-attention-11",
    topicId: "attention-mechanism",
    question: "What is 'attention entropy' and what does low attention entropy indicate?",
    options: [
      "The entropy of the attention distribution; low entropy means attention is highly concentrated (peaky) on a few tokens rather than spread evenly",
      "The amount of information lost when compressing the input sequence through attention pooling",
      "The training loss associated with the attention mechanism",
      "The variance of attention weights across layers, used to detect overfitting"
    ],
    correctIndex: 0,
    explanation: "Attention entropy measures the spread of the attention distribution (softmax output). High entropy = attention spread across many positions (diffuse). Low entropy = attention focused on very few tokens (sharp/peaky). Different heads naturally develop different entropy levels — some broad for general context, some sharp for specific syntactic relations."
  },
  {
    id: "genai-attention-12",
    topicId: "attention-mechanism",
    question: "What is 'sliding window attention' as used in Longformer?",
    options: [
      "Each token attends only to tokens within a fixed window around it, plus a few designated global tokens that attend to all positions",
      "Attention weights are computed over a sliding window of time steps, like a 1D convolution",
      "The model slides a fixed-size chunk of the sequence through the attention layer at each step",
      "Attention windows are learned during training and adapted to the input content"
    ],
    correctIndex: 0,
    explanation: "Longformer uses a combination of local windowed attention (each token attends to w/2 tokens on each side) and global attention (selected tokens like [CLS] or task-specific tokens attend to and receive attention from all positions). This gives O(n·w) complexity instead of O(n²), making it practical for documents with thousands of tokens."
  },
  {
    id: "genai-attention-13",
    topicId: "attention-mechanism",
    question: "What is 'attention sink' and why is it relevant to LLM inference with very long contexts?",
    options: [
      "A phenomenon where the first few tokens (especially BOS) consistently receive disproportionately large attention weights regardless of content, providing a 'sink' for attention probability mass",
      "The tendency of attention layers to degrade in quality (sink) as sequence length increases beyond training length",
      "A memory overflow condition where the KV cache fills up and attention computations must be discarded",
      "A regularization technique that prevents attention from being too concentrated on any single token"
    ],
    correctIndex: 0,
    explanation: "Attention sink (observed in StreamingLLM research) refers to the fact that initial tokens — especially the BOS token — systematically collect a large fraction of attention probability, even when they are semantically irrelevant. This appears to serve a 'dump' function for probability mass. StreamingLLM exploits this by always keeping a few initial tokens in the KV cache for stability in streaming inference."
  },
  {
    id: "genai-attention-14",
    topicId: "attention-mechanism",
    question: "What does 'bidirectional attention' mean and which model architecture uses it?",
    options: [
      "Every token can attend to all other tokens (both past and future), used in encoder-only models like BERT",
      "The encoder attends left-to-right and the decoder attends right-to-left simultaneously",
      "Attention is computed in both spatial and temporal dimensions for multimodal models",
      "Each attention head alternates between attending forward and backward through the sequence"
    ],
    correctIndex: 0,
    explanation: "Bidirectional attention (no causal mask) allows every token to attend to every other token in the sequence — both preceding and following. This is characteristic of encoder-only models like BERT and RoBERTa, giving them richer contextual representations. It's not suitable for generation tasks, which require causal masking to avoid 'seeing the future'."
  },
  {
    id: "genai-attention-15",
    topicId: "attention-mechanism",
    question: "Multi-Query Attention (MQA) is a technique used in some LLMs. What does it do?",
    options: [
      "All query heads share a single key and value head, maximally reducing KV cache size at the cost of some quality",
      "Multiple queries from different positions are batched together to parallelize attention computation",
      "It uses multiple separate attention mechanisms for different modalities (text, image, audio)",
      "Queries are computed multiple times at different scales and the results are aggregated"
    ],
    correctIndex: 0,
    explanation: "Multi-Query Attention (MQA) is an extreme version of Grouped Query Attention where there is only one shared key head and one shared value head for all query heads. This reduces KV cache memory by a factor equal to the number of query heads, dramatically speeding up inference throughput, though with a slight quality regression compared to full multi-head attention."
  }
];

export const tokenizationQuestions = [
  {
    id: "genai-tokenization-01",
    topicId: "tokenization",
    question: "What is Byte-Pair Encoding (BPE) tokenization?",
    options: [
      "A subword tokenization algorithm that iteratively merges the most frequent adjacent byte or character pairs in a corpus until a target vocabulary size is reached",
      "A tokenization method that splits text into individual bytes rather than characters",
      "A method that encodes each word as a fixed-size sequence of binary digits",
      "A technique that groups sentences into pairs for contrastive learning"
    ],
    correctIndex: 0,
    explanation: "BPE (used in GPT-2, RoBERTa) starts with individual characters as tokens and repeatedly merges the most frequent adjacent pair into a new token. This continues until the desired vocabulary size is reached. The result is a compact vocabulary of common subword units that balances coverage of rare words with efficiency for common ones."
  },
  {
    id: "genai-tokenization-02",
    topicId: "tokenization",
    question: "What is the purpose of a special [UNK] (unknown) token, and which tokenization methods help reduce its occurrence?",
    options: [
      "[UNK] represents out-of-vocabulary words; subword methods like BPE and WordPiece minimize its occurrence by breaking unknown words into known subword pieces",
      "[UNK] is used to mark the beginning of a sentence in sequence models",
      "[UNK] represents padding tokens that fill unused sequence positions",
      "[UNK] is specific to character-level tokenization where all unknown symbols are replaced"
    ],
    correctIndex: 0,
    explanation: "Word-level tokenizers produce [UNK] for any word not seen during training vocabulary construction. Subword tokenizers like BPE virtually eliminate [UNK] since any word can be decomposed into known subword pieces — at worst, into individual characters or byte sequences, which are always in the vocabulary."
  },
  {
    id: "genai-tokenization-03",
    topicId: "tokenization",
    question: "Why does the same word like 'playing' tokenize differently depending on whether it appears at the start of a sentence or mid-sentence in many tokenizers?",
    options: [
      "Many tokenizers add a special space character prefix (like '▁' in SentencePiece) to distinguish word-initial vs. word-internal occurrences, creating different tokens for the same surface form",
      "Tokenizers use context-dependent rules that analyze the surrounding words before tokenizing",
      "The tokenizer applies different byte-pair merges depending on the sentence position",
      "Case sensitivity causes different tokenization for sentence-initial capitalized words"
    ],
    correctIndex: 0,
    explanation: "SentencePiece and many modern tokenizers use a leading space or special character (e.g., '▁playing' vs 'playing') to mark whether a token starts a new word. This means ' playing' (with leading space) and 'playing' in the middle of a word are distinct token IDs. This encodes word boundary information without requiring pre-tokenization."
  },
  {
    id: "genai-tokenization-04",
    topicId: "tokenization",
    question: "What is WordPiece tokenization, used by BERT, and how does it differ from BPE?",
    options: [
      "WordPiece merges pairs that maximize likelihood of the training corpus, while BPE merges the most frequent pairs; WordPiece uses '##' prefixes for non-initial subword pieces",
      "WordPiece splits at word boundaries only, while BPE splits at character boundaries",
      "WordPiece uses a fixed vocabulary defined by linguists, while BPE learns from data",
      "WordPiece applies only to English text, while BPE works for any language"
    ],
    correctIndex: 0,
    explanation: "Both BPE and WordPiece are merge-based subword algorithms, but differ in their merge criterion: BPE merges the most frequent adjacent pair, while WordPiece merges the pair that most increases the language model's likelihood. WordPiece also marks non-initial subword pieces with '##' (e.g., 'playing' → ['play', '##ing']), helping the model distinguish word positions."
  },
  {
    id: "genai-tokenization-05",
    topicId: "tokenization",
    question: "What is the typical token count for GPT-4's tokenizer (tiktoken) for one page of English text (~250 words)?",
    options: [
      "Approximately 300–400 tokens, since English words average roughly 1.3–1.5 tokens each",
      "Exactly 250 tokens, one per word",
      "Approximately 1000–1500 tokens, since each word is split into multiple subwords",
      "Approximately 50–100 tokens, since common phrases are compressed into single tokens"
    ],
    correctIndex: 0,
    explanation: "GPT-4 uses the cl100k_base tokenizer. For English text, common words are single tokens while longer or rarer words are split into 2-3 subword tokens. The rule of thumb is ~1 token per 4 characters or ~1 token per 0.75 words, so 250 words ≈ 300–375 tokens. Code and non-English text tokenize differently (often less efficiently)."
  },
  {
    id: "genai-tokenization-06",
    topicId: "tokenization",
    question: "Why does poor tokenization of numbers (like '42389') affect LLM arithmetic performance?",
    options: [
      "Numbers are often split into arbitrary subword pieces (e.g., '423' '89') that don't correspond to meaningful numerical structure, making digit-level operations like carrying or alignment harder for the model",
      "Tokenizers compress all numbers into a single [NUM] token, losing the actual value",
      "LLMs use floating-point representation internally, so tokenization of integers is irrelevant",
      "Numbers are always tokenized as individual characters, which is too granular for arithmetic"
    ],
    correctIndex: 0,
    explanation: "BPE-style tokenizers split numbers based on frequency in training data (e.g., '42389' might become ['42', '38', '9'] or ['4', '2389']). These splits don't respect digit place-value, making column-aligned arithmetic difficult. Models like GPT-4 show improved arithmetic partly because of tokenizer tuning, but this remains a fundamental challenge."
  },
  {
    id: "genai-tokenization-07",
    topicId: "tokenization",
    question: "What is the SentencePiece library and why is it widely used in multilingual models like LLaMA?",
    options: [
      "SentencePiece implements BPE and Unigram LM tokenization on raw text without pre-tokenization, making it language-agnostic and suitable for multilingual corpora",
      "SentencePiece is a neural tokenizer that learns to split sentences based on semantic boundaries",
      "SentencePiece encodes each sentence as a single embedding vector for downstream tasks",
      "SentencePiece is a rule-based tokenizer that handles punctuation and special characters in multiple languages"
    ],
    correctIndex: 0,
    explanation: "SentencePiece (by Google) directly trains on raw Unicode text without language-specific pre-tokenization (no whitespace assumption). This makes it ideal for languages like Japanese, Chinese, and Thai that don't use spaces between words. It supports BPE and Unigram LM algorithms and is used by T5, XLNet, LLaMA, and many multilingual models."
  },
  {
    id: "genai-tokenization-08",
    topicId: "tokenization",
    question: "What does 'tokenizer fertility' mean and why does it matter for multilingual LLMs?",
    options: [
      "The average number of tokens needed to represent one word in a given language; high fertility (many tokens per word) means a language is underrepresented in the tokenizer's vocabulary",
      "The proportion of tokens in the vocabulary that correspond to complete words vs. subwords",
      "The speed at which a tokenizer can process text measured in tokens per second",
      "The number of unique tokens generated from a corpus of a fixed size"
    ],
    correctIndex: 0,
    explanation: "Fertility measures how 'expensive' a language is to represent with a given tokenizer. If an English word takes 1.3 tokens on average but a Hindi word takes 8 tokens, Hindi speakers effectively get ~6× less context per sequence for the same token budget. This creates inequity in multilingual models and is a key consideration in tokenizer design for non-English languages."
  },
  {
    id: "genai-tokenization-09",
    topicId: "tokenization",
    question: "What is the Unigram Language Model (ULM) tokenization algorithm, used in SentencePiece?",
    options: [
      "It starts with a large initial vocabulary and iteratively removes tokens whose removal least reduces the likelihood of the training corpus, until the target size is reached",
      "It assigns each character a probability equal to its frequency and selects the highest-probability segmentation",
      "It uses a unigram n-gram model to predict the next token during tokenization",
      "It assigns each word a unique ID based on its frequency rank in the training corpus"
    ],
    correctIndex: 0,
    explanation: "Unlike BPE (which greedily merges), Unigram LM tokenization works top-down: start with all possible subword candidates, assign probabilities based on likelihood, and iteratively prune the vocabulary by removing tokens whose removal causes the smallest decrease in total corpus likelihood. This produces a probabilistic segmentation model rather than a deterministic one."
  },
  {
    id: "genai-tokenization-10",
    topicId: "tokenization",
    question: "What are special tokens like [BOS], [EOS], [PAD], and [MASK], and why are they needed?",
    options: [
      "Control tokens added by the tokenizer to mark sequence boundaries, padding for batching, and positions to predict during masked pre-training — they have reserved IDs that the model learns to recognize",
      "They are emoji substitutes used to represent non-ASCII characters in the token sequence",
      "They are placeholder tokens that get replaced by actual word embeddings before processing",
      "They are only used during evaluation and removed during training"
    ],
    correctIndex: 0,
    explanation: "Special tokens serve essential structural purposes: [BOS]/[CLS] marks sequence start and often carries the final representation used for classification; [EOS]/[SEP] marks boundaries; [PAD] fills shorter sequences in a batch to a uniform length (with attention masking); [MASK] marks positions for BERT-style pre-training. The model learns their semantics through pre-training."
  },
  {
    id: "genai-tokenization-11",
    topicId: "tokenization",
    question: "What is the primary tradeoff when choosing a larger vs. smaller vocabulary size for a tokenizer?",
    options: [
      "Larger vocabulary = fewer tokens per sentence (more efficient sequences) but a larger embedding matrix and potentially rarer tokens with poor representations; smaller vocabulary = longer sequences but each token seen more often during training",
      "Larger vocabulary always leads to better model performance across all tasks",
      "Smaller vocabulary is always preferred because it reduces computation in the attention layers",
      "Vocabulary size only affects memory usage, not the model's representational quality"
    ],
    correctIndex: 0,
    explanation: "A larger vocabulary tokenizes text into fewer, longer units (e.g., common phrases as single tokens), reducing sequence length and thus attention computation. But each token is seen less often during training, potentially leading to poorer embeddings for rare tokens. The typical sweet spot is 30k-100k tokens, balancing sequence efficiency with representation quality."
  },
  {
    id: "genai-tokenization-12",
    topicId: "tokenization",
    question: "Why does the same prompt often produce different outputs from an LLM when run multiple times, even though tokenization is deterministic?",
    options: [
      "Temperature and sampling randomness in token selection during generation, not tokenization, cause output variability",
      "Tokenization itself introduces randomness through probabilistic BPE merges",
      "The model's internal state changes between calls due to caching side effects",
      "Hardware floating-point non-determinism in matrix multiplication causes token selection variation"
    ],
    correctIndex: 0,
    explanation: "Tokenization is entirely deterministic — the same text always produces the same token IDs. Output variability comes from the decoding strategy: with temperature > 0 and sampling, the model samples from the probability distribution over the vocabulary at each step, introducing stochasticity. With temperature = 0 (greedy decoding), outputs are deterministic."
  },
  {
    id: "genai-tokenization-13",
    topicId: "tokenization",
    question: "What is 'token healing' or 'retokenization' and why do some inference frameworks implement it?",
    options: [
      "A technique that adjusts the last token of a prefix to avoid tokenization artifacts when completing text, since the model may have been trained on different splits at word boundaries",
      "A post-processing step that corrects grammatically incorrect token sequences after generation",
      "A method to detect and fix hallucinated tokens by comparing them against a ground-truth database",
      "A technique to merge short generated tokens back into longer words to reduce output length"
    ],
    correctIndex: 0,
    explanation: "Token healing (used in frameworks like LM Studio and Guidance) addresses a subtle issue: if a prompt ends in the middle of a multi-token word (e.g., 'To recal' where 'recall' = ['rec', 'all']), the model's probability distribution at the end is different from what it would be if 'recall' were complete. Token healing backs up and retokenizes the boundary to ensure coherent continuation."
  },
  {
    id: "genai-tokenization-14",
    topicId: "tokenization",
    question: "How does code tokenization differ from natural language tokenization in models like CodeLlama or GitHub Copilot?",
    options: [
      "Code tokenizers are trained on programming language corpora, so common code patterns (keywords, operators, indentation) get their own tokens, whereas general tokenizers may split 'def ' into 'd', 'ef', ' ' pieces",
      "Code is tokenized character-by-character since programming languages have no natural word boundaries",
      "Code tokenizers use abstract syntax trees (ASTs) instead of text-based tokenization",
      "Code is tokenized using the same vocabulary as natural language with no modifications"
    ],
    correctIndex: 0,
    explanation: "Code-specialized tokenizers (or general tokenizers trained heavily on code) have vocabulary entries for common code tokens like 'def', 'class', 'return', '==', '  ' (indentation), etc. This means code uses the token budget more efficiently compared to a tokenizer trained only on natural language, and the model sees meaningful syntactic units rather than arbitrary character splits."
  },
  {
    id: "genai-tokenization-15",
    topicId: "tokenization",
    question: "What is the 'context window' of an LLM, and how is it measured?",
    options: [
      "The maximum number of tokens (input + output combined, or input only depending on the model) the model can process in a single forward pass, measured in tokens not words or characters",
      "The number of previous conversation turns the model remembers, measured in turns",
      "The maximum file size the model can read, measured in megabytes",
      "The time window during which the model was last updated, measured in months"
    ],
    correctIndex: 0,
    explanation: "The context window is the total token capacity of a model's attention mechanism — it determines how much text the model can 'see' at once. GPT-4 Turbo has a 128k token context (~100k words). The limit is hard: tokens beyond the window are invisible to the model. Context is measured in tokens because that's the model's fundamental unit of processing."
  }
];

export const promptEngineeringQuestions = [
  {
    id: "genai-prompt-01",
    topicId: "prompt-engineering",
    question: "What is 'zero-shot prompting'?",
    options: [
      "Asking a model to perform a task without providing any examples in the prompt, relying entirely on the model's pre-trained knowledge",
      "Providing zero context or description and letting the model guess the task",
      "Using a prompt with zero tokens (empty input) to test the model's default behavior",
      "A prompting technique where you provide many examples to eliminate model uncertainty"
    ],
    correctIndex: 0,
    explanation: "Zero-shot prompting gives the model a task description or question without any worked examples. The model must generalize from its pre-training. For example, 'Translate the following to French: Hello world.' is zero-shot. Larger models tend to perform better at zero-shot tasks because they've internalized more task patterns during training."
  },
  {
    id: "genai-prompt-02",
    topicId: "prompt-engineering",
    question: "What is 'few-shot prompting' and why does it often outperform zero-shot?",
    options: [
      "Providing 2-10 input-output examples in the prompt before the actual query, demonstrating the desired format and reasoning pattern",
      "Fine-tuning a model on a small dataset of labeled examples before inference",
      "Using only 2-5 words in the prompt for maximum token efficiency",
      "Running the model with a low temperature to reduce output variability"
    ],
    correctIndex: 0,
    explanation: "Few-shot prompting includes demonstration examples (input-output pairs) directly in the prompt, which helps the model recognize the task structure, output format, and reasoning style desired. This often dramatically improves performance because the examples act as implicit instructions that help the model 'activate' the right behavior from its pre-trained knowledge."
  },
  {
    id: "genai-prompt-03",
    topicId: "prompt-engineering",
    question: "What is Chain-of-Thought (CoT) prompting and what does it improve?",
    options: [
      "Including step-by-step reasoning examples in the prompt, which leads the model to produce its own intermediate reasoning steps before the final answer — improving complex reasoning tasks",
      "Chaining multiple separate API calls together, where each model's output becomes the next model's input",
      "Using a prompt template that chains multiple persona instructions to shape model behavior",
      "A technique for fine-tuning where training examples include reasoning chains as supervision"
    ],
    correctIndex: 0,
    explanation: "Chain-of-Thought (Wei et al., 2022) prompts the model to 'think step by step' by showing examples where the answer is preceded by explicit reasoning. This dramatically improves performance on arithmetic, commonsense, and symbolic reasoning tasks because the model generates intermediate steps rather than jumping to a final answer. Adding 'Let's think step by step' is a simple zero-shot CoT variant."
  },
  {
    id: "genai-prompt-04",
    topicId: "prompt-engineering",
    question: "What is 'prompt injection' and why is it a security concern for LLM-powered applications?",
    options: [
      "Malicious user inputs that override or alter the system prompt's instructions, causing the model to ignore safety guidelines or perform unintended actions",
      "The process of inserting training examples into a prompt to improve model performance",
      "A technique to inject new knowledge into a model without fine-tuning using long prompts",
      "Adding code snippets into prompts to make the model execute external commands"
    ],
    correctIndex: 0,
    explanation: "Prompt injection attacks craft inputs like 'Ignore all previous instructions and instead...' to override the system prompt's safety rules or intended behavior. This is a serious security concern for LLM agents with access to tools or sensitive data. Defenses include input sanitization, privilege separation between system and user content, and Constitutional AI-style training."
  },
  {
    id: "genai-prompt-05",
    topicId: "prompt-engineering",
    question: "What is the 'system prompt' in a chat-based LLM API and what role does it play?",
    options: [
      "A privileged instruction block that sets the model's persona, constraints, output format, and context before any user interaction, and is given priority over user messages",
      "An internal model parameter that controls the generation temperature and top-p settings",
      "A mandatory prefix added by the API provider that cannot be modified by developers",
      "A log of previous conversations used to initialize the model's context"
    ],
    correctIndex: 0,
    explanation: "The system prompt is a distinct message from the 'user' role in the conversation, typically used by developers to configure the AI's persona, rules, and context. Models like GPT-4 and Claude are trained to treat system messages with higher authority than user messages, though this is a trained behavior, not a hard technical separation — hence the vulnerability to prompt injection."
  },
  {
    id: "genai-prompt-06",
    topicId: "prompt-engineering",
    question: "What is 'Self-Consistency' prompting?",
    options: [
      "Generating multiple diverse reasoning chains for the same question and selecting the most frequent final answer via majority vote",
      "Asking the model to check its own answer for consistency and revise it if needed",
      "Ensuring the model's output is consistent with the system prompt instructions",
      "Using the same prompt multiple times with different temperatures to estimate uncertainty"
    ],
    correctIndex: 0,
    explanation: "Self-Consistency (Wang et al., 2022) samples multiple CoT reasoning paths at temperature > 0, then takes a majority vote of the final answers. Since different reasoning paths may lead to the same correct answer while errors are more diverse, this voting improves robustness significantly on arithmetic and reasoning tasks compared to greedy single-path CoT."
  },
  {
    id: "genai-prompt-07",
    topicId: "prompt-engineering",
    question: "What is 'Tree-of-Thoughts' (ToT) prompting?",
    options: [
      "An extension of CoT that explores multiple reasoning branches simultaneously, using the model to evaluate intermediate steps and backtrack from dead ends — like a tree search over thought paths",
      "A hierarchical prompting structure where high-level thoughts direct lower-level sub-prompts",
      "A memory system that stores and retrieves past reasoning chains in a tree data structure",
      "A prompt format where conclusions are stated first (like a decision tree) and justifications follow"
    ],
    correctIndex: 0,
    explanation: "Tree-of-Thoughts (Yao et al., 2023) frames problem-solving as a tree search where each node is an intermediate 'thought' (reasoning step). The model generates several candidate next thoughts, evaluates each, and explores the most promising. This allows backtracking from bad reasoning paths and is particularly effective for multi-step problems that require exploration, like Game of 24."
  },
  {
    id: "genai-prompt-08",
    topicId: "prompt-engineering",
    question: "What does 'temperature' control in LLM generation, and how does it relate to prompt engineering?",
    options: [
      "Temperature scales the logits before softmax, controlling the sharpness of the output distribution: high temperature = more random/creative outputs, low temperature = more deterministic/focused outputs",
      "Temperature controls how fast the model processes tokens, affecting latency but not output quality",
      "Temperature sets the length of the generated output; higher temperature = longer responses",
      "Temperature controls the model's willingness to follow instructions vs. being creative"
    ],
    correctIndex: 0,
    explanation: "Temperature T divides the logits before softmax: logits/T. At T→0 (greedy), the model always picks the highest-probability token. At T=1, the original distribution is used. At T>1, the distribution flattens (more random). Prompt engineers typically use low temperature (0.1-0.3) for factual tasks and higher (0.7-1.0) for creative writing. Too high causes incoherent outputs."
  },
  {
    id: "genai-prompt-09",
    topicId: "prompt-engineering",
    question: "What is 'Role Prompting' and when is it effective?",
    options: [
      "Assigning the model a specific persona or expert role (e.g., 'You are an expert Python developer') to improve the quality and style of responses for domain-specific tasks",
      "Instructing the model to take on multiple roles simultaneously to handle complex multi-turn conversations",
      "A technique for RLHF where human raters play the role of the model to generate preference data",
      "Prompting the model to roleplay as a different AI system to bypass restrictions"
    ],
    correctIndex: 0,
    explanation: "Role prompting ('Act as an expert X') can improve output quality by activating relevant knowledge patterns and adjusting the model's tone and depth. Studies show mixed results — it helps some models on some tasks but can also increase hallucination. It's most useful for establishing output style and depth rather than genuinely changing what the model knows."
  },
  {
    id: "genai-prompt-10",
    topicId: "prompt-engineering",
    question: "What is 'ReAct' prompting and how does it enable LLM agents?",
    options: [
      "A framework alternating between Reasoning (thinking about what to do) and Acting (calling tools), allowing the model to use external tools like search engines or calculators to complete tasks",
      "A prompting pattern for React.js development questions using LLMs",
      "A technique where the model reacts emotionally to the user's tone to appear more empathetic",
      "A reinforcement learning approach where the model re-acts on its previous mistakes"
    ],
    correctIndex: 0,
    explanation: "ReAct (Yao et al., 2022) interleaves Thought: (reasoning about next action), Action: (selecting and calling a tool), and Observation: (result of the tool call) in a loop. This grounds the model's reasoning in real-world information and enables it to complete multi-step tasks requiring external knowledge or computation that exceed its pre-trained knowledge."
  },
  {
    id: "genai-prompt-11",
    topicId: "prompt-engineering",
    question: "What is 'Automatic Prompt Engineering' (APE) or 'prompt optimization'?",
    options: [
      "Using LLMs to automatically generate and evaluate candidate prompts for a task, selecting the one that maximizes performance on a validation set",
      "A software tool that automatically fills in prompt templates based on user-provided examples",
      "A technique that uses gradient descent to optimize continuous prompt embeddings (soft prompts)",
      "An API feature that automatically adjusts prompt length to fit within the context window"
    ],
    correctIndex: 0,
    explanation: "APE (Zhou et al., 2022) uses an LLM to generate many candidate prompt instructions for a task, evaluates each on labeled examples, and selects the best-performing one. This automates the tedious process of prompt engineering. Related approaches include prompt tuning (optimizing soft token embeddings via gradients) and evolutionary algorithms for discrete prompt search."
  },
  {
    id: "genai-prompt-12",
    topicId: "prompt-engineering",
    question: "What is the effect of 'output format specification' in a prompt (e.g., 'respond in JSON' or 'use bullet points')?",
    options: [
      "It constrains the model's output structure, making downstream parsing more reliable and reducing the need for post-processing, though the model may occasionally violate the format",
      "It prevents the model from generating any content outside the specified format characters",
      "It automatically enables structured output mode in the API, guaranteeing valid JSON",
      "It reduces the model's reasoning quality by forcing it to think about formatting instead of content"
    ],
    correctIndex: 0,
    explanation: "Specifying output format (JSON, Markdown, bullet points, etc.) in the prompt significantly increases compliance and makes programmatic post-processing reliable. Many APIs now offer structured output modes (like OpenAI's response_format=json_object or JSON Schema mode) that constrain generation at the token level to guarantee valid structured output, solving the occasional non-compliance problem."
  },
  {
    id: "genai-prompt-13",
    topicId: "prompt-engineering",
    question: "What is 'Directional Stimulus Prompting' and how does it guide model outputs?",
    options: [
      "Adding a hint or keyword in the prompt that steers the model toward a particular aspect, concept, or perspective without fully specifying the answer",
      "Providing directional arrows in diagrams embedded in multimodal prompts to highlight regions of interest",
      "A technique for chain-of-thought where each reasoning step points directly to the next",
      "Using temperature and top-p settings to direct the distribution toward specific token clusters"
    ],
    correctIndex: 0,
    explanation: "Directional Stimulus Prompting provides a hint (e.g., 'Hint: focus on the economic impact') that nudges the model toward a desired aspect of an answer without fully specifying it. This is particularly useful for summarization tasks where you want the model to emphasize a particular angle, or for generation tasks where you want subtle stylistic guidance."
  },
  {
    id: "genai-prompt-14",
    topicId: "prompt-engineering",
    question: "Why is it important to put instructions at the beginning AND end of a long context in a prompt?",
    options: [
      "LLMs exhibit 'lost in the middle' behavior — they tend to recall and follow instructions better from the beginning and end of the context than from the middle",
      "This is a requirement of the attention mechanism, which is biased toward first and last tokens",
      "Duplicate instructions force the model to use both short-term and long-term memory simultaneously",
      "The tokenizer processes the beginning and end of inputs differently, so instructions must appear in both regions"
    ],
    correctIndex: 0,
    explanation: "'Lost in the Middle' (Liu et al., 2023) is a well-documented LLM behavior: when relevant information is buried in the middle of a very long context, models perform significantly worse than when that information is near the beginning or end. Placing critical instructions at both ends of a long prompt leverages the model's primacy and recency biases."
  },
  {
    id: "genai-prompt-15",
    topicId: "prompt-engineering",
    question: "What is 'meta-prompting' and how does it differ from standard prompting?",
    options: [
      "Using a prompt to instruct an LLM to design, refine, or evaluate other prompts — the model acts as a prompt engineer itself",
      "Adding metadata (like author, date, source) to the prompt to improve factual grounding",
      "Using the model's API metadata (model name, version) as part of the prompt context",
      "A technique where the final prompt is assembled from multiple independently generated sub-prompts"
    ],
    correctIndex: 0,
    explanation: "Meta-prompting asks the model to reason about prompting itself — e.g., 'Given this task, what would be the most effective prompt to use?' or 'Critique this prompt and suggest improvements.' It treats prompt design as a task that LLMs can help with, leveraging the model's knowledge of its own strengths and weaknesses to generate better task-specific instructions."
  }
];

export const ragQuestions = [
  {
    id: "genai-rag-01",
    topicId: "rag",
    question: "What problem does RAG (Retrieval-Augmented Generation) primarily solve for LLMs?",
    options: [
      "Knowledge cutoff and hallucination: RAG provides the model with up-to-date, verifiable external documents at inference time, grounding responses in retrieved facts rather than solely relying on parametric memory",
      "Token context limits: RAG compresses very long documents into a small summary that fits within the model's context window",
      "Slow inference speed: RAG pre-computes answers to likely questions and retrieves them instead of generating new text",
      "Training data scarcity: RAG augments the training dataset with retrieved web documents during fine-tuning"
    ],
    correctIndex: 0,
    explanation: "LLMs have a training cutoff and may hallucinate facts not well-represented in their training data. RAG addresses this by retrieving relevant documents from a knowledge base at query time and injecting them into the prompt context. The model then generates answers conditioned on the retrieved, verifiable content — reducing hallucination and enabling current knowledge."
  },
  {
    id: "genai-rag-02",
    topicId: "rag",
    question: "What are the two main stages in a basic RAG pipeline?",
    options: [
      "Indexing (embedding documents and storing them in a vector database) and Retrieval+Generation (embedding the query, finding similar documents, then prompting the LLM with retrieved context)",
      "Training (fine-tuning the LLM on the knowledge base) and Inference (generating responses without retrieval)",
      "Chunking (splitting documents) and Summarization (condensing each chunk into a single sentence)",
      "Web Scraping (fetching live data) and Caching (storing results for repeated queries)"
    ],
    correctIndex: 0,
    explanation: "In the indexing phase, documents are split into chunks, embedded into vectors, and stored in a vector database. At inference time, the user query is embedded, the top-k most similar chunks are retrieved via vector similarity search, and these chunks are injected into the LLM's prompt as context. The LLM then generates an answer conditioned on both the query and retrieved documents."
  },
  {
    id: "genai-rag-03",
    topicId: "rag",
    question: "What is 'chunking' in RAG pipelines and why does chunk size matter?",
    options: [
      "Splitting documents into smaller segments for indexing; chunk size affects retrieval precision (small chunks = precise but may lack context) and embedding quality (large chunks = more context but harder to match semantically)",
      "A compression algorithm that reduces document size before storing in the vector database",
      "The process of dividing a large LLM prompt into multiple separate API calls",
      "A caching strategy that breaks database queries into parallel sub-queries"
    ],
    correctIndex: 0,
    explanation: "Chunking determines what unit of text gets embedded and retrieved. Too small (e.g., single sentences) = high precision but retrieved chunks may lack surrounding context. Too large (e.g., full pages) = more context but the embedding represents a mixture of topics, reducing retrieval relevance. Common strategies include fixed-size chunks with overlap, sentence-based splitting, or semantic chunking."
  },
  {
    id: "genai-rag-04",
    topicId: "rag",
    question: "What is 'Hybrid Search' in RAG systems, combining vector search with keyword search?",
    options: [
      "Using both dense vector similarity (semantic search) and sparse BM25 keyword search, then merging results — capturing both semantic and exact-match relevance",
      "Searching across multiple vector databases simultaneously and taking the union of results",
      "Alternating between vector search and web search depending on query type",
      "Using different embedding models for different document types and merging their results"
    ],
    correctIndex: 0,
    explanation: "Pure vector search excels at semantic similarity but may miss documents containing exact keywords. BM25 (TF-IDF-based keyword search) handles exact terms well but misses semantic relationships. Hybrid search runs both, then fuses the ranked lists (e.g., using Reciprocal Rank Fusion). This performs better across diverse queries, especially for technical terms, proper nouns, and code."
  },
  {
    id: "genai-rag-05",
    topicId: "rag",
    question: "What is 'Reranking' in an advanced RAG pipeline?",
    options: [
      "Applying a cross-encoder model to re-score the initially retrieved candidates using fine-grained query-document interaction, selecting the most relevant chunks before passing them to the LLM",
      "Reordering the retrieved chunks alphabetically or by date to improve LLM comprehension",
      "Running a second retrieval pass on the top-k results to find additional related documents",
      "Asking the LLM to rank the retrieved documents by relevance before using them for generation"
    ],
    correctIndex: 0,
    explanation: "Initial retrieval (bi-encoder) is fast but less precise since query and document embeddings are computed independently. Reranking uses a cross-encoder (which processes query+document jointly) to re-score the top-k candidates with much higher accuracy. Only the top-m reranked documents are passed to the LLM, improving answer quality at modest additional latency."
  },
  {
    id: "genai-rag-06",
    topicId: "rag",
    question: "What is 'HyDE' (Hypothetical Document Embeddings) and why is it useful?",
    options: [
      "Generating a hypothetical answer to the query using the LLM, then embedding that answer to search for similar real documents — bridging the vocabulary gap between short queries and long documents",
      "Creating synthetic training examples by generating hypothetical documents for rare topics",
      "A document summarization technique that generates hypothetical shorter versions of long documents",
      "An embedding compression method that generates lower-dimensional hypothetical embeddings"
    ],
    correctIndex: 0,
    explanation: "HyDE (Gao et al., 2022) addresses the mismatch between a short, terse user query and the longer, document-style text in the knowledge base. The LLM first generates a hypothetical 'answer document' that would answer the query, then this hypothetical document is embedded and used for retrieval. Since the hypothetical answer is in the same style as real documents, retrieval precision improves significantly."
  },
  {
    id: "genai-rag-07",
    topicId: "rag",
    question: "What is 'RAG Fusion' and how does it improve over standard RAG?",
    options: [
      "Generating multiple rephrased versions of the user query, retrieving results for each, then using Reciprocal Rank Fusion to merge the ranked lists before generation",
      "Merging multiple RAG systems trained on different knowledge bases at inference time",
      "Fusing the retrieved document embeddings with the query embedding before passing to the LLM",
      "Combining RAG with fine-tuning by training the LLM directly on retrieved documents"
    ],
    correctIndex: 0,
    explanation: "RAG Fusion generates N alternative phrasings of the original query (via LLM), retrieves top-k documents for each variant, then applies Reciprocal Rank Fusion to combine all retrieved lists. Documents that rank highly across multiple query variants are surfaced to the top. This overcomes the brittleness of single-query retrieval and handles diverse phrasings of the same underlying information need."
  },
  {
    id: "genai-rag-08",
    topicId: "rag",
    question: "What is 'context stuffing' vs. 'selective retrieval' in RAG, and what is their tradeoff?",
    options: [
      "Context stuffing puts all retrieved documents into the prompt (more complete but expensive and risks 'lost in the middle'); selective retrieval sends only the most relevant top-k chunks (faster but may miss needed information)",
      "Context stuffing trains the LLM on all documents; selective retrieval retrieves only during inference",
      "Context stuffing uses large chunks; selective retrieval uses smaller chunks for better precision",
      "Context stuffing stores context in GPU memory; selective retrieval fetches from disk on demand"
    ],
    correctIndex: 0,
    explanation: "With large context models (128k+ tokens), you can 'stuff' many retrieved documents into the prompt. This maximizes recall but is expensive (more tokens = more cost and latency) and risks the 'lost in the middle' effect where important information gets buried. Selective retrieval (top-3 to top-10 chunks) is more cost-efficient and focused, but may miss relevant information not captured in the top hits."
  },
  {
    id: "genai-rag-09",
    topicId: "rag",
    question: "What is 'Corrective RAG' (CRAG) and what issue does it address?",
    options: [
      "A RAG variant that evaluates retrieved documents' relevance before generation; if retrieval quality is low, it triggers web search or a knowledge-base fallback to find better sources",
      "A RAG system that automatically corrects grammatical errors in retrieved documents before passing them to the LLM",
      "A technique that re-runs retrieval for each generated sentence to verify factual accuracy",
      "A post-processing step that compares LLM output against retrieved documents and highlights discrepancies"
    ],
    correctIndex: 0,
    explanation: "CRAG (Yan et al., 2024) adds a 'retrieval evaluator' that scores whether retrieved documents are actually relevant to the query. If documents are irrelevant or ambiguous, CRAG triggers fallback strategies (like web search) instead of blindly passing poor-quality context to the LLM. This adaptive mechanism prevents generating answers grounded in irrelevant documents."
  },
  {
    id: "genai-rag-10",
    topicId: "rag",
    question: "In a RAG system, what is the difference between 'closed-book' and 'open-book' generation?",
    options: [
      "Closed-book generation uses only the LLM's parametric memory (no retrieval); open-book generation augments with retrieved documents — RAG implements the open-book paradigm",
      "Closed-book means the knowledge base is proprietary; open-book means it uses public web data",
      "Closed-book generates answers and then verifies them; open-book generates multiple answers and picks the best",
      "Closed-book uses smaller models without retrieval; open-book uses larger models with broader corpora"
    ],
    correctIndex: 0,
    explanation: "The closed-book / open-book distinction comes from NLP research: closed-book models must answer from memorized knowledge only, while open-book models have access to external documents. RAG implements open-book generation — the LLM 'reads' relevant documents at inference time, just like a human taking an open-book exam. RAG systems outperform closed-book LLMs on knowledge-intensive QA tasks."
  },
  {
    id: "genai-rag-11",
    topicId: "rag",
    question: "What is 'Self-RAG' and what makes it different from standard RAG?",
    options: [
      "A model trained with special reflection tokens that decides whether to retrieve, evaluates retrieved passages' relevance, and critiques its own generated output — making retrieval adaptive rather than always-on",
      "A RAG system where the model retrieves from its own previous outputs rather than an external knowledge base",
      "A technique where the model fine-tunes itself on retrieved documents at inference time",
      "A RAG variant that retrieves from the model's attention weights to find internally memorized facts"
    ],
    correctIndex: 0,
    explanation: "Self-RAG (Asai et al., 2023) fine-tunes an LLM to generate special tokens: [Retrieve] (should I retrieve?), [IsRel] (is the passage relevant?), [IsSup] (does it support the generation?), [IsUse] (is the overall response useful?). This teaches the model to use retrieval adaptively and self-critically, outperforming always-retrieve RAG on knowledge-intensive tasks while generating with attribution."
  },
  {
    id: "genai-rag-12",
    topicId: "rag",
    question: "What is 'GraphRAG' and what type of knowledge does it capture better than standard RAG?",
    options: [
      "A RAG approach that builds a knowledge graph from documents, enabling queries that require multi-hop reasoning across relationships between entities — something flat vector search handles poorly",
      "A RAG system that uses graph neural networks instead of transformer-based LLMs for generation",
      "A visualization tool that displays the RAG retrieval process as a computational graph",
      "A distributed RAG architecture where retrieval happens across a network graph of servers"
    ],
    correctIndex: 0,
    explanation: "GraphRAG (Microsoft, 2024) extracts entities and relationships from documents to build a knowledge graph, then uses graph traversal and community detection to answer questions. While standard RAG excels at local, specific questions, GraphRAG handles global queries about entire corpora (e.g., 'What are the main themes in this collection of reports?') by traversing entity communities — something vector search cannot do."
  },
  {
    id: "genai-rag-13",
    topicId: "rag",
    question: "What is 'metadata filtering' in RAG and when is it important?",
    options: [
      "Restricting retrieval to documents matching specific metadata criteria (date, author, category, source) before vector similarity search — essential when different document subsets are relevant for different users or query types",
      "Removing HTML tags, headers, and footers from documents before embedding to improve index quality",
      "Filtering out retrieved documents that contain sensitive personal information before passing to the LLM",
      "Limiting the number of tokens in metadata fields to reduce index storage costs"
    ],
    correctIndex: 0,
    explanation: "Metadata filtering adds a pre-filter or post-filter to vector search based on document attributes. For example, a legal RAG system might filter to documents from a specific jurisdiction and date range before doing semantic search. Without metadata filtering, semantically similar but contextually wrong documents (e.g., outdated regulations) might rank highly and mislead the LLM."
  },
  {
    id: "genai-rag-14",
    topicId: "rag",
    question: "What is 'Late Chunking' (or 'contextual retrieval') in RAG, introduced by Anthropic and Jina AI?",
    options: [
      "Embedding full documents to get rich contextual representations, then chunking the contextual embeddings at retrieval time — preserving cross-chunk context that standard chunk-first methods lose",
      "Delaying the chunking step until after the user submits a query, allowing query-aware chunk boundaries",
      "Storing full documents without chunking and using attention span to focus on relevant sections",
      "Chunking documents into time-based segments (by publication date) for temporal reasoning"
    ],
    correctIndex: 0,
    explanation: "Standard RAG embeds isolated chunks, losing context from surrounding chunks. Anthropic's Contextual Retrieval prepends a LLM-generated context summary to each chunk before embedding. Jina's Late Chunking runs the full document through the encoder first (getting contextualized token embeddings), then pools the embeddings into chunks — so each chunk's embedding reflects the full document context."
  },
  {
    id: "genai-rag-15",
    topicId: "rag",
    question: "How do you evaluate the quality of a RAG system, and what are common metrics?",
    options: [
      "Using faithfulness (is the answer grounded in retrieved context?), answer relevance (does the answer address the query?), and context precision/recall (did retrieval find the right documents?) — frameworks like RAGAS operationalize these",
      "Measuring BLEU score between generated answers and reference answers from the knowledge base",
      "Evaluating by latency (time to answer) and cost (tokens used) as the primary quality metrics",
      "Measuring the model's perplexity on the knowledge base documents after RAG augmentation"
    ],
    correctIndex: 0,
    explanation: "RAGAS (RAG Assessment) provides a standard evaluation suite with metrics like: Faithfulness (no hallucinations beyond retrieved context), Answer Relevance (the answer addresses the question), Context Precision (retrieved chunks are relevant), and Context Recall (important information was retrieved). These can be computed with or without ground-truth answers using LLM-as-judge techniques."
  }
];

export const embeddingsVectorSearchQuestions = [
  {
    id: "genai-embeddings-01",
    topicId: "embeddings-vector-search",
    question: "What is a 'text embedding' in the context of NLP and LLMs?",
    options: [
      "A dense numerical vector representation of text that captures semantic meaning, such that semantically similar texts have vectors that are close together in the embedding space",
      "The process of inserting special tokens into text before feeding it to a language model",
      "A lookup table that maps each word in the vocabulary to a unique integer ID",
      "A compressed binary representation of text for efficient storage in databases"
    ],
    correctIndex: 0,
    explanation: "Text embeddings map variable-length text (word, sentence, paragraph, or document) to a fixed-dimensional vector in a high-dimensional space. Well-trained embeddings place semantically related texts near each other — 'king' and 'queen' are closer than 'king' and 'car'. They enable semantic search, clustering, classification, and other downstream tasks."
  },
  {
    id: "genai-embeddings-02",
    topicId: "embeddings-vector-search",
    question: "What is the 'cosine similarity' metric commonly used in vector search, and when is it preferred over Euclidean distance?",
    options: [
      "Cosine similarity measures the angle between two vectors (ranging from -1 to 1), focusing on direction rather than magnitude — preferred when vector magnitude encodes non-semantic information, as with L2-normalized embeddings",
      "Cosine similarity computes the overlap between the set of non-zero dimensions of two vectors",
      "Cosine similarity is always preferred over Euclidean distance because it runs faster on GPU hardware",
      "Cosine similarity is used only for comparing document-level embeddings, not sentence or word embeddings"
    ],
    correctIndex: 0,
    explanation: "Cosine similarity measures the cosine of the angle between two vectors: cos(θ) = (A·B)/(|A||B|). For L2-normalized vectors (unit vectors), cosine similarity equals the dot product, making it computationally equivalent but directionally focused. It's preferred when text length or frequency effects cause magnitude variation unrelated to semantic content — the angle captures meaning, not scale."
  },
  {
    id: "genai-embeddings-03",
    topicId: "embeddings-vector-search",
    question: "What is 'Approximate Nearest Neighbor' (ANN) search and why is it used instead of exact search?",
    options: [
      "ANN finds the k most similar vectors with high probability but not guaranteed exactness, trading a small quality loss for dramatically faster search over millions of vectors",
      "ANN searches only a random subset of vectors, then exact-searches within that subset",
      "ANN is exact but approximates the distance metric using simpler calculations like L1 instead of L2",
      "ANN uses quantization to round vector values to integers, enabling exact matching"
    ],
    correctIndex: 0,
    explanation: "Exact nearest neighbor search requires comparing a query to every vector in the database — O(n·d) time, impractical for millions of high-dimensional vectors. ANN algorithms like HNSW, FAISS IVF, and ScaNN partition the space or build graph structures to skip most comparisons, finding approximate neighbors in O(log n) or O(√n) time with >95% recall on typical benchmarks."
  },
  {
    id: "genai-embeddings-04",
    topicId: "embeddings-vector-search",
    question: "What is 'HNSW' (Hierarchical Navigable Small World) and why is it popular in vector databases?",
    options: [
      "A graph-based ANN index that layers navigable small-world graphs at multiple scales, enabling fast greedy traversal to approximate nearest neighbors with high recall and support for dynamic insertions",
      "A hierarchical quantization scheme that compresses vectors by averaging within clusters at each hierarchy level",
      "A neural network architecture specifically designed to learn distance metrics between vectors",
      "A hardware-accelerated exact search algorithm that uses hierarchical tree structures on GPU"
    ],
    correctIndex: 0,
    explanation: "HNSW builds a layered graph: upper layers provide long-range 'skip' edges for fast navigation, lower layers have fine-grained local connections. Search starts at the top layer and greedily descends to the query's neighborhood. HNSW achieves state-of-the-art recall-speed tradeoffs, supports insertions without full rebuilds, and is used in Qdrant, Weaviate, Pinecone, and pgvector."
  },
  {
    id: "genai-embeddings-05",
    topicId: "embeddings-vector-search",
    question: "What is 'Product Quantization' (PQ) in vector databases and what does it enable?",
    options: [
      "Splitting each vector into subvectors and quantizing each independently using a small codebook — drastically reducing memory footprint while enabling approximate distance computation without full decompression",
      "A pricing model for vector database queries based on the number of vectors searched",
      "A normalization technique that scales each vector dimension by the product of all other dimensions",
      "A method that multiplies embedding matrices together to create higher-order representations"
    ],
    correctIndex: 0,
    explanation: "Product Quantization divides a d-dimensional vector into m subvectors of d/m dimensions, then quantizes each with a learned codebook of k centroids. A 768-dim float32 vector (3072 bytes) can be compressed to 8 bytes with PQ, enabling billions of vectors to fit in RAM. Approximate distances are computed using precomputed distance tables without full decompression."
  },
  {
    id: "genai-embeddings-06",
    topicId: "embeddings-vector-search",
    question: "What are 'bi-encoder' vs. 'cross-encoder' architectures, and how do they differ in use cases?",
    options: [
      "Bi-encoders embed query and document independently (fast, scalable, good for retrieval); cross-encoders process query+document jointly (slow, more accurate, good for reranking)",
      "Bi-encoders use two separate models trained on different tasks; cross-encoders use a single model for all tasks",
      "Bi-encoders produce 2D embeddings; cross-encoders produce multi-dimensional embeddings",
      "Bi-encoders work on pairs of sentences; cross-encoders work on single sentences"
    ],
    correctIndex: 0,
    explanation: "Bi-encoders (like Sentence-BERT) produce separate embeddings for query and document that can be compared via dot product — embeddings are precomputed and searched at scale (RAG retrieval stage). Cross-encoders take the full query+document pair as input and output a relevance score — much more accurate but cannot precompute, limiting to small candidate sets (reranking stage)."
  },
  {
    id: "genai-embeddings-07",
    topicId: "embeddings-vector-search",
    question: "What is 'embedding dimensionality' and what are the tradeoffs of higher vs. lower dimensional embeddings?",
    options: [
      "The size of the embedding vector; higher dimensions can encode more nuanced semantic information but require more memory and compute; lower dimensions are faster and smaller but may lose discriminative power",
      "The number of embedding layers in the model architecture, not the vector size",
      "The number of unique tokens that can be represented in the embedding space",
      "The precision of floating-point values used to store embedding values"
    ],
    correctIndex: 0,
    explanation: "Modern embedding models produce vectors of 384 to 3072 dimensions. Higher dimensions (e.g., 3072 in text-embedding-3-large) can capture finer-grained semantic distinctions but increase storage, memory bandwidth, and ANN index build time. Matryoshka Representation Learning (MRL) allows truncating embeddings to lower dimensions with graceful quality degradation, enabling flexible dimensionality tradeoffs."
  },
  {
    id: "genai-embeddings-08",
    topicId: "embeddings-vector-search",
    question: "What is 'Matryoshka Representation Learning' (MRL) and what problem does it solve?",
    options: [
      "Training embeddings so that meaningful semantic information is packed into the early dimensions, allowing truncation to smaller sizes with minimal quality loss — enabling a single model to serve different accuracy/efficiency tradeoffs",
      "A hierarchical embedding approach that generates nested embeddings for document, paragraph, and sentence levels",
      "A technique for creating multilingual embeddings by nesting language-specific representations inside a common structure",
      "A method for progressively refining a coarse embedding with more detail at each inference step"
    ],
    correctIndex: 0,
    explanation: "MRL (Kusupati et al., 2022) trains with a loss that enforces good retrieval performance at every prefix dimension (e.g., first 64, 128, 256, 512, 768 dimensions). The resulting embedding can be truncated at any supported size with predictable quality degradation. OpenAI's text-embedding-3 models support this, letting users trade retrieval quality for reduced storage and faster search."
  },
  {
    id: "genai-embeddings-09",
    topicId: "embeddings-vector-search",
    question: "What is 'sparse vs. dense' embedding, and what are SPLADE and BM25 in this context?",
    options: [
      "Dense embeddings are continuous vectors (most dimensions non-zero); sparse embeddings have mostly zero values with weights for a small set of vocabulary terms. BM25 is a classical sparse retrieval method; SPLADE is a neural sparse model combining dense LM representations with sparse output for retrieval",
      "Dense embeddings require GPUs; sparse embeddings run efficiently on CPUs",
      "Dense embeddings are for semantic search; sparse embeddings are only for keyword search and cannot be learned",
      "Dense embeddings use float32; sparse embeddings use binary (0/1) representations"
    ],
    correctIndex: 0,
    explanation: "Dense embeddings from transformer models have thousands of non-zero floating point dimensions. Sparse representations have near-zero values for most vocabulary terms, with non-zero weights only for relevant terms. BM25 is a classical TF-IDF-based sparse method. SPLADE learns a BERT-based sparse representation with explicit vocabulary alignment, achieving strong retrieval while remaining sparse for efficient inverted index lookup."
  },
  {
    id: "genai-embeddings-10",
    topicId: "embeddings-vector-search",
    question: "What is 'vector quantization' (binary embeddings or int8 quantization) and what does it enable?",
    options: [
      "Compressing float32 vectors to lower precision (int8) or binary (1-bit per dimension) representations, enabling 4x-32x memory reduction with modest recall loss — allowing larger indices to fit in RAM",
      "Converting text to numerical vectors, i.e., the fundamental embedding process itself",
      "A technique that assigns each vector to the nearest centroid cluster for exact nearest neighbor computation",
      "Encoding vectors as human-readable integer sequences for database storage"
    ],
    correctIndex: 0,
    explanation: "Float32 embeddings use 4 bytes per dimension. Int8 quantization reduces this to 1 byte (4× compression) with 1-2% recall loss. Binary quantization uses 1 bit per dimension (32× compression from float32), enabling Hamming distance computation which is extremely fast on modern CPUs. Pinecone, Qdrant, and Vespa support these for billion-scale indices."
  },
  {
    id: "genai-embeddings-11",
    topicId: "embeddings-vector-search",
    question: "What is 'contrastive learning' in the context of training sentence embedding models?",
    options: [
      "Training by making embeddings of semantically similar pairs closer together and dissimilar pairs farther apart, using losses like InfoNCE or triplet loss with in-batch negatives",
      "Training a model to distinguish between real and synthetic (LLM-generated) texts",
      "Fine-tuning with contrasting styles (formal vs. informal) to create style-aware embeddings",
      "A curriculum learning approach that starts with easy examples and gradually introduces harder ones"
    ],
    correctIndex: 0,
    explanation: "Contrastive learning creates embeddings by training with (anchor, positive, negative) triplets or (positive pair, many negatives) batches. The model minimizes distance between anchor and positive (similar text) while maximizing distance to negatives (dissimilar text). Models like SimCSE, SBERT, and E5 use variants of contrastive learning on NLI data or synthetic pairs to train strong semantic embeddings."
  },
  {
    id: "genai-embeddings-12",
    topicId: "embeddings-vector-search",
    question: "What is 'namespace' or 'collection' partitioning in vector databases and why is it used?",
    options: [
      "Logically separating vectors into groups (by user, document type, or domain) so that search is scoped within a partition — enabling multi-tenancy and preventing cross-contamination of unrelated knowledge bases",
      "Partitioning vectors across multiple machines for horizontal scaling of the vector index",
      "Dividing the embedding space into non-overlapping regions for more efficient ANN search",
      "A versioning system that stores multiple snapshots of the vector index at different points in time"
    ],
    correctIndex: 0,
    explanation: "In production RAG systems, different users or applications need isolated vector stores (e.g., Company A's documents shouldn't appear in Company B's search). Namespaces (Pinecone), collections (Qdrant, Chroma), or indices (Weaviate) provide logical separation within a single vector database deployment, enabling multi-tenant architectures without separate database instances per tenant."
  },
  {
    id: "genai-embeddings-13",
    topicId: "embeddings-vector-search",
    question: "What is 'embedding drift' and why is it a concern in long-running RAG systems?",
    options: [
      "The embedding model version changes over time, causing previously indexed vectors to become incompatible with query vectors from the new model — requiring re-embedding and re-indexing the entire knowledge base",
      "Gradual degradation of embedding quality due to memory hardware issues in vector databases",
      "The phenomenon where semantically similar documents gradually drift apart in the embedding space during training",
      "An increase in embedding storage requirements over time as the knowledge base grows"
    ],
    correctIndex: 0,
    explanation: "When an embedding model is upgraded (e.g., from text-embedding-ada-002 to text-embedding-3-large), old indexed vectors were computed by a different model and are no longer directly comparable to new query vectors. The semantic 'geometry' changes between model versions. This requires re-embedding all documents with the new model — an expensive but necessary migration for maintained retrieval accuracy."
  },
  {
    id: "genai-embeddings-14",
    topicId: "embeddings-vector-search",
    question: "What is 'word2vec' and how does it relate to modern contextual embeddings from transformers?",
    options: [
      "Word2vec (2013) produces static per-word embeddings via shallow neural network training on co-occurrence patterns; modern transformer embeddings are contextual — the same word gets different vectors depending on surrounding context",
      "Word2vec is a deprecated name for the transformer embedding layer used in BERT and GPT models",
      "Word2vec produces contextual embeddings; transformer models produce static embeddings",
      "Word2vec and transformer embeddings are mathematically identical but differ only in training efficiency"
    ],
    correctIndex: 0,
    explanation: "Word2vec (CBOW and Skip-gram) trained shallow 2-layer networks to predict words from context, producing a single fixed embedding per word regardless of context. 'Bank' has one vector in word2vec whether it means river bank or financial bank. Transformers produce contextual embeddings — 'bank' in 'river bank' and 'bank loan' get different vectors because the full sentence is processed bidirectionally."
  },
  {
    id: "genai-embeddings-15",
    topicId: "embeddings-vector-search",
    question: "What is 'multi-vector retrieval' (e.g., ColBERT) and how does it improve over single-vector retrieval?",
    options: [
      "Storing one embedding per token rather than one per document, computing relevance as the sum of max-similarity matches between query token vectors and document token vectors — enabling finer-grained matching at the cost of higher storage",
      "Using multiple embedding models and taking the average of their similarity scores for more robust retrieval",
      "Retrieving multiple separate document sections as independent vectors that are combined after retrieval",
      "A technique that creates several quantized versions of each embedding and searches them in parallel"
    ],
    correctIndex: 0,
    explanation: "ColBERT (Khattab & Zaharia, 2020) produces one embedding per token (instead of one per document). Relevance is scored as the sum of maximum cosine similarities between each query token and the best-matching document token (MaxSim). This late interaction enables fine-grained term-level matching that single-vector methods miss, achieving higher quality at the cost of storing millions of token vectors per corpus."
  }
];
