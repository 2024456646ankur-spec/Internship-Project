// ---------------------------------------------------------------------------
// ML Fundamentals — 5 topics x 15 questions
// ---------------------------------------------------------------------------

export const supervisedUnsupervisedQuestions = [
    {
        id: "ml-supervised-01",
        topicId: "supervised-unsupervised",
        question: "What is the defining characteristic of supervised learning?",
        options: [
            "The model is trained on labeled data, learning to map inputs to known correct outputs",
            "The model receives no data at all and generates outputs from randomness",
            "The model only works with image data, never text or tabular data",
            "The model requires no evaluation once trained",
        ],
        correctIndex: 0,
        explanation:
            "In supervised learning, each training example is paired with a correct label or target value (like an email marked 'spam' or 'not spam'). The model learns a mapping from inputs to outputs by comparing its predictions against these known labels during training.",
    },
    {
        id: "ml-supervised-02",
        topicId: "supervised-unsupervised",
        question: "Which of the following is a classic example of an unsupervised learning task?",
        options: [
            "Clustering customers into groups based on purchasing behavior, without predefined group labels",
            "Predicting house prices from labeled examples of price and square footage",
            "Classifying emails as spam or not spam using labeled training data",
            "Predicting whether a loan applicant will default, using historical labeled outcomes",
        ],
        correctIndex: 0,
        explanation:
            "Clustering is unsupervised because there are no predefined labels telling the algorithm which customer belongs to which group — it must discover structure and similarity in the data on its own, unlike the other options, which all use labeled outcomes to train a predictive model.",
    },
    {
        id: "ml-supervised-03",
        topicId: "supervised-unsupervised",
        question: "What distinguishes classification from regression, both of which are supervised learning tasks?",
        options: [
            "Classification predicts a discrete category, while regression predicts a continuous numerical value",
            "Classification always uses neural networks, while regression uses decision trees",
            "Regression can only be used with images, while classification works with any data",
            "Classification requires no labeled data, unlike regression",
        ],
        correctIndex: 0,
        explanation:
            "Classification tasks output one of a fixed set of discrete labels, such as 'cat' or 'dog', or 'fraud' vs 'not fraud'. Regression tasks output a continuous number, like predicting a house price or a temperature, where the output can take on any value within a range.",
    },
    {
        id: "ml-supervised-04",
        topicId: "supervised-unsupervised",
        question: "What is K-means clustering primarily used for?",
        options: [
            "Partitioning unlabeled data into K groups based on similarity to cluster centroids",
            "Predicting a continuous target variable from labeled training data",
            "Reducing the number of features in a labeled dataset",
            "Generating labeled synthetic images",
        ],
        correctIndex: 0,
        explanation:
            "K-means is an unsupervised algorithm that iteratively assigns each data point to the nearest of K cluster centers (centroids), then recalculates each centroid as the mean of its assigned points, repeating until the assignments stabilize.",
    },
    {
        id: "ml-supervised-05",
        topicId: "supervised-unsupervised",
        question: "What is semi-supervised learning?",
        options: [
            "A learning approach that combines a small amount of labeled data with a larger amount of unlabeled data",
            "A supervised learning method that only works half the time",
            "Learning that requires no data preprocessing whatsoever",
            "An unsupervised method that ignores all labeled examples entirely",
        ],
        correctIndex: 0,
        explanation:
            "Semi-supervised learning sits between fully supervised and fully unsupervised approaches. It's useful when labeling data is expensive or time-consuming — the model leverages the structure present in abundant unlabeled data alongside the limited labeled examples to improve performance.",
    },
    {
        id: "ml-supervised-06",
        topicId: "supervised-unsupervised",
        question: "What does dimensionality reduction, such as PCA (Principal Component Analysis), typically achieve?",
        options: [
            "It compresses data into fewer features while preserving as much meaningful variance as possible",
            "It labels previously unlabeled data automatically",
            "It always improves a model's predictive accuracy without exception",
            "It is a supervised technique that requires a target variable",
        ],
        correctIndex: 0,
        explanation:
            "PCA is an unsupervised technique that transforms a dataset into a smaller set of new features (principal components) that capture as much of the original variance as possible, which can help with visualization, storage efficiency, or reducing noise before further modeling.",
    },
    {
        id: "ml-supervised-07",
        topicId: "supervised-unsupervised",
        question: "In supervised learning, what is the 'training set' used for, as opposed to the 'test set'?",
        options: [
            "The training set is used to fit the model's parameters; the test set evaluates performance on unseen data",
            "The training set is used only for final evaluation, while the test set is used to fit parameters",
            "They are interchangeable and serve the exact same purpose",
            "The training set contains only unlabeled data",
        ],
        correctIndex: 0,
        explanation:
            "The model learns patterns by adjusting its internal parameters based on the training set. The test set, which the model never sees during training, provides an unbiased estimate of how well the model generalizes to new, unseen examples.",
    },
    {
        id: "ml-supervised-08",
        topicId: "supervised-unsupervised",
        question: "What is anomaly detection, and which learning paradigm does it often use?",
        options: [
            "Identifying rare or unusual data points that deviate from the norm, often using unsupervised methods since anomalies are rarely labeled in advance",
            "A supervised method that requires every anomaly to be labeled beforehand",
            "A technique exclusive to image classification tasks",
            "A method for increasing the size of a dataset artificially",
        ],
        correctIndex: 0,
        explanation:
            "Anomaly detection aims to flag data points that differ significantly from the majority pattern, like fraudulent transactions or defective products. Because anomalies are often rare and not exhaustively labeled, unsupervised or semi-supervised approaches (such as modeling what 'normal' looks like and flagging deviations) are common.",
    },
    {
        id: "ml-supervised-09",
        topicId: "supervised-unsupervised",
        question: "What role does a 'loss function' play in supervised learning?",
        options: [
            "It quantifies how far the model's predictions are from the true labels, guiding parameter updates during training",
            "It measures how much unlabeled data was used",
            "It only applies to unsupervised clustering algorithms",
            "It determines the number of clusters to create",
        ],
        correctIndex: 0,
        explanation:
            "A loss function (like mean squared error for regression or cross-entropy for classification) produces a number representing prediction error. Training algorithms like gradient descent use this signal to adjust the model's parameters in a direction that reduces the loss over time.",
    },
    {
        id: "ml-supervised-10",
        topicId: "supervised-unsupervised",
        question: "What is a key practical challenge specific to unsupervised learning compared to supervised learning?",
        options: [
            "There's often no objective ground truth to measure whether the discovered patterns or clusters are 'correct'",
            "Unsupervised learning always requires more labeled data than supervised learning",
            "Unsupervised methods cannot be applied to numerical data",
            "Unsupervised learning is only used for text data",
        ],
        correctIndex: 0,
        explanation:
            "Without labels, evaluating an unsupervised model is inherently more subjective — there's no single 'correct answer' to check predictions against, so practitioners often rely on domain knowledge, visualization, or proxy metrics (like cluster cohesion) to judge whether results are meaningful.",
    },
    {
        id: "ml-supervised-11",
        topicId: "supervised-unsupervised",
        question: "In the context of supervised learning, what does the term 'label' refer to?",
        options: [
            "The known correct output or target value associated with a given input in the training data",
            "The name of the machine learning algorithm being used",
            "A tag identifying which programming language was used",
            "The file format of the dataset",
        ],
        correctIndex: 0,
        explanation:
            "A label is the ground-truth answer paired with an input example — for instance, the actual sale price paired with a house's features, or the correct category paired with an image. The model's goal during supervised training is to learn to predict these labels accurately for new inputs.",
    },
    {
        id: "ml-supervised-12",
        topicId: "supervised-unsupervised",
        question: "What does hierarchical clustering produce that distinguishes it from K-means?",
        options: [
            "A tree-like structure (dendrogram) showing nested groupings at multiple levels of granularity, without requiring K to be specified upfront",
            "A single flat set of exactly K clusters, chosen in advance",
            "Labeled output that matches predefined categories",
            "A regression line fitted through the data points",
        ],
        correctIndex: 0,
        explanation:
            "Hierarchical clustering builds a nested hierarchy of clusters — merging or splitting groups step by step — and represents this as a dendrogram, which can be cut at different heights to yield different numbers of clusters. This is different from K-means, which requires choosing the number of clusters K before running the algorithm.",
    },
    {
        id: "ml-supervised-13",
        topicId: "supervised-unsupervised",
        question: "Which scenario best illustrates a regression problem?",
        options: [
            "Predicting tomorrow's temperature in degrees based on historical weather data",
            "Sorting news articles into topic categories like 'sports' or 'politics'",
            "Grouping similar customer reviews without any predefined categories",
            "Detecting whether an image contains a cat or a dog",
        ],
        correctIndex: 0,
        explanation:
            "Predicting a temperature value is a regression problem because the output is a continuous number that could be any real value within a plausible range, unlike classification tasks (sorting articles, detecting cat vs dog) which predict discrete categories, or clustering, which is unsupervised.",
    },
    {
        id: "ml-supervised-14",
        topicId: "supervised-unsupervised",
        question: "What is the purpose of a validation set in a supervised learning workflow?",
        options: [
            "To tune hyperparameters and monitor for overfitting during training, separate from the final test set",
            "To provide the labels used during initial training",
            "To replace the need for a training set entirely",
            "To store the model's final production predictions",
        ],
        correctIndex: 0,
        explanation:
            "A validation set is held out from training and used to check how a model performs on data it hasn't directly learned from, which helps in choosing hyperparameters (like learning rate) and detecting overfitting, all without touching the test set that's reserved for final, unbiased evaluation.",
    },
    {
        id: "ml-supervised-15",
        topicId: "supervised-unsupervised",
        question: "Why might a data scientist choose an unsupervised approach over a supervised one for a given problem?",
        options: [
            "When labeled data is unavailable, too expensive to obtain, or the goal is to discover unknown patterns rather than predict a known target",
            "Because unsupervised methods always achieve higher accuracy than supervised ones",
            "Because unsupervised learning requires less computational power in every case",
            "Because supervised learning cannot be used with numerical data",
        ],
        correctIndex: 0,
        explanation:
            "Supervised learning depends on having labeled examples, which can be costly or impractical to gather at scale. Unsupervised methods become attractive when labels don't exist, or when the actual goal is exploratory — discovering hidden structure, groupings, or anomalies in the data rather than predicting a predefined outcome.",
    },
];

