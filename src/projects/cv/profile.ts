export const profile = {
  name: "Ke Dong",
  role: "Computer Science PhD student",
  location: "Manhattan, Kansas",
  email: "ked000@ksu.edu",
  github: "https://github.com/coliapaston",
  image: "/images/profile.png",
  introduction: {
    lead: "I am a Ph.D. student in Computer Science at Kansas State University, advised by",
    advisors: [
      {
        name: "Prof. Eugene Y. Vasserman",
        url: "https://people.cs.ksu.edu/~eyv/",
      },
      {
        name: "Prof. Pascal Hitzler",
        url: "https://people.cs.ksu.edu/~hitzler/",
      },
    ],
  },
  interests: [
    "Large language model representations",
    "Reliable and interpretable AI",
    "Knowledge representation",
    "Data visualization",
  ],
} as const

export const publications = [
  {
    year: "2026",
    title: "From Local Density to Lexical Features: A Cross-Scale Study of Unembedding Spaces",
    authors: "Ke Dong, Pascal Hitzler, and Eugene Y. Vasserman",
    venue: "MIWAI 2026 · Accepted, forthcoming",
    pdf: null,
  },
  {
    year: "2025",
    title: "On the Logical (In)consistency of Code-generating LLMs",
    authors: "Ke Dong, William Hsu, Pascal Hitzler, and Eugene Y. Vasserman",
    venue: "GenSE 2025",
    pdf: "/papers/codeLogic_2025.pdf",
  },
  {
    year: "2024",
    title: "On the Psychology of GPT-4: Moderately Anxious, Slightly Masculine, Honest, and Humble",
    authors: "Adrita Barua, Gary Brase, Ke Dong, Pascal Hitzler, and Eugene Vasserman",
    venue: "Preprint",
    pdf: "/papers/Psycho_GPT_2024.pdf",
  },
  {
    year: "2023",
    title: "Stock Price Movement Prediction Based on Relation Type Guided Graph Convolutional Network",
    authors: "Hao Peng, Ke Dong, and Jie Yang",
    venue: "EAAI 2023 · Journal",
    pdf: "/papers/stockPrice_2023.pdf",
  },
  {
    year: "2023",
    title: "Dynamic-static Cross Attentional Feature Fusion Method for Speech Emotion Recognition",
    authors: "Ke Dong, Hao Peng, and Jie Che",
    venue: "MMM 2023",
    pdf: "/papers/Dynamic_2023.pdf",
  },
  {
    year: "2021",
    title: "A Simulation Model Based on Artificial System to Analyze Correlation between Journal Impact Factor and Article Quality",
    authors: "Ke Dong, Yiran Wang, and Wen Fan",
    venue: "IWCMC 2021",
    pdf: "/papers/SMB_2021.pdf",
  },
] as const
