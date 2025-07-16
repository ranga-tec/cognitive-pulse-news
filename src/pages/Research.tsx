
import Header from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

const Research = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const researchPapers = [
    {
      title: "Attention Is All You Need: Revisiting Transformer Architecture",
      description: "Deep dive into the transformer architecture that revolutionized natural language processing and its ongoing evolution.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop",
      category: "Research",
      date: "2024-01-15",
      author: "Research Team",
      readTime: "25 min read"
    },
    {
      title: "Multimodal Large Language Models: Bridging Vision and Language",
      description: "Latest research on AI systems that can understand and generate both text and images simultaneously.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop",
      category: "Research",
      date: "2024-01-14",
      author: "Vision-Language Lab",
      readTime: "30 min read"
    },
    {
      title: "Reinforcement Learning from Human Feedback: Training AI to Align with Human Values",
      description: "Exploring RLHF techniques that make AI systems more helpful, harmless, and honest through human guidance.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
      category: "Research",
      date: "2024-01-13",
      author: "AI Safety Institute",
      readTime: "22 min read"
    },
    {
      title: "Few-Shot Learning: Teaching AI with Minimal Examples",
      description: "Research breakthrough in enabling AI models to learn new tasks with just a few training examples.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
      category: "Research",
      date: "2024-01-12",
      author: "Meta Learning Group",
      readTime: "20 min read"
    },
    {
      title: "Emergent Abilities in Large Language Models: When Scale Leads to New Capabilities",
      description: "Investigating how increasing model size leads to unexpected new abilities that weren't explicitly trained.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop",
      category: "Research",
      date: "2024-01-11",
      author: "Scaling Laws Lab",
      readTime: "28 min read"
    },
    {
      title: "Constitutional AI: Building AI Systems with Built-in Ethical Principles",
      description: "Novel approach to training AI systems that can self-regulate based on a set of constitutional principles.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=300&fit=crop",
      category: "Research",
      date: "2024-01-10",
      author: "AI Ethics Research",
      readTime: "24 min read"
    }
  ];

  const filteredResearch = researchPapers.filter(paper =>
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Research</h1>
          <p className="text-xl text-gray-600 mb-6">
            Cutting-edge research papers, breakthrough discoveries, and academic insights from the world of artificial intelligence.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search research papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter by Field</span>
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredResearch.length} research paper{filteredResearch.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResearch.map((paper, index) => (
            <PostCard key={index} {...paper} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
            Load More Research
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Research;
