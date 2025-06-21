
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users } from "lucide-react";
import { useState } from "react";

const Threads = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const discussions = [
    {
      title: "What's your favorite AI tool for productivity?",
      description: "Community discussion about the most effective AI tools for boosting workplace productivity and streamlining workflows.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=300&fit=crop",
      category: "Threads",
      date: "2024-01-15",
      author: "ProductivityGuru",
      readTime: "Discussion"
    },
    {
      title: "Should we be worried about AI taking over creative jobs?",
      description: "Heated debate about the impact of AI on creative industries and whether human creativity will remain irreplaceable.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop",
      category: "Threads",
      date: "2024-01-14",
      author: "CreativeArtist",
      readTime: "Discussion"
    },
    {
      title: "Best practices for prompt engineering - share your tips!",
      description: "Community thread sharing techniques, tricks, and strategies for getting better results from AI language models.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop",
      category: "Threads",
      date: "2024-01-13",
      author: "PromptMaster",
      readTime: "Discussion"
    },
    {
      title: "AI in healthcare: ethical concerns and potential solutions",
      description: "Thoughtful discussion about implementing AI in medical settings while maintaining patient privacy and safety.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
      category: "Threads",
      date: "2024-01-12",
      author: "MedTechEthicist",
      readTime: "Discussion"
    },
    {
      title: "Learning AI/ML as a complete beginner - where to start?",
      description: "Community advice thread for newcomers to artificial intelligence and machine learning seeking guidance on learning paths.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
      category: "Threads",
      date: "2024-01-11",
      author: "AINewbie",
      readTime: "Discussion"
    },
    {
      title: "The future of AI regulation: what policies do we need?",
      description: "Discussion about balancing innovation with safety in AI regulation and what governments should prioritize.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop",
      category: "Threads",
      date: "2024-01-10",
      author: "PolicyWonk",
      readTime: "Discussion"
    }
  ];

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-teal-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Community Threads</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Join the conversation! Engage with the AI community through discussions, debates, and knowledge sharing.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-teal-500"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter by Topic</span>
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Start New Thread
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDiscussions.length} discussion{filteredDiscussions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Discussions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiscussions.map((discussion, index) => (
            <PostCard key={index} {...discussion} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8">
            Load More Discussions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Threads;
