import type { ExamQuestion } from '@/types/ExamContent'

export const questions: ExamQuestion[] = [
  // Level 1
  {
    id: 'l1-q1',
    question: 'What does "AI" stand for?',
    choices: ['Artificial Intelligence', 'Automated Interaction', 'Applied Informatics', 'Analog Input'],
    answerIndex: 0
  },
  {
    id: 'l1-q2',
    question: 'Which of the following is an example of an AI-powered application?',
    choices: ['A calculator', 'A voice assistant', 'A light switch', 'A paper map'],
    answerIndex: 1
  },
  {
    id: 'l1-q3',
    question: 'What is a "prompt" in the context of generative AI?',
    choices: ['A hardware component', 'An input given to an AI model', 'A type of database', 'A network protocol'],
    answerIndex: 1
  },
  {
    id: 'l1-q4',
    question: 'Which term describes an AI system trained on large amounts of text?',
    choices: ['Large Language Model', 'Local Loop Machine', 'Linear Logic Map', 'Layered List Manager'],
    answerIndex: 0
  },
  {
    id: 'l1-q5',
    question: 'Why is it important to verify AI-generated information?',
    choices: [
      'AI is always correct',
      'AI can produce inaccurate or fabricated content',
      'Verification is not necessary',
      'AI never uses training data'
    ],
    answerIndex: 1
  },

  // Level 2
  {
    id: 'l2-q1',
    question: 'What is "machine learning"?',
    choices: [
      'A method for AI systems to learn patterns from data',
      'A way to manually program every rule',
      'A type of computer hardware',
      'A programming language'
    ],
    answerIndex: 0
  },
  {
    id: 'l2-q2',
    question: 'What is the purpose of a training dataset?',
    choices: [
      'To store the final application code',
      'To teach a model patterns before it is used',
      'To display results to the user',
      'To encrypt user data'
    ],
    answerIndex: 1
  },
  {
    id: 'l2-q3',
    question: 'What does "bias" mean in an AI model?',
    choices: [
      'A hardware defect',
      'Systematic errors that unfairly favor or disadvantage groups',
      'A type of encryption',
      'A network delay'
    ],
    answerIndex: 1
  },
  {
    id: 'l2-q4',
    question: 'Which practice helps protect personal data when using AI tools?',
    choices: [
      'Sharing all data publicly',
      'Avoiding data minimization',
      'Anonymizing or minimizing sensitive data before use',
      'Ignoring data privacy policies'
    ],
    answerIndex: 2
  },
  {
    id: 'l2-q5',
    question: 'What is "fine-tuning" a model?',
    choices: [
      'Deleting the model',
      'Further training a pre-trained model on a specific dataset',
      'Changing the model file name',
      'Compressing the model file size only'
    ],
    answerIndex: 1
  },

  // Level 3
  {
    id: 'l3-q1',
    question: 'What is a common risk of over-relying on AI-generated content without review?',
    choices: [
      'Improved factual accuracy',
      'Propagation of errors or misinformation',
      'Reduced need for oversight',
      'Guaranteed originality'
    ],
    answerIndex: 1
  },
  {
    id: 'l3-q2',
    question: 'In an AI project, what is the purpose of an evaluation metric?',
    choices: [
      'To measure how well a model performs on a task',
      'To store training data',
      'To render the user interface',
      'To manage version control'
    ],
    answerIndex: 0
  },
  {
    id: 'l3-q3',
    question: 'What does "explainability" refer to in AI systems?',
    choices: [
      'The speed of the model',
      'The ability to understand and interpret how a model reaches a decision',
      'The cost of running the model',
      'The size of the training dataset'
    ],
    answerIndex: 1
  },
  {
    id: 'l3-q4',
    question: 'Why might a project team conduct an AI ethics review?',
    choices: [
      'To skip regulatory requirements',
      'To identify and mitigate harms before deployment',
      'To increase model bias',
      'To reduce transparency'
    ],
    answerIndex: 1
  },
  {
    id: 'l3-q5',
    question: 'What is a benefit of mentoring others on AI projects?',
    choices: [
      'It slows down knowledge transfer',
      'It helps spread best practices and responsible use',
      'It has no effect on project quality',
      'It is discouraged in professional settings'
    ],
    answerIndex: 1
  },

  // Level 4
  {
    id: 'l4-q1',
    question: 'What distinguishes an expert-level AI practitioner from a beginner?',
    choices: [
      'Ability to design, evaluate, and govern AI systems responsibly',
      'Only knowing how to use a chatbot',
      'Avoiding all technical documentation',
      'Never questioning model outputs'
    ],
    answerIndex: 0
  },
  {
    id: 'l4-q2',
    question: 'What is a key consideration when deploying an AI system at scale?',
    choices: [
      'Ignoring monitoring after launch',
      'Ongoing monitoring, governance, and risk management',
      'Removing all human oversight',
      'Disabling logging'
    ],
    answerIndex: 1
  },
  {
    id: 'l4-q3',
    question: 'What role does an AI ambassador or certified expert typically play in a community?',
    choices: [
      'Restricting access to AI knowledge',
      'Educating and guiding others on responsible AI adoption',
      'Avoiding public speaking',
      'Discouraging collaboration'
    ],
    answerIndex: 1
  },
  {
    id: 'l4-q4',
    question: 'Which is a hallmark of responsible AI governance?',
    choices: [
      'Clear accountability and documented decision-making processes',
      'No documentation of decisions',
      'Excluding stakeholders from review',
      'Ignoring regulatory guidance'
    ],
    answerIndex: 0
  },
  {
    id: 'l4-q5',
    question: 'Why is continuous learning important at the expert level?',
    choices: [
      'AI technology and best practices evolve rapidly',
      'AI knowledge never changes',
      'Expert certification is permanent and requires no updates',
      'Learning stops being useful at this stage'
    ],
    answerIndex: 0
  }
]
