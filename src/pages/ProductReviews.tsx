
import {Header} from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

const ProductReviews = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const reviews = [
    {
      title: "ChatGPT Plus vs Claude Pro vs Gemini Advanced: The Ultimate Comparison",
      description: "Comprehensive comparison of the leading AI chatbot subscriptions, testing performance, features, and value for money.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=300&fit=crop",
      category: "Product Reviews",
      date: "2024-01-15",
      author: "AI Tools Reviewer",
      readTime: "15 min read"
    },
    {
      title: "GitHub Copilot vs Cursor vs Codeium: AI Code Assistants Battle",
      description: "In-depth review of the top AI coding tools, comparing accuracy, features, pricing, and real-world performance.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop",
      category: "Product Reviews",
      date: "2024-01-14",
      author: "Developer Tools Expert",
      readTime: "18 min read"
    },
    {
      title: "Midjourney vs DALL-E 3 vs Stable Diffusion: AI Art Generator Showdown",
      description: "Complete comparison of the leading AI image generation tools, testing quality, features, and ease of use.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop",
      category: "Product Reviews",
      date: "2024-01-13",
      author: "Creative AI Specialist",
      readTime: "20 min read"
    },
    {
      title: "Notion AI Review: Is It Worth the Upgrade?",
      description: "Detailed review of Notion's AI features, testing writing assistance, data analysis, and productivity enhancements.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
      category: "Product Reviews",
      date: "2024-01-12",
      author: "Productivity Reviewer",
      readTime: "12 min read"
    },
    {
      title: "OpenAI API vs Anthropic Claude API: Developer's Perspective",
      description: "Technical comparison of major AI APIs, covering pricing, performance, reliability, and integration ease.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
      category: "Product Reviews",
      date: "2024-01-11",
      author: "API Developer",
      readTime: "16 min read"
    },
    {
      title: "Grammarly vs Jasper vs Copy.ai: AI Writing Assistant Comparison",
      description: "Testing the best AI writing tools for content creation, editing, and business communication needs.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop",
      category: "Product Reviews",
      date: "2024-01-10",
      author: "Content Creator",
      readTime: "14 min read"
    }
  ];

  const filteredReviews = reviews.filter(review =>
    review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Reviews</h1>
          <p className="text-xl text-gray-600 mb-6">
            Honest, in-depth reviews of AI tools, platforms, and services to help you make informed decisions.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search product reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-orange-500"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter by Category</span>
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review, index) => (
            <PostCard key={index} {...review} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
            Load More Reviews
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
