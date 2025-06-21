
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Zap, Users } from "lucide-react";

const Index = () => {
  const featuredPosts = [
    {
      title: "The Future of Large Language Models: What's Next After GPT-4",
      description: "Exploring the latest developments in AI language models and what researchers are working on for the next generation of AI systems.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
      category: "Research",
      date: "2024-01-15",
      author: "Dr. Sarah Chen",
      readTime: "8 min read"
    },
    {
      title: "Building Your First AI Chatbot: Complete Tutorial",
      description: "Step-by-step guide to creating an intelligent chatbot using modern AI frameworks and deployment strategies.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
      category: "Tutorials",
      date: "2024-01-14",
      author: "Mike Rodriguez",
      readTime: "12 min read"
    }
  ];

  const latestPosts = [
    {
      title: "OpenAI Announces Major Updates to ChatGPT Enterprise",
      description: "New features include enhanced security, better integration capabilities, and improved performance for business users.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop",
      category: "News",
      date: "2024-01-13",
    },
    {
      title: "Comparing AI Code Assistants: GitHub Copilot vs Cursor vs Codeium",
      description: "An in-depth review of the leading AI coding tools, comparing features, accuracy, and pricing.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
      category: "Product Reviews",
      date: "2024-01-12",
    },
    {
      title: "The Ethics of AI in Healthcare: Benefits and Concerns",
      description: "Examining the promising applications and potential risks of artificial intelligence in medical practice.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
      category: "Articles",
      date: "2024-01-11",
    },
    {
      title: "Machine Learning for Beginners: Understanding Neural Networks",
      description: "A beginner-friendly introduction to neural networks, how they work, and their real-world applications.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop",
      category: "Tutorials",
      date: "2024-01-10",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Your premier destination for AI news, tutorials, research, and insights. 
            Stay ahead in the rapidly evolving world of artificial intelligence.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-12">
            <div className="flex items-center space-x-2 text-purple-300">
              <TrendingUp className="h-5 w-5" />
              <span>Latest AI Trends</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-300">
              <Zap className="h-5 w-5" />
              <span>Expert Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-indigo-300">
              <Users className="h-5 w-5" />
              <span>Community Driven</span>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Enter your email for AI updates..."
                className="bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-purple-400"
              />
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Zap className="h-8 w-8 text-purple-600 mr-3" />
            Featured Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <PostCard key={index} {...post} featured={true} />
            ))}
          </div>
        </section>

        {/* Latest Posts */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            Latest Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestPosts.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8">
              View All Posts
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-purple-400" />
                <span className="text-lg font-bold">AI Hub</span>
              </div>
              <p className="text-gray-400">
                Leading the conversation in artificial intelligence with expert insights and community-driven content.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/news" className="hover:text-purple-400 transition-colors">News</a></li>
                <li><a href="/tutorials" className="hover:text-purple-400 transition-colors">Tutorials</a></li>
                <li><a href="/articles" className="hover:text-purple-400 transition-colors">Articles</a></li>
                <li><a href="/research" className="hover:text-purple-400 transition-colors">Research</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/threads" className="hover:text-purple-400 transition-colors">Threads</a></li>
                <li><a href="/product-reviews" className="hover:text-purple-400 transition-colors">Product Reviews</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Newsletter</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Discord</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <p className="text-gray-400 mb-4">Stay updated with the latest in AI</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                  placeholder="Your email"
                  className="bg-slate-800 border-slate-700 text-white placeholder-gray-400"
                />
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
