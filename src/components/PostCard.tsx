
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  featured?: boolean;
  author?: string;
  readTime?: string;
}

const PostCard = ({ 
  title, 
  description, 
  image, 
  category, 
  date, 
  featured = false,
  author = "AI Hub Team",
  readTime = "5 min read"
}: PostCardProps) => {
  return (
    <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-gray-200 overflow-hidden ${featured ? 'md:col-span-2 lg:col-span-2' : ''}`}>
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${featured ? 'h-64' : 'h-48'}`}
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white">
            {category}
          </Badge>
        </div>
        {featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
              Featured
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <h3 className={`font-bold text-gray-900 group-hover:text-purple-600 transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
          {title}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 mb-3 line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span>{author}</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>
          <span>{date}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