export const neuralNetworksBasicsQuestions = [
    {
        id: "ml-nn-01",
        topicId: "neural-networks-basics",
        question: "What is the basic computational unit of a neural network commonly called?",
        options: ["A neuron (or node/unit)", "A cluster", "A kernel filter exclusively", "A decision boundary"],
        correctIndex: 0,
        explanation:
            "A neuron takes in weighted inputs, sums them (often with a bias term added), and passes the result through an activation function to produce an output. Layers of these neurons connected together form the network.",
    },
    {
        id: "ml-nn-02",
        topicId: "neural-networks-basics",
        question: "What is the purpose of an activation function, like ReLU or sigmoid, in a neural network?",
        options: [
            "It introduces non-linearity, allowing the network to model complex, non-linear relationships",
            "It only normalizes the input data before training begins",
            "It replaces the need for weights and biases entirely",
            "It is used exclusively during the testing phase, not training",
        ],
        correctIndex: 0,
        explanation:
            "Without an activation function, stacking layers of a neural network would collapse into an equivalent single linear transformation, no matter how many layers you added. Non-linear activation functions like ReLU or sigmoid let networks approximate much more complex, non-linear functions.",
    },
    {
        id: "ml-nn-03",
        topicId: "neural-networks-basics",
        question: "What does 'backpropagation' compute in a neural network?",
        options: [
            "The gradient of the loss function with respect to each weight, used to update the weights during training",
            "The forward pass output of the network given an input",
            "The total number of layers needed for a given task",
            "The final test accuracy of the trained model",
        ],
        correctIndex: 0,
        explanation:
            "Backpropagation applies the chain rule from calculus to efficiently compute how much each weight in the network contributed to the overall error, working backward from the output layer to the input layer. These gradients are then used by an optimization algorithm to adjust the weights and reduce future error.",
    },
    {
        id: "ml-nn-04",
        topicId: "neural-networks-basics",
        question: "What is a 'hidden layer' in a neural network?",
        options: [
            "Any layer of neurons between the input layer and the output layer",
            "A layer that is invisible to the network during training",
            "The final layer that produces the network's output",
            "A layer used only in unsupervised learning models",
        ],
        correctIndex: 0,
        explanation:
            "Hidden layers sit between the raw input and the final output, and their neuron activations aren't directly observed as inputs or final predictions. They allow the network to learn increasingly abstract representations of the input data as information flows through successive layers.",
    },
    {
        id: "ml-nn-05",
        topicId: "neural-networks-basics",
        question: "What does 'gradient descent' do in the context of training a neural network?",
        options: [
            "Iteratively adjusts the model's weights in the direction that reduces the loss function",
            "Randomly shuffles the order of training examples",
            "Removes unnecessary layers from the network automatically",
            "Converts continuous outputs into discrete categories",
        ],
        correctIndex: 0,
        explanation:
            "Gradient descent uses the gradients computed via backpropagation to update each weight by a small step in the direction that decreases the loss, repeating this process over many iterations (epochs) until the loss converges to a low value.",
    },
    {
        id: "ml-nn-06",
        topicId: "neural-networks-basics",
        question: "What is the 'learning rate' hyperparameter in neural network training?",
        options: [
            "It controls how large a step is taken when updating weights during each gradient descent iteration",
            "It determines the total number of layers in the network",
            "It specifies how many training examples exist in the dataset",
            "It sets the activation function used in every layer",
        ],
        correctIndex: 0,
        explanation:
            "The learning rate scales the size of each weight update during gradient descent. Too high a learning rate can cause training to overshoot and diverge; too low a learning rate can make training extremely slow or get stuck in a poor local region of the loss landscape.",
    },
    {
        id: "ml-nn-07",
        topicId: "neural-networks-basics",
        question: "What is the primary function of a Convolutional Neural Network (CNN)?",
        options: [
            "It uses convolutional filters to efficiently detect spatial patterns, commonly used for image data",
            "It processes only sequential text data, never images",
            "It eliminates the need for any activation functions",
            "It is exclusively used for unsupervised clustering",
        ],
        correctIndex: 0,
        explanation:
            "CNNs apply small learnable filters (kernels) that slide across an input, such as an image, detecting local patterns like edges or textures. This design exploits spatial structure and drastically reduces the number of parameters compared to fully connecting every pixel to every neuron.",
    },
    {
        id: "ml-nn-08",
        topicId: "neural-networks-basics",
        question: "What problem do Recurrent Neural Networks (RNNs) address that standard feedforward networks struggle with?",
        options: [
            "Handling sequential data by maintaining a hidden state that carries information across time steps",
            "Processing static, unordered tabular data more efficiently",
            "Eliminating the need for any training data",
            "Reducing the number of parameters in image classification tasks",
        ],
        correctIndex: 0,
        explanation:
            "RNNs process sequences one element at a time while maintaining a hidden state that gets updated at each step, allowing information from earlier in the sequence to influence processing of later elements. This makes them naturally suited for tasks like time series or text, where order matters.",
    },
    {
        id: "ml-nn-09",
        topicId: "neural-networks-basics",
        question: "What does it mean for a neural network to have 'weights' and 'biases'?",
        options: [
            "Weights scale the importance of each input to a neuron, while biases shift the neuron's output independent of the input",
            "Weights determine the activation function, while biases determine the loss function",
            "Weights and biases are both fixed constants that never change during training",
            "Biases only exist in the output layer, never in hidden layers",
        ],
        correctIndex: 0,
        explanation:
            "Each connection between neurons has an associated weight that multiplies the incoming value, and each neuron typically has a bias term added after the weighted sum. Both weights and biases are learnable parameters adjusted during training to minimize the loss function.",
    },
    {
        id: "ml-nn-10",
        topicId: "neural-networks-basics",
        question: "What is an 'epoch' in neural network training?",
        options: [
            "One complete pass through the entire training dataset",
            "A single weight update step",
            "The final evaluation on the test set",
            "A type of activation function",
        ],
        correctIndex: 0,
        explanation:
            "Training typically requires multiple epochs — full passes over all the training data — because a single pass usually isn't enough for the model's weights to converge to a good solution. Within each epoch, the data is often further divided into smaller batches for more frequent weight updates.",
    },
    {
        id: "ml-nn-11",
        topicId: "neural-networks-basics",
        question: "Why is the ReLU (Rectified Linear Unit) activation function widely used in modern deep networks?",
        options: [
            "It's computationally simple and helps mitigate the vanishing gradient problem compared to functions like sigmoid",
            "It always outputs values between 0 and 1, making it ideal for probabilities",
            "It requires no gradient computation during backpropagation",
            "It only works for the output layer of a classification network",
        ],
        correctIndex: 0,
        explanation:
            "ReLU outputs the input directly if positive, and zero otherwise (`max(0, x)`), which is cheap to compute and, unlike sigmoid, doesn't saturate for large positive inputs — this helps gradients stay meaningful as they propagate backward through many layers during training.",
    },
    {
        id: "ml-nn-12",
        topicId: "neural-networks-basics",
        question: "What does it mean for a neural network to 'converge' during training?",
        options: [
            "The loss stabilizes at a low value and stops decreasing significantly with further training",
            "The network stops using any activation functions",
            "All neurons in every layer produce identical outputs",
            "The training data is completely memorized with zero generalization",
        ],
        correctIndex: 0,
        explanation:
            "Convergence describes the point where continued training yields little further reduction in the loss function, suggesting the model's weights have settled near a (local) minimum of the loss landscape. Training is often stopped around this point, ideally validated against a held-out set.",
    },
    {
        id: "ml-nn-13",
        topicId: "neural-networks-basics",
        question: "What is the vanishing gradient problem?",
        options: [
            "Gradients become extremely small as they propagate backward through many layers, making early layers learn very slowly or not at all",
            "The loss function disappears entirely partway through training",
            "The learning rate automatically drops to zero after one epoch",
            "Weights become undefined (NaN) at the start of training",
        ],
        correctIndex: 0,
        explanation:
            "In deep networks with certain activation functions (like sigmoid or tanh), repeatedly multiplying small gradient values during backpropagation across many layers can shrink the gradient toward zero by the time it reaches early layers, effectively stalling their learning — a major motivation behind ReLU and architectures like residual connections.",
    },
    {
        id: "ml-nn-14",
        topicId: "neural-networks-basics",
        question: "What is the role of a 'batch size' in neural network training?",
        options: [
            "It determines how many training examples are processed together before the model's weights are updated once",
            "It sets the total number of layers in the network",
            "It specifies how many epochs the model will train for",
            "It determines the number of output classes",
        ],
        correctIndex: 0,
        explanation:
            "Instead of updating weights after every single example (which can be noisy) or after the entire dataset (which can be slow and memory-intensive), most training uses mini-batches — a batch size specifies how many examples are averaged together to compute each gradient update.",
    },
    {
        id: "ml-nn-15",
        topicId: "neural-networks-basics",
        question: "What does it mean to say a neural network is a 'universal function approximator'?",
        options: [
            "Given enough neurons and appropriate training, a neural network can, in theory, approximate a very wide class of continuous functions",
            "The network can only compute one specific mathematical function",
            "Every neural network must contain exactly one hidden layer",
            "The network guarantees perfect accuracy on any dataset regardless of size",
        ],
        correctIndex: 0,
        explanation:
            "The universal approximation theorem states that a feedforward network with at least one hidden layer and enough neurons can approximate any continuous function on a bounded domain to arbitrary precision. In practice, achieving this depends heavily on having sufficient data, appropriate architecture, and successful training.",
    },
];

