import type { ExamRecord } from '@/types/ExamContent'

export const examRecords: ExamRecord[] = [
  // userid 2 fails exam on first attempt senario
  {
    id: 'er-1',
    userId: '2',
    level: '1',
    score: 40,
    completedAt: '2026-06-01T09:15:00.000Z',
    passCriteria: 60,
    pass: false,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: 'What does "AI" stand for?',
        choices: ['Artificial Intelligence', 'Automated Interaction', 'Applied Informatics', 'Analog Input'],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: 'Which of the following is an example of an AI-powered application?',
        choices: ['A calculator', 'A voice assistant', 'A light switch', 'A paper map'],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: 'What is a "prompt" in the context of generative AI?',
        choices: ['A hardware component', 'An input given to an AI model', 'A type of database', 'A network protocol'],
        answerIndex: 1,
        selectedIndex: 2
      },
      {
        questionID: 'l1-q4',
        question: 'Which term describes an AI system trained on large amounts of text?',
        choices: ['Large Language Model', 'Local Loop Machine', 'Linear Logic Map', 'Layered List Manager'],
        answerIndex: 0,
        selectedIndex: 3
      },
      {
        questionID: 'l1-q5',
        question: 'Why is it important to verify AI-generated information?',
        choices: [
          'AI is always correct',
          'AI can produce inaccurate or fabricated content',
          'Verification is not necessary',
          'AI never uses training data'
        ],
        answerIndex: 1,
        selectedIndex: 0
      }
    ]
  },
  // userid 3 pass on first try
  {
    id: 'er-3',
    userId: '3',
    level: '1',
    score: 100,
    completedAt: '2026-06-10T14:30:00.000Z',
    passCriteria: 60,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: 'What does "AI" stand for?',
        choices: ['Artificial Intelligence', 'Automated Interaction', 'Applied Informatics', 'Analog Input'],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: 'Which of the following is an example of an AI-powered application?',
        choices: ['A calculator', 'A voice assistant', 'A light switch', 'A paper map'],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: 'What is a "prompt" in the context of generative AI?',
        choices: ['A hardware component', 'An input given to an AI model', 'A type of database', 'A network protocol'],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: 'Which term describes an AI system trained on large amounts of text?',
        choices: ['Large Language Model', 'Local Loop Machine', 'Linear Logic Map', 'Layered List Manager'],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: 'Why is it important to verify AI-generated information?',
        choices: [
          'AI is always correct',
          'AI can produce inaccurate or fabricated content',
          'Verification is not necessary',
          'AI never uses training data'
        ],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  // userid 4 pass level 3 exam
  {
    id: 'er-4',
    userId: '5',
    level: '3',
    score: 80,
    completedAt: '2026-06-20T11:00:00.000Z',
    passCriteria: 60,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l3-q1',
        question: 'What is a common risk of over-relying on AI-generated content without review?',
        choices: [
          'Improved factual accuracy',
          'Propagation of errors or misinformation',
          'Reduced need for oversight',
          'Guaranteed originality'
        ],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q2',
        question: 'In an AI project, what is the purpose of an evaluation metric?',
        choices: [
          'To measure how well a model performs on a task',
          'To store training data',
          'To render the user interface',
          'To manage version control'
        ],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l3-q3',
        question: 'What does "explainability" refer to in AI systems?',
        choices: [
          'The speed of the model',
          'The ability to understand and interpret how a model reaches a decision',
          'The cost of running the model',
          'The size of the training dataset'
        ],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q4',
        question: 'Why might a project team conduct an AI ethics review?',
        choices: [
          'To skip regulatory requirements',
          'To identify and mitigate harms before deployment',
          'To increase model bias',
          'To reduce transparency'
        ],
        answerIndex: 1,
        selectedIndex: 0
      },
      {
        questionID: 'l3-q5',
        question: 'What is a benefit of mentoring others on AI projects?',
        choices: [
          'It slows down knowledge transfer',
          'It helps spread best practices and responsible use',
          'It has no effect on project quality',
          'It is discouraged in professional settings'
        ],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-5',
    userId: '4',
    level: '1',
    score: 100,
    completedAt: '2026-05-11T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-6',
    userId: '4',
    level: '2',
    score: 100,
    completedAt: '2026-05-13T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-7',
    userId: '5',
    level: '1',
    score: 100,
    completedAt: '2026-05-15T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-8',
    userId: '5',
    level: '2',
    score: 100,
    completedAt: '2026-05-17T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-9',
    userId: '6',
    level: '1',
    score: 100,
    completedAt: '2026-05-19T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-10',
    userId: '6',
    level: '2',
    score: 100,
    completedAt: '2026-05-21T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-11',
    userId: '7',
    level: '1',
    score: 100,
    completedAt: '2026-05-23T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-12',
    userId: '7',
    level: '2',
    score: 100,
    completedAt: '2026-05-25T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-13',
    userId: '9',
    level: '1',
    score: 100,
    completedAt: '2026-05-27T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-14',
    userId: '10',
    level: '1',
    score: 100,
    completedAt: '2026-05-29T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-15',
    userId: '10',
    level: '2',
    score: 100,
    completedAt: '2026-05-31T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-16',
    userId: '11',
    level: '1',
    score: 100,
    completedAt: '2026-06-02T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-17',
    userId: '11',
    level: '2',
    score: 100,
    completedAt: '2026-06-04T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-18',
    userId: '11',
    level: '3',
    score: 100,
    completedAt: '2026-06-06T09:00:00.000Z',
    passCriteria: 80,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l3-q1',
        question: "What is a common risk of over-relying on AI-generated content without review?",
        choices: ["Improved factual accuracy", "Propagation of errors or misinformation", "Reduced need for oversight", "Guaranteed originality"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q2',
        question: "In an AI project, what is the purpose of an evaluation metric?",
        choices: ["To measure how well a model performs on a task", "To store training data", "To render the user interface", "To manage version control"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l3-q3',
        question: "What does \"explainability\" refer to in AI systems?",
        choices: ["The speed of the model", "The ability to understand and interpret how a model reaches a decision", "The cost of running the model", "The size of the training dataset"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q4',
        question: "Why might a project team conduct an AI ethics review?",
        choices: ["To skip regulatory requirements", "To identify and mitigate harms before deployment", "To increase model bias", "To reduce transparency"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q5',
        question: "What is a benefit of mentoring others on AI projects?",
        choices: ["It slows down knowledge transfer", "It helps spread best practices and responsible use", "It has no effect on project quality", "It is discouraged in professional settings"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-19',
    userId: '13',
    level: '1',
    score: 100,
    completedAt: '2026-06-08T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-20',
    userId: '14',
    level: '1',
    score: 100,
    completedAt: '2026-06-10T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-21',
    userId: '14',
    level: '2',
    score: 100,
    completedAt: '2026-06-12T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-22',
    userId: '15',
    level: '1',
    score: 100,
    completedAt: '2026-06-14T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-23',
    userId: '15',
    level: '2',
    score: 100,
    completedAt: '2026-06-16T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-24',
    userId: '15',
    level: '3',
    score: 100,
    completedAt: '2026-06-18T09:00:00.000Z',
    passCriteria: 80,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l3-q1',
        question: "What is a common risk of over-relying on AI-generated content without review?",
        choices: ["Improved factual accuracy", "Propagation of errors or misinformation", "Reduced need for oversight", "Guaranteed originality"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q2',
        question: "In an AI project, what is the purpose of an evaluation metric?",
        choices: ["To measure how well a model performs on a task", "To store training data", "To render the user interface", "To manage version control"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l3-q3',
        question: "What does \"explainability\" refer to in AI systems?",
        choices: ["The speed of the model", "The ability to understand and interpret how a model reaches a decision", "The cost of running the model", "The size of the training dataset"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q4',
        question: "Why might a project team conduct an AI ethics review?",
        choices: ["To skip regulatory requirements", "To identify and mitigate harms before deployment", "To increase model bias", "To reduce transparency"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q5',
        question: "What is a benefit of mentoring others on AI projects?",
        choices: ["It slows down knowledge transfer", "It helps spread best practices and responsible use", "It has no effect on project quality", "It is discouraged in professional settings"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-25',
    userId: '17',
    level: '1',
    score: 100,
    completedAt: '2026-06-20T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-26',
    userId: '18',
    level: '1',
    score: 100,
    completedAt: '2026-06-22T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-27',
    userId: '18',
    level: '2',
    score: 100,
    completedAt: '2026-06-24T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-28',
    userId: '19',
    level: '1',
    score: 100,
    completedAt: '2026-06-26T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-29',
    userId: '19',
    level: '2',
    score: 100,
    completedAt: '2026-06-28T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-30',
    userId: '19',
    level: '3',
    score: 100,
    completedAt: '2026-06-30T09:00:00.000Z',
    passCriteria: 80,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l3-q1',
        question: "What is a common risk of over-relying on AI-generated content without review?",
        choices: ["Improved factual accuracy", "Propagation of errors or misinformation", "Reduced need for oversight", "Guaranteed originality"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q2',
        question: "In an AI project, what is the purpose of an evaluation metric?",
        choices: ["To measure how well a model performs on a task", "To store training data", "To render the user interface", "To manage version control"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l3-q3',
        question: "What does \"explainability\" refer to in AI systems?",
        choices: ["The speed of the model", "The ability to understand and interpret how a model reaches a decision", "The cost of running the model", "The size of the training dataset"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q4',
        question: "Why might a project team conduct an AI ethics review?",
        choices: ["To skip regulatory requirements", "To identify and mitigate harms before deployment", "To increase model bias", "To reduce transparency"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q5',
        question: "What is a benefit of mentoring others on AI projects?",
        choices: ["It slows down knowledge transfer", "It helps spread best practices and responsible use", "It has no effect on project quality", "It is discouraged in professional settings"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-31',
    userId: '21',
    level: '1',
    score: 100,
    completedAt: '2026-07-02T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-32',
    userId: '22',
    level: '1',
    score: 100,
    completedAt: '2026-07-04T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-33',
    userId: '22',
    level: '2',
    score: 100,
    completedAt: '2026-07-06T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-34',
    userId: '23',
    level: '1',
    score: 100,
    completedAt: '2026-07-08T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-35',
    userId: '23',
    level: '2',
    score: 100,
    completedAt: '2026-07-10T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-36',
    userId: '23',
    level: '3',
    score: 100,
    completedAt: '2026-07-12T09:00:00.000Z',
    passCriteria: 80,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l3-q1',
        question: "What is a common risk of over-relying on AI-generated content without review?",
        choices: ["Improved factual accuracy", "Propagation of errors or misinformation", "Reduced need for oversight", "Guaranteed originality"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q2',
        question: "In an AI project, what is the purpose of an evaluation metric?",
        choices: ["To measure how well a model performs on a task", "To store training data", "To render the user interface", "To manage version control"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l3-q3',
        question: "What does \"explainability\" refer to in AI systems?",
        choices: ["The speed of the model", "The ability to understand and interpret how a model reaches a decision", "The cost of running the model", "The size of the training dataset"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q4',
        question: "Why might a project team conduct an AI ethics review?",
        choices: ["To skip regulatory requirements", "To identify and mitigate harms before deployment", "To increase model bias", "To reduce transparency"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q5',
        question: "What is a benefit of mentoring others on AI projects?",
        choices: ["It slows down knowledge transfer", "It helps spread best practices and responsible use", "It has no effect on project quality", "It is discouraged in professional settings"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-37',
    userId: '25',
    level: '1',
    score: 100,
    completedAt: '2026-07-14T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-38',
    userId: '26',
    level: '1',
    score: 100,
    completedAt: '2026-07-16T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-39',
    userId: '26',
    level: '2',
    score: 100,
    completedAt: '2026-07-18T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-40',
    userId: '27',
    level: '1',
    score: 100,
    completedAt: '2026-07-20T09:00:00.000Z',
    passCriteria: 70,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l1-q1',
        question: "What does \"AI\" stand for?",
        choices: ["Artificial Intelligence", "Automated Interaction", "Applied Informatics", "Analog Input"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q2',
        question: "Which of the following is an example of an AI-powered application?",
        choices: ["A calculator", "A voice assistant", "A light switch", "A paper map"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q3',
        question: "What is a \"prompt\" in the context of generative AI?",
        choices: ["A hardware component", "An input given to an AI model", "A type of database", "A network protocol"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l1-q4',
        question: "Which term describes an AI system trained on large amounts of text?",
        choices: ["Large Language Model", "Local Loop Machine", "Linear Logic Map", "Layered List Manager"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l1-q5',
        question: "Why is it important to verify AI-generated information?",
        choices: ["AI is always correct", "AI can produce inaccurate or fabricated content", "Verification is not necessary", "AI never uses training data"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-41',
    userId: '27',
    level: '2',
    score: 100,
    completedAt: '2026-07-22T09:00:00.000Z',
    passCriteria: 75,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l2-q1',
        question: "What is \"machine learning\"?",
        choices: ["A method for AI systems to learn patterns from data", "A way to manually program every rule", "A type of computer hardware", "A programming language"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l2-q2',
        question: "What is the purpose of a training dataset?",
        choices: ["To store the final application code", "To teach a model patterns before it is used", "To display results to the user", "To encrypt user data"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q3',
        question: "What does \"bias\" mean in an AI model?",
        choices: ["A hardware defect", "Systematic errors that unfairly favor or disadvantage groups", "A type of encryption", "A network delay"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l2-q4',
        question: "Which practice helps protect personal data when using AI tools?",
        choices: ["Sharing all data publicly", "Avoiding data minimization", "Anonymizing or minimizing sensitive data before use", "Ignoring data privacy policies"],
        answerIndex: 2,
        selectedIndex: 2
      },
      {
        questionID: 'l2-q5',
        question: "What is \"fine-tuning\" a model?",
        choices: ["Deleting the model", "Further training a pre-trained model on a specific dataset", "Changing the model file name", "Compressing the model file size only"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  },
  {
    id: 'er-42',
    userId: '27',
    level: '3',
    score: 100,
    completedAt: '2026-07-24T09:00:00.000Z',
    passCriteria: 80,
    pass: true,
    questionsAsked: [
      {
        questionID: 'l3-q1',
        question: "What is a common risk of over-relying on AI-generated content without review?",
        choices: ["Improved factual accuracy", "Propagation of errors or misinformation", "Reduced need for oversight", "Guaranteed originality"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q2',
        question: "In an AI project, what is the purpose of an evaluation metric?",
        choices: ["To measure how well a model performs on a task", "To store training data", "To render the user interface", "To manage version control"],
        answerIndex: 0,
        selectedIndex: 0
      },
      {
        questionID: 'l3-q3',
        question: "What does \"explainability\" refer to in AI systems?",
        choices: ["The speed of the model", "The ability to understand and interpret how a model reaches a decision", "The cost of running the model", "The size of the training dataset"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q4',
        question: "Why might a project team conduct an AI ethics review?",
        choices: ["To skip regulatory requirements", "To identify and mitigate harms before deployment", "To increase model bias", "To reduce transparency"],
        answerIndex: 1,
        selectedIndex: 1
      },
      {
        questionID: 'l3-q5',
        question: "What is a benefit of mentoring others on AI projects?",
        choices: ["It slows down knowledge transfer", "It helps spread best practices and responsible use", "It has no effect on project quality", "It is discouraged in professional settings"],
        answerIndex: 1,
        selectedIndex: 1
      }
    ]
  }
]
