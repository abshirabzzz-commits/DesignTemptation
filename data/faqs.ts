export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Design & Services" | "Pricing" | "Process" | "Execution";
}

export const FAQS: FAQItem[] = [
  {
    id: "faq-01",
    question: "What services does DESIGN TEMPTATION offer?",
    answer:
      "DESIGN TEMPTATION offers Interior Design, Architecture and Turnkey Execution services, tailored to the requirements of each project.",
    category: "Design & Services",
  },
  {
    id: "faq-02",
    question: "How does the design process work?",
    answer:
      "Our process typically begins with understanding your requirements, followed by concept development, design, visualization and execution coordination.",
    category: "Process",
  },
  {
    id: "faq-03",
    question: "Do you provide 3D visualizations?",
    answer:
      "Yes. 3D visualizations can be included to help you understand the proposed space, materials and overall design direction before execution.",
    category: "Design & Services",
  },
  {
    id: "faq-04",
    question: "How is the project cost calculated?",
    answer:
      "Project pricing depends on factors such as project type, area, design requirements, materials, specifications and execution scope. You can use our Cost Calculator for an initial estimate.",
    category: "Pricing",
  },
  {
    id: "faq-05",
    question: "Can I request a customized quotation?",
    answer:
      "Yes. Every project can have different requirements. Contact our studio with your project details and our team can provide a personalized quotation based on the scope.",
    category: "Pricing",
  },
  {
    id: "faq-06",
    question: "Do you handle turnkey projects?",
    answer:
      "Yes. Turnkey Execution is one of our services, allowing the approved design to be coordinated through the execution stage.",
    category: "Execution",
  },
];

// The 3 primary questions selected for the homepage preview
export const HOMEPAGE_FAQS: FAQItem[] = [
  FAQS[0], // What services does DESIGN TEMPTATION offer?
  FAQS[1], // How does the design process work?
  FAQS[3], // How is the project cost calculated?
];

export const FAQ_CATEGORIES = [
  "All",
  "Design & Services",
  "Process",
  "Pricing",
  "Execution",
] as const;

export type FAQCategory = (typeof FAQ_CATEGORIES)[number];