export const modelEvaluationMetricsQuestions = [
    {
        id: "ml-eval-01",
        topicId: "model-evaluation-metrics",
        question: "What does 'accuracy' measure in a classification model?",
        options: [
            "The proportion of total predictions that were correct",
            "The proportion of actual positives that were correctly identified",
            "The proportion of predicted positives that were actually correct",
            "The average error between predicted and actual continuous values",
        ],
        correctIndex: 0,
        explanation:
            "Accuracy is calculated as (correct predictions) / (total predictions). While simple to compute, it can be misleading on imbalanced datasets — a model that always predicts the majority class can score high accuracy while being practically useless for the minority class.",
    },
    {
        id: "ml-eval-02",
        topicId: "model-evaluation-metrics",
        question: "What do 'precision' and 'recall' measure in a binary classification context?",
        options: [
            "Precision is the proportion of predicted positives that are truly positive; recall is the proportion of actual positives that were correctly identified",
            "Precision and recall are two names for the exact same calculation",
            "Precision measures continuous error, while recall measures categorical error",
            "Precision only applies to unsupervised models, and recall only to supervised ones",
        ],
        correctIndex: 0,
        explanation:
            "Precision answers 'of everything I labeled positive, how much was actually positive?' while recall answers 'of everything that was actually positive, how much did I correctly catch?' A model can have high precision but low recall (very conservative, misses many true positives) or the reverse.",
    },
    {
        id: "ml-eval-03",
        topicId: "model-evaluation-metrics",
        question: "Why is accuracy alone often a poor metric for a highly imbalanced dataset, like detecting a rare disease?",
        options: [
            "A model that always predicts the majority (non-disease) class can achieve high accuracy while completely failing to detect the rare positive cases",
            "Accuracy cannot be computed at all for imbalanced datasets",
            "Imbalanced datasets always have fewer than 100 examples",
            "Accuracy only works for regression, not classification",
        ],
        correctIndex: 0,
        explanation:
            "If 99% of patients don't have a rare disease, a model that predicts 'no disease' for everyone achieves 99% accuracy while never correctly identifying a single actual case — this is why metrics like recall or the F1 score, which specifically account for how well the positive class is detected, are often more informative here.",
    },
    {
        id: "ml-eval-04",
        topicId: "model-evaluation-metrics",
        question: "What is the F1 score, and why is it useful?",
        options: [
            "The harmonic mean of precision and recall, providing a single metric that balances both",
            "The sum of true positives and true negatives divided by the dataset size",
            "A metric used exclusively for regression problems",
            "The average of all individual class accuracies with no other calculation",
        ],
        correctIndex: 0,
        explanation:
            "F1 = 2 × (precision × recall) / (precision + recall). Using the harmonic mean means the F1 score is low if either precision or recall is low, making it a useful single number when you care about both false positives and false negatives, rather than optimizing only one at the expense of the other.",
    },
    {
        id: "ml-eval-05",
        topicId: "model-evaluation-metrics",
        question: "What does a 'confusion matrix' display for a classification model?",
        options: [
            "A table breaking down predictions into true positives, false positives, true negatives, and false negatives",
            "A graph showing loss over each training epoch",
            "The correlation between all input features",
            "The distribution of the target variable before training",
        ],
        correctIndex: 0,
        explanation:
            "A confusion matrix cross-tabulates predicted labels against actual labels, showing exactly how many predictions fell into each category (correct positive, correct negative, and each type of error). Metrics like precision, recall, and accuracy can all be derived directly from its cells.",
    },
    {
        id: "ml-eval-06",
        topicId: "model-evaluation-metrics",
        question: "What does Mean Squared Error (MSE) measure, and in what type of task is it commonly used?",
        options: [
            "The average of the squared differences between predicted and actual values, commonly used for regression",
            "The proportion of correctly classified examples, used for classification",
            "The number of clusters formed by an unsupervised algorithm",
            "The total training time required to fit a model",
        ],
        correctIndex: 0,
        explanation:
            "MSE takes the average of (predicted − actual)² across all examples. Squaring the errors penalizes larger mistakes more heavily than smaller ones and ensures errors don't cancel out, which is why it's a standard loss and evaluation metric for regression tasks.",
    },
    {
        id: "ml-eval-07",
        topicId: "model-evaluation-metrics",
        question: "What does the ROC curve plot, and what does AUC (Area Under the Curve) summarize about it?",
        options: [
            "The ROC curve plots true positive rate against false positive rate at various thresholds; AUC summarizes overall classifier performance across all thresholds",
            "The ROC curve plots training loss against epochs; AUC is the final loss value",
            "The ROC curve is only used for regression tasks, not classification",
            "AUC is always equal to the model's accuracy",
        ],
        correctIndex: 0,
        explanation:
            "As you vary the decision threshold for a binary classifier, the trade-off between true positive rate and false positive rate changes — the ROC curve visualizes this trade-off. AUC condenses the entire curve into a single number between 0 and 1, where 1.0 represents a perfect classifier and 0.5 represents random guessing.",
    },
    {
        id: "ml-eval-08",
        topicId: "model-evaluation-metrics",
        question: "What is 'k-fold cross-validation' used for?",
        options: [
            "Splitting data into k subsets and training/evaluating k times, using a different subset as the test set each time, to get a more robust performance estimate",
            "Reducing a dataset's dimensionality before training",
            "Automatically labeling unlabeled data",
            "Selecting the optimal number of clusters in K-means",
        ],
        correctIndex: 0,
        explanation:
            "Rather than relying on a single train/test split (which could happen to be favorable or unfavorable by chance), k-fold cross-validation rotates through k different splits, training on k−1 folds and testing on the remaining one each time, then averages the results for a more reliable estimate of how the model generalizes.",
    },
    {
        id: "ml-eval-09",
        topicId: "model-evaluation-metrics",
        question: "In a medical diagnostic model, why might a practitioner prioritize recall over precision?",
        options: [
            "Missing an actual positive case (a false negative) may be far more costly than a false alarm (a false positive)",
            "Recall is always mathematically larger than precision",
            "Precision cannot be computed for medical data",
            "Recall is only relevant for regression tasks",
        ],
        correctIndex: 0,
        explanation:
            "In screening for a serious disease, failing to flag an actual sick patient (a false negative, hurting recall) can have severe consequences, whereas a false positive typically just leads to an unnecessary follow-up test. This asymmetry in cost is why recall is often prioritized in such contexts, even at the expense of some precision.",
    },
    {
        id: "ml-eval-10",
        topicId: "model-evaluation-metrics",
        question: "What does R² (R-squared) indicate in a regression model's evaluation?",
        options: [
            "The proportion of variance in the target variable that is explained by the model's predictions",
            "The percentage of predictions that were exactly correct",
            "The number of features used in the model",
            "The total training time in seconds",
        ],
        correctIndex: 0,
        explanation:
            "R² ranges typically from 0 to 1 (though it can go negative for a poor fit), representing how much of the variability in the actual outcome is captured by the model compared to simply predicting the mean every time. An R² of 0.8 suggests the model explains 80% of the variance in the target.",
    },
    {
        id: "ml-eval-11",
        topicId: "model-evaluation-metrics",
        question: "What is a 'false positive' in binary classification?",
        options: [
            "The model predicted the positive class, but the actual label was negative",
            "The model predicted the negative class, but the actual label was positive",
            "The model correctly predicted the positive class",
            "The model made no prediction at all",
        ],
        correctIndex: 0,
        explanation:
            "A false positive is a type of error where the model raises a positive prediction (e.g. 'this email is spam') when the ground truth is actually negative (the email was legitimate). This is distinct from a false negative, where the model misses an actual positive case.",
    },
    {
        id: "ml-eval-12",
        topicId: "model-evaluation-metrics",
        question: "Why should a test set be evaluated only once, ideally at the very end of model development?",
        options: [
            "Repeatedly tuning a model based on test set performance risks overfitting to that specific test set, giving an overly optimistic and unreliable performance estimate",
            "Test sets can only be evaluated a single time due to a technical limitation of most ML libraries",
            "It has no practical impact on the reliability of the reported performance",
            "The test set becomes corrupted after the first evaluation",
        ],
        correctIndex: 0,
        explanation:
            "If you repeatedly adjust your model or hyperparameters based on test set results, you're effectively using the test set to guide training decisions, which means it's no longer a fair, unseen measure of generalization — that's why a validation set is used for iterative tuning, reserving the test set for a final, one-time check.",
    },
    {
        id: "ml-eval-13",
        topicId: "model-evaluation-metrics",
        question: "What is Mean Absolute Error (MAE), and how does it differ from Mean Squared Error (MSE)?",
        options: [
            "MAE averages the absolute value of prediction errors, treating all error sizes proportionally, while MSE squares errors, penalizing large errors more heavily",
            "MAE and MSE are identical formulas with different names",
            "MAE is used only for classification, while MSE is used only for regression",
            "MAE always produces a larger numerical value than MSE",
        ],
        correctIndex: 0,
        explanation:
            "MAE computes the average of |predicted − actual| across all examples, so a single large error contributes proportionally to its size. MSE squares each error before averaging, which means large errors are penalized disproportionately more than small ones, making MSE more sensitive to outliers than MAE.",
    },
    {
        id: "ml-eval-14",
        topicId: "model-evaluation-metrics",
        question: "What does 'specificity' measure in a classification context?",
        options: [
            "The proportion of actual negatives that were correctly identified as negative",
            "The proportion of predicted positives that were actually correct",
            "The overall percentage of correct predictions across both classes",
            "The average magnitude of prediction errors",
        ],
        correctIndex: 0,
        explanation:
            "Specificity (also called the true negative rate) measures how well a model avoids false alarms among the actual negative cases — it's calculated as true negatives / (true negatives + false positives), and is often reported alongside recall (the true positive rate) for a fuller picture of classifier performance.",
    },
    {
        id: "ml-eval-15",
        topicId: "model-evaluation-metrics",
        question: "Why is it important to evaluate a model on data it hasn't seen during training?",
        options: [
            "Performance on training data doesn't reveal how well the model will generalize to new, real-world examples",
            "Models are physically unable to make predictions on data used during training",
            "Training data is always mislabeled, so its results are unreliable",
            "Evaluating on training data is required by most machine learning libraries",
        ],
        correctIndex: 0,
        explanation:
            "A model can achieve near-perfect performance on data it has memorized during training, but that says nothing about how it will perform on new inputs. Held-out validation and test sets simulate 'unseen' real-world data, giving a much more honest picture of practical generalization ability.",
    },
];

