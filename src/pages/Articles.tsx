
import {Header} from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

const Articles = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const articles = [
    {
      title: "The Ethics of AI: Balancing Innovation with Responsibility",
      description: "Exploring the moral implications of artificial intelligence development and the need for ethical guidelines in AI research.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
      category: "Articles",
      date: "2024-01-15",
      author: "Dr. Philosophy AI",
      readTime: "12 min read"
    },
    {
      title: "How AI is Transforming Healthcare: Opportunities and Challenges",
      description: "An in-depth look at artificial intelligence applications in medicine, from diagnosis to drug discovery.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop",
      category: "Articles",
      date: "2024-01-14",
      author: "Medical AI Expert",
      readTime: "15 min read"
    },
    {
      title: "The Future of Work in an AI-Powered World",
      description: "Analyzing how artificial intelligence will reshape job markets and what skills will be most valuable.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=300&fit=crop",
      category: "Articles",
      date: "2024-01-13",
      author: "Workforce Analyst",
      readTime: "10 min read"
    },
    {
      title: "Understanding AI Bias: Sources, Impact, and Mitigation Strategies",
      description: "Comprehensive analysis of bias in AI systems and practical approaches to building more fair and inclusive AI.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop",
      category: "Articles",
      date: "2024-01-12",
      author: "Ethics Researcher",
      readTime: "18 min read"
    },
    {
      title: "AI in Education: Personalizing Learning for Every Student",
      description: "How artificial intelligence is revolutionizing education through personalized learning paths and intelligent tutoring systems.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop",
      category: "Articles",
      date: "2024-01-11",
      author: "Education Tech Lead",
      readTime: "14 min read"
    },
    {
      title: "The Environmental Impact of AI: Sustainability in the Digital Age",
      description: "Examining the carbon footprint of AI systems and exploring sustainable approaches to artificial intelligence.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
      category: "Articles",
      date: "2024-01-10",
      author: "Green Tech Advocate",
      readTime: "11 min read"
    }
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Articles</h1>
          <p className="text-xl text-gray-600 mb-6">
            In-depth analysis, opinion pieces, and thought leadership on artificial intelligence and its impact on society.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-green-500"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter by Topic</span>
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
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Articles;
