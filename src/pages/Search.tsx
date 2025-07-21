
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {Header} from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Filter } from "lucide-react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Mock search results - in a real app, this would come from an API
  const allContent = [
    {
      title: "The Future of Large Language Models: What's Next After GPT-4",
      description: "Exploring the latest developments in AI language models and what researchers are working on for the next generation of AI systems.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=300&fit=crop",
      category: "Research",
      date: "2024-01-15",
      author: "Dr. Sarah Chen",
      readTime: "8 min read"
    },
    {
      title: "Building Your First AI Chatbot: Complete Tutorial",
      description: "Step-by-step guide to creating an intelligent chatbot using modern AI frameworks and deployment strategies.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop",
      category: "Tutorials",
      date: "2024-01-14",
      author: "Mike Rodriguez",
      readTime: "12 min read"
    },
    {
      title: "OpenAI Announces Major Updates to ChatGPT Enterprise",
      description: "New features include enhanced security, better integration capabilities, and improved performance for business users.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop",
      category: "News",
      date: "2024-01-13",
      author: "Tech Reporter",
      readTime: "3 min read"
    },
    {
      title: "The Ethics of AI in Healthcare: Benefits and Concerns",
      description: "Examining the promising applications and potential risks of artificial intelligence in medical practice.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
      category: "Articles",
      date: "2024-01-11",
      author: "Medical Ethics Expert",
      readTime: "15 min read"
    },
    {
      title: "ChatGPT Plus vs Claude Pro vs Gemini Advanced: The Ultimate Comparison",
      description: "Comprehensive comparison of the leading AI chatbot subscriptions, testing performance, features, and value for money.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
      category: "Product Reviews",
      date: "2024-01-10",
      author: "AI Tools Reviewer",
      readTime: "15 min read"
    },
    {
      title: "What's your favorite AI tool for productivity?",
      description: "Community discussion about the most effective AI tools for boosting workplace productivity and streamlining workflows.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop",
      category: "Threads",
      date: "2024-01-09",
      author: "ProductivityGuru",
      readTime: "Discussion"
    }
  ];

  const searchResults = searchQuery
    ? allContent.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a new search
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Search Results</h1>
          {searchQuery && (
            <p className="text-xl text-gray-600 mb-6">
              Results for "{searchQuery}"
            </p>
          )}
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search across all content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-purple-500"
              />
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              Search
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </form>
        </div>

        {/* Search Results */}
        {searchQuery ? (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Results Grid */}
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result, index) => (
                  <PostCard key={index} {...result} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse our categories instead.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Start your search</h3>
            <p className="text-gray-500">
              Enter keywords to search across our entire collection of AI content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