export const overfittingRegularizationQuestions = [
    {
        id: "ml-overfit-01",
        topicId: "overfitting-regularization",
        question: "What is 'overfitting' in machine learning?",
        options: [
            "When a model learns the training data too closely, including its noise, resulting in poor generalization to new data",
            "When a model is too simple to capture patterns in the training data",
            "When a model trains for too few epochs to learn anything useful",
            "When a dataset contains too many missing values",
        ],
        correctIndex: 0,
        explanation:
            "An overfit model essentially memorizes idiosyncrasies and noise specific to the training set rather than learning generalizable patterns. This shows up as very high accuracy on training data but noticeably worse performance on validation or test data.",
    },
    {
        id: "ml-overfit-02",
        topicId: "overfitting-regularization",
        question: "What is 'underfitting'?",
        options: [
            "When a model is too simple to capture the underlying patterns in the data, performing poorly on both training and test sets",
            "When a model performs excellently on training data but poorly on test data",
            "When a dataset has too many features",
            "When a model has been trained for too many epochs",
        ],
        correctIndex: 0,
        explanation:
            "Underfitting occurs when a model lacks the capacity (or hasn't trained long enough) to learn even the basic patterns present in the training data itself, resulting in poor performance across the board — unlike overfitting, where training performance looks great but generalization suffers.",
    },
    {
        id: "ml-overfit-03",
        topicId: "overfitting-regularization",
        question: "How does L2 regularization (also called Ridge regression in linear models) help prevent overfitting?",
        options: [
            "It adds a penalty term to the loss function based on the squared magnitude of the weights, discouraging overly large weight values",
            "It removes a fixed percentage of the training data before training begins",
            "It doubles the number of layers in the network automatically",
            "It only works for classification tasks, never regression",
        ],
        correctIndex: 0,
        explanation:
            "By adding a term proportional to the sum of squared weights to the loss function, L2 regularization discourages the model from relying too heavily on any single feature or fitting overly complex, high-magnitude weight patterns that might just capture noise in the training data.",
    },
    {
        id: "ml-overfit-04",
        topicId: "overfitting-regularization",
        question: "What is 'dropout', as used in training neural networks?",
        options: [
            "Randomly deactivating a fraction of neurons during each training iteration to prevent the network from over-relying on specific neurons",
            "Permanently removing entire layers from the network architecture",
            "A technique used only to speed up inference after training is complete",
            "A method for reducing the size of the training dataset",
        ],
        correctIndex: 0,
        explanation:
            "During each training step, dropout randomly sets a fraction of neuron activations to zero, forcing the remaining active neurons to learn more robust, redundant representations rather than co-adapting too tightly with specific other neurons. At inference time, dropout is typically turned off.",
    },
    {
        id: "ml-overfit-05",
        topicId: "overfitting-regularization",
        question: "What is 'early stopping' as a regularization technique?",
        options: [
            "Halting training once performance on a validation set stops improving, even if training loss is still decreasing",
            "Stopping training after exactly one epoch regardless of performance",
            "Never training a model past 50% accuracy",
            "Removing early layers from a neural network",
        ],
        correctIndex: 0,
        explanation:
            "As training continues, a model may keep reducing training loss while validation loss starts to rise — a sign of overfitting. Early stopping monitors validation performance and halts training at (or restores the weights from) the point where validation performance was best, before overfitting sets in.",
    },
    {
        id: "ml-overfit-06",
        topicId: "overfitting-regularization",
        question: "What does the 'bias-variance tradeoff' describe?",
        options: [
            "The balance between a model being too simple (high bias, underfitting) and too complex (high variance, overfitting)",
            "The tradeoff between using labeled versus unlabeled data",
            "The choice between using a GPU or CPU for training",
            "The relationship between precision and recall specifically",
        ],
        correctIndex: 0,
        explanation:
            "High-bias models make strong simplifying assumptions and tend to underfit, while high-variance models are very sensitive to the specific training data and tend to overfit. The goal is to find a sweet spot of model complexity that minimizes total error from both sources on unseen data.",
    },
    {
        id: "ml-overfit-07",
        topicId: "overfitting-regularization",
        question: "How can increasing the size of the training dataset help combat overfitting?",
        options: [
            "More diverse examples make it harder for the model to simply memorize noise, encouraging it to learn genuinely generalizable patterns",
            "It always guarantees the model will never overfit again",
            "It has no effect on overfitting whatsoever",
            "It only helps with underfitting, not overfitting",
        ],
        correctIndex: 0,
        explanation:
            "With a small dataset, a sufficiently complex model can essentially memorize every example, including its noise. As the dataset grows and becomes more representative and diverse, memorizing every quirk becomes less feasible relative to the model's capacity, pushing it toward learning broader, more generalizable patterns instead.",
    },
    {
        id: "ml-overfit-08",
        topicId: "overfitting-regularization",
        question: "What is data augmentation, and how does it relate to reducing overfitting?",
        options: [
            "Artificially expanding the training set by creating modified versions of existing examples (like rotated images), exposing the model to more variation",
            "Deleting duplicate rows from a dataset",
            "A technique exclusively used for text data, not images",
            "A method for labeling previously unlabeled data automatically",
        ],
        correctIndex: 0,
        explanation:
            "Data augmentation applies label-preserving transformations — such as flipping, rotating, or cropping images, or paraphrasing text — to generate additional training examples. This exposes the model to more variation without collecting new data, which can reduce its tendency to overfit to the specific examples it was given.",
    },
    {
        id: "ml-overfit-09",
        topicId: "overfitting-regularization",
        question: "What is L1 regularization, and how does its effect differ from L2?",
        options: [
            "L1 adds a penalty based on the absolute value of weights and tends to push some weights exactly to zero, effectively performing feature selection",
            "L1 and L2 regularization are mathematically identical",
            "L1 only applies to the bias term, never the weights",
            "L1 regularization increases model complexity rather than reducing it",
        ],
        correctIndex: 0,
        explanation:
            "L1 regularization penalizes the sum of absolute weight values rather than squared values (as in L2). This penalty shape tends to drive some weights all the way to exactly zero, effectively removing those features from the model — a useful property when you want automatic feature selection alongside regularization.",
    },
    {
        id: "ml-overfit-10",
        topicId: "overfitting-regularization",
        question: "What visual pattern in a learning curve (training loss vs. validation loss over epochs) typically signals overfitting?",
        options: [
            "Training loss keeps decreasing while validation loss starts increasing after some point",
            "Both training and validation loss decrease together and plateau at similar values",
            "Training loss stays flat and high throughout training",
            "Validation loss is always lower than training loss in every scenario",
        ],
        correctIndex: 0,
        explanation:
            "A divergence where the training loss continues to fall but validation loss begins climbing indicates the model is increasingly fitting patterns specific to the training set (including noise) at the expense of generalizing well to new data — a textbook overfitting signature.",
    },
    {
        id: "ml-overfit-11",
        topicId: "overfitting-regularization",
        question: "Why is model complexity (e.g. number of parameters relative to dataset size) related to the risk of overfitting?",
        options: [
            "A model with many more parameters than the amount of training data can more easily memorize the training set rather than learning general patterns",
            "More parameters always guarantee better generalization regardless of dataset size",
            "Model complexity has no meaningful relationship to overfitting",
            "Simpler models always overfit more than complex models",
        ],
        correctIndex: 0,
        explanation:
            "A highly flexible model with many parameters has the capacity to fit almost any pattern in a limited dataset, including random noise, which is a hallmark of overfitting. This is why regularization techniques and having sufficient data relative to model size both matter for keeping a complex model's generalization in check.",
    },
    {
        id: "ml-overfit-12",
        topicId: "overfitting-regularization",
        question: "What is the purpose of a held-out validation set specifically in the context of tuning regularization strength?",
        options: [
            "It provides a way to compare different regularization settings and select the one that generalizes best, without touching the final test set",
            "It is used to permanently store the model's regularization parameters",
            "It replaces the need for regularization entirely",
            "It can only be used once at the very start of training",
        ],
        correctIndex: 0,
        explanation:
            "Since regularization strength (like the L2 penalty coefficient) is a hyperparameter, practitioners typically train several models with different strengths and compare their performance on a validation set to choose the setting that balances underfitting and overfitting best, saving the test set for a final unbiased check.",
    },
    {
        id: "ml-overfit-13",
        topicId: "overfitting-regularization",
        question: "How does reducing the number of features (or using dimensionality reduction) help address overfitting?",
        options: [
            "Fewer input dimensions reduce the model's opportunity to fit noise or irrelevant correlations specific to the training data",
            "It always increases the model's variance without exception",
            "It has no relationship to a model's tendency to overfit",
            "It only works for unsupervised learning models",
        ],
        correctIndex: 0,
        explanation:
            "With very high-dimensional data relative to the number of examples, a model has more opportunities to find spurious patterns or correlations that don't hold up on new data. Reducing the feature space — through feature selection or techniques like PCA — can lower this risk by focusing the model on the most informative signal.",
    },
    {
        id: "ml-overfit-14",
        topicId: "overfitting-regularization",
        question: "In neural networks, what does 'weight decay' typically refer to?",
        options: [
            "Another common name for L2 regularization, which shrinks weights toward zero during training",
            "A process where neuron weights are permanently deleted after training completes",
            "The gradual reduction of the learning rate over time",
            "A method for compressing a trained model's file size",
        ],
        correctIndex: 0,
        explanation:
            "Weight decay is essentially the same mechanism as L2 regularization applied during optimization — it adds a term that shrinks weight values slightly on each update, discouraging the network from developing excessively large weights that might be overfitting to specific training examples.",
    },
    {
        id: "ml-overfit-15",
        topicId: "overfitting-regularization",
        question: "Why is cross-validation particularly useful when working with a small dataset, in relation to overfitting concerns?",
        options: [
            "It makes more efficient use of limited data by rotating which portion is used for testing, giving a more reliable estimate of generalization than a single split",
            "It artificially increases the total number of data points available",
            "It removes the need for any regularization technique",
            "It only works when the dataset has more than one million examples",
        ],
        correctIndex: 0,
        explanation:
            "With limited data, a single train/test split might, by chance, produce an unusually easy or hard test set, giving a misleading sense of how much the model has overfit. Cross-validation cycles through multiple splits and averages the results, making better use of scarce data to produce a more trustworthy generalization estimate.",
    },
];

