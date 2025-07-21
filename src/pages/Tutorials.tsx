
import {Header} from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, BookOpen } from "lucide-react";
import { useState } from "react";

const Tutorials = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const tutorials = [
    {
      title: "Building Your First Neural Network with TensorFlow",
      description: "Complete step-by-step guide to creating and training a neural network from scratch using TensorFlow and Python.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop",
      category: "Tutorials",
      date: "2024-01-15",
      author: "Dr. Alex Kim",
      readTime: "25 min read"
    },
    {
      title: "Fine-tuning Large Language Models for Specific Tasks",
      description: "Learn how to customize pre-trained language models for your specific use case with practical examples and code.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop",
      category: "Tutorials",
      date: "2024-01-14",
      author: "Emma Rodriguez",
      readTime: "30 min read"
    },
    {
      title: "Computer Vision Basics: Object Detection with YOLO",
      description: "Comprehensive tutorial on implementing object detection using YOLO algorithm with real-world examples.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
      category: "Tutorials",
      date: "2024-01-13",
      author: "David Chen",
      readTime: "20 min read"
    },
    {
      title: "Creating AI Chatbots with Langchain and OpenAI",
      description: "Build intelligent conversational AI systems using Langchain framework and OpenAI's GPT models.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
      category: "Tutorials",
      date: "2024-01-12",
      author: "Maria Santos",
      readTime: "18 min read"
    },
    {
      title: "Data Preprocessing for Machine Learning Projects",
      description: "Essential techniques for cleaning, transforming, and preparing data for machine learning algorithms.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop",
      category: "Tutorials",
      date: "2024-01-11",
      author: "John Wilson",
      readTime: "15 min read"
    },
    {
      title: "Deploying ML Models with Docker and Kubernetes",
      description: "Learn how to containerize and deploy machine learning models at scale using modern DevOps practices.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=300&fit=crop",
      category: "Tutorials",
      date: "2024-01-10",
      author: "Sarah Johnson",
      readTime: "22 min read"
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">AI Tutorials</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Learn AI and machine learning through hands-on tutorials, code examples, and step-by-step guides.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter by Level</span>
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial, index) => (
            <PostCard key={index} {...tutorial} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            Load More Tutorials
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tutorials;
