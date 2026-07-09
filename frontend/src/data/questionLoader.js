// Centralized question loader — imports all topic questions and provides
// a function to get shuffled questions by topicId(s).

import {
  javascriptEs6Questions,
  typescriptBasicsQuestions,
  reactFundamentalsQuestions,
  nodejsExpressQuestions,
  gitGithubQuestions,
  restApisHttpQuestions,
} from "./questions/webdev";

import {
  supervisedUnsupervisedQuestions,
  neuralNetworksBasicsQuestions,
  modelEvaluationMetricsQuestions,
  overfittingRegularizationQuestions,
  featureEngineeringQuestions,
} from "./questions/mlFundamentals";

import {
  transformerArchitectureQuestions,
  attentionMechanismQuestions,
  tokenizationQuestions,
  promptEngineeringQuestions,
  ragQuestions,
  embeddingsVectorSearchQuestions,
} from "./questions/genaiLlms";

import {
  langchainAgentsQuestions,
  vectorDatabasesQuestions,
  modelDeploymentApiQuestions,
  finetuningVsFewshotQuestions,
} from "./questions/aiInfra";

// Master map: topicId → question array
const QUESTION_BANK = {
  "javascript-es6":           javascriptEs6Questions,
  "typescript-basics":        typescriptBasicsQuestions,
  "react-fundamentals":       reactFundamentalsQuestions,
  "nodejs-express":           nodejsExpressQuestions,
  "git-github":               gitGithubQuestions,
  "rest-apis-http":           restApisHttpQuestions,
  "supervised-unsupervised":  supervisedUnsupervisedQuestions,
  "neural-networks-basics":   neuralNetworksBasicsQuestions,
  "model-evaluation-metrics": modelEvaluationMetricsQuestions,
  "overfitting-regularization": overfittingRegularizationQuestions,
  "feature-engineering":      featureEngineeringQuestions,
  "transformer-architecture": transformerArchitectureQuestions,
  "attention-mechanism":      attentionMechanismQuestions,
  "tokenization":             tokenizationQuestions,
  "prompt-engineering":       promptEngineeringQuestions,
  "rag":                      ragQuestions,
  "embeddings-vector-search": embeddingsVectorSearchQuestions,
  "langchain-agents":         langchainAgentsQuestions,
  "vector-databases":         vectorDatabasesQuestions,
  "model-deployment-apis":    modelDeploymentApiQuestions,
  "finetuning-vs-fewshot":    finetuningVsFewshotQuestions,
};

/**
 * Get (and optionally shuffle) questions for given topicId(s).
 * If multiple IDs given, questions are concatenated then shuffled.
 */
export function getQuestions(topicIds, shouldShuffle = true) {
  const ids = Array.isArray(topicIds) ? topicIds : [topicIds];
  const all = ids.flatMap(id => QUESTION_BANK[id] ?? []);
  if (!shouldShuffle) return all;
  // Fisher-Yates shuffle
  const arr = [...all];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