export const featureEngineeringQuestions = [
    {
        id: "ml-feature-01",
        topicId: "feature-engineering",
        question: "What is 'feature engineering' in the context of machine learning?",
        options: [
            "The process of creating, transforming, or selecting input variables to improve a model's ability to learn patterns",
            "The process of designing the visual interface for a machine learning application",
            "Writing the code that trains the neural network",
            "Selecting which cloud provider to use for deployment",
        ],
        correctIndex: 0,
        explanation:
            "Feature engineering involves shaping the raw data into a form that better exposes the underlying patterns to a model — this could mean creating new derived variables, encoding categories numerically, scaling values, or removing irrelevant columns, all with the goal of improving model performance.",
    },
    {
        id: "ml-feature-02",
        topicId: "feature-engineering",
        question: "What is 'one-hot encoding' used for?",
        options: [
            "Converting a categorical variable into multiple binary columns, one per category, so it can be used numerically by a model",
            "Compressing numerical features into a single combined column",
            "Removing outliers from a continuous feature",
            "Normalizing a feature to have a mean of 0 and standard deviation of 1",
        ],
        correctIndex: 0,
        explanation:
            "For a categorical feature like 'color' with values red/green/blue, one-hot encoding creates three separate binary columns (is_red, is_green, is_blue), each set to 1 or 0. This avoids implying a false numerical ordering that would occur if categories were simply mapped to 1, 2, 3.",
    },
    {
        id: "ml-feature-03",
        topicId: "feature-engineering",
        question: "Why is feature scaling (like normalization or standardization) important for many machine learning algorithms?",
        options: [
            "Features with very different numerical ranges can disproportionately influence distance-based or gradient-based algorithms if left unscaled",
            "It is only relevant for image data, not tabular data",
            "It guarantees a model will never overfit",
            "It automatically removes any need for feature selection",
        ],
        correctIndex: 0,
        explanation:
            "Algorithms like k-nearest neighbors or gradient descent-based models can be heavily skewed by features on vastly different scales — a feature ranging from 0 to 1,000,000 can dominate distance calculations or gradient updates compared to one ranging from 0 to 1, even if both are equally informative. Scaling puts features on comparable footing.",
    },
    {
        id: "ml-feature-04",
        topicId: "feature-engineering",
        question: "What is the difference between normalization and standardization as feature scaling techniques?",
        options: [
            "Normalization typically rescales values to a fixed range like [0, 1], while standardization rescales to have a mean of 0 and standard deviation of 1",
            "They are exactly the same technique with different names",
            "Normalization only works on categorical data, standardization only on numerical data",
            "Standardization always produces values between 0 and 1",
        ],
        correctIndex: 0,
        explanation:
            "Min-max normalization maps the minimum and maximum of a feature to a fixed range (commonly 0 and 1). Standardization (z-score scaling) instead subtracts the mean and divides by the standard deviation, producing values centered at 0 that reflect how many standard deviations each point is from the mean — the values aren't bounded to a fixed range.",
    },
    {
        id: "ml-feature-05",
        topicId: "feature-engineering",
        question: "What is a common strategy for handling missing values in a feature during preprocessing?",
        options: [
            "Imputing the missing values with a statistic like the mean, median, or mode, or using a model-based imputation method",
            "Always deleting the entire dataset if any value is missing",
            "Missing values must always be replaced with zero regardless of context",
            "Missing values cannot be handled and always prevent training",
        ],
        correctIndex: 0,
        explanation:
            "Depending on the situation, missing values might be filled in (imputed) using simple statistics like the column mean or median, a more sophisticated model-based prediction, or sometimes represented with an additional 'is_missing' indicator feature — the right strategy depends on why the data is missing and how much is missing.",
    },
    {
        id: "ml-feature-06",
        topicId: "feature-engineering",
        question: "What does creating a 'polynomial feature' (e.g. adding x² as a new feature alongside x) accomplish?",
        options: [
            "It allows a linear model to capture non-linear relationships between the original feature and the target",
            "It removes noise from the original feature entirely",
            "It converts a numerical feature into a categorical one",
            "It only works for image classification tasks",
        ],
        correctIndex: 0,
        explanation:
            "A plain linear model can only fit straight-line relationships between a feature and the target. By explicitly adding x², x³, or interaction terms as new features, a linear model gains the ability to fit curved relationships, effectively expanding what patterns it can represent.",
    },
    {
        id: "ml-feature-07",
        topicId: "feature-engineering",
        question: "What is 'feature selection', and why is it useful?",
        options: [
            "Choosing a subset of the most relevant features to use for modeling, which can reduce overfitting and improve interpretability",
            "Randomly deleting half of the dataset's rows",
            "A process that only applies after a model has already been deployed",
            "Selecting which programming language to implement features in",
        ],
        correctIndex: 0,
        explanation:
            "Not every feature in a dataset is necessarily useful, and irrelevant or redundant features can add noise, increase training time, and raise overfitting risk. Feature selection techniques (like removing low-variance features or using statistical tests) identify and keep only the most informative subset.",
    },
    {
        id: "ml-feature-08",
        topicId: "feature-engineering",
        question: "In a dataset with a 'date' column, what is an example of useful feature engineering?",
        options: [
            "Extracting components like day of week, month, or whether it's a holiday as separate features",
            "Converting the entire date into a single random number",
            "Deleting the date column since dates cannot be used as features",
            "Feature engineering never applies to date or time data",
        ],
        correctIndex: 0,
        explanation:
            "A raw timestamp is often less useful to a model directly than its derived components — a model might benefit far more from knowing 'this was a Saturday' or 'this was in December' as separate features, since these can carry meaningful predictive signal (like weekend shopping patterns or holiday spikes).",
    },
    {
        id: "ml-feature-09",
        topicId: "feature-engineering",
        question: "What is an 'interaction feature' in feature engineering?",
        options: [
            "A new feature created by combining two or more existing features to capture their combined effect (e.g. multiplying them together)",
            "A feature that only exists in real-time streaming data",
            "A feature used exclusively in unsupervised clustering",
            "A feature that automatically updates itself after deployment",
        ],
        correctIndex: 0,
        explanation:
            "Sometimes the effect of one feature depends on the value of another — for example, the effect of 'square footage' on house price might depend on 'neighborhood'. An interaction feature, like multiplying square footage by a neighborhood indicator, can let a model directly capture that combined relationship.",
    },
    {
        id: "ml-feature-10",
        topicId: "feature-engineering",
        question: "Why might a data scientist apply a log transformation to a skewed numerical feature, like income?",
        options: [
            "It can compress a wide range of values and reduce the influence of extreme outliers, making the distribution more symmetric",
            "It always converts the feature into a categorical variable",
            "It guarantees the model will achieve perfect accuracy",
            "It removes the feature from the dataset entirely",
        ],
        correctIndex: 0,
        explanation:
            "Features like income or population often have a long right tail, with a small number of very large values. Taking the logarithm compresses that tail, making the distribution more symmetric and often more suitable for models (particularly linear ones) that assume roughly normal or evenly spread data.",
    },
    {
        id: "ml-feature-11",
        topicId: "feature-engineering",
        question: "What is 'target leakage' in the context of feature engineering, and why is it a problem?",
        options: [
            "When a feature inadvertently contains information about the target that wouldn't be available at prediction time, leading to unrealistically good training performance",
            "When the target variable is accidentally deleted from the dataset",
            "A technique used deliberately to boost validation accuracy",
            "A type of data augmentation applied to image datasets",
        ],
        correctIndex: 0,
        explanation:
            "Leakage happens when a feature is derived from or correlated with the target in a way that wouldn't be known at actual prediction time — for example, including 'total amount refunded' as a feature when predicting whether an order will be returned. Models trained with leaked features look deceptively accurate but fail in real-world deployment.",
    },
    {
        id: "ml-feature-12",
        topicId: "feature-engineering",
        question: "What is 'binning' (or discretization) as a feature engineering technique?",
        options: [
            "Converting a continuous numerical feature into discrete categories or ranges (e.g. age into '0-18', '19-35', '36+')",
            "Combining multiple categorical features into one numerical feature",
            "Removing all numerical features from a dataset",
            "A technique that only applies to text data",
        ],
        correctIndex: 0,
        explanation:
            "Binning groups continuous values into discrete buckets, which can help capture non-linear effects, reduce the impact of minor fluctuations or outliers, and sometimes make patterns easier for certain models (or human interpretation) to pick up on, at the cost of losing some granularity in the original values.",
    },
    {
        id: "ml-feature-13",
        topicId: "feature-engineering",
        question: "Why might label encoding (mapping categories to integers like 0, 1, 2) be inappropriate for a nominal categorical feature?",
        options: [
            "It implies a false ordinal relationship between categories that don't actually have a meaningful order",
            "Label encoding can only be applied to numerical features, never categorical ones",
            "It always increases the dataset's size significantly",
            "It is technically impossible to implement in most programming languages",
        ],
        correctIndex: 0,
        explanation:
            "If 'red', 'green', and 'blue' are encoded as 0, 1, and 2, a model might incorrectly infer that blue is somehow 'greater than' green, or that the categories have a meaningful numeric distance between them — a relationship that doesn't exist for nominal (unordered) categories. One-hot encoding avoids this false assumption.",
    },
    {
        id: "ml-feature-14",
        topicId: "feature-engineering",
        question: "What is the purpose of removing or capping outliers during feature engineering?",
        options: [
            "Extreme values can disproportionately skew statistics and model training, so handling them can improve robustness",
            "Outliers must always be deleted from every dataset without exception",
            "It guarantees a model will achieve 100% accuracy",
            "Outliers only occur in categorical features, never numerical ones",
        ],
        correctIndex: 0,
        explanation:
            "A single extreme value can dramatically shift a feature's mean or a model's fitted parameters, especially for algorithms sensitive to scale like linear regression. Depending on context, practitioners might cap outliers at a reasonable percentile, transform the feature (e.g. with a log), or investigate whether the outlier represents a data error versus a genuine rare event.",
    },
    {
        id: "ml-feature-15",
        topicId: "feature-engineering",
        question: "Why is domain knowledge often considered essential for effective feature engineering?",
        options: [
            "Understanding the real-world context helps identify which derived features are likely to carry meaningful predictive signal",
            "Domain knowledge has no bearing on which features are useful for a model",
            "Feature engineering can only be performed by domain experts, never data scientists",
            "Domain knowledge is only relevant for unsupervised learning tasks",
        ],
        correctIndex: 0,
        explanation:
            "Knowing, for instance, that mortgage default risk is affected by debt-to-income ratio (rather than debt or income alone) lets a practitioner engineer that specific ratio as a feature. Purely automated approaches can miss such domain-specific insights, which is why collaboration between domain experts and data scientists often improves feature quality substantially.",
    },
];