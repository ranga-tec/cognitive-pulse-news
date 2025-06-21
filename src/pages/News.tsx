
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const newsArticles = [
    {
      title: "OpenAI Announces GPT-5 Development Timeline",
      description: "The latest updates on OpenAI's next-generation language model, including expected capabilities and release timeframe.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=300&fit=crop",
      category: "News",
      date: "2024-01-15",
      author: "Tech Reporter",
      readTime: "3 min read"
    },
    {
      title: "Google Introduces Gemini Ultra for Enterprise",
      description: "Google's most advanced AI model is now available for business customers with enhanced security and integration features.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop",
      category: "News",
      date: "2024-01-14",
      author: "Sarah Johnson",
      readTime: "4 min read"
    },
    {
      title: "Microsoft Copilot Integration Expands to More Office Apps",
      description: "AI assistant capabilities are rolling out to PowerPoint, Outlook, and other Microsoft 365 applications.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop",
      category: "News",
      date: "2024-01-13",
      author: "Mike Chen",
      readTime: "5 min read"
    },
    {
      title: "Meta's AI Research Breakthrough in Multimodal Understanding",
      description: "New research paper reveals significant advances in AI systems that can understand text, images, and audio simultaneously.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
      category: "News",
      date: "2024-01-12",
      author: "Dr. Lisa Wang",
      readTime: "6 min read"
    },
    {
      title: "AI Startups Raise Record $12B in Q4 2023 Funding",
      description: "Venture capital investment in artificial intelligence companies reaches new heights as the industry continues rapid growth.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
      category: "News",
      date: "2024-01-11",
      author: "Financial Analyst",
      readTime: "7 min read"
    },
    {
      title: "European AI Act Comes Into Effect: What It Means for Tech Companies",
      description: "The comprehensive AI regulation framework begins implementation across the European Union with significant implications for the industry.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop",
      category: "News",
      date: "2024-01-10",
      author: "Policy Reporter",
      readTime: "8 min read"
    }
  ];

  const filteredArticles = newsArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI News</h1>
          <p className="text-xl text-gray-600 mb-6">
            Stay updated with the latest developments, announcements, and trends in artificial intelligence.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-purple-500"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <PostCard key={index} {...article} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default News;
