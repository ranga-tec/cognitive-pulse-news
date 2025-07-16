import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageSquare, ArrowUpRight } from 'lucide-react'
import { Post } from '@/lib/supabase'

interface PostCardProps {
  post: Post
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  // Safety checks to prevent errors
  if (!post) {
    return null
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Unknown date'
    }
  }

  const stripHtml = (html: string) => {
    try {
      const tmp = document.createElement('div')
      tmp.innerHTML = html || ''
      return tmp.textContent || tmp.innerText || ''
    } catch (error) {
      return html || ''
    }
  }

  const getExcerpt = () => {
    if (post.excerpt) return post.excerpt
    const plainText = stripHtml(post.content || '')
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
  }

  const postTitle = post.title || 'Untitled Post'
  const postContent = post.content || ''
  const postTags = post.tags || []
  const postType = post.post_type || 'article'
  const createdAt = post.created_at || new Date().toISOString()

  return (
    <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      featured ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' : ''
    }`}>
      {post.featured_image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={post.featured_image} 
            alt={postTitle}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {post.categories && (
              <Badge variant="secondary" className="text-xs">
                {post.categories.name}
              </Badge>
            )}
            <Badge 
              variant={postType === 'article' ? 'default' : 'outline'}
              className="text-xs"
            >
              {postType === 'article' ? 'Article' : 'Thread'}
            </Badge>
          </div>
          {featured && (
            <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-purple-600">
              Featured
            </Badge>
          )}
        </div>
        
        <CardTitle className="line-clamp-2 group">
          <Link 
            to={`/post/${post.id}`}
            className="hover:text-blue-600 transition-colors group-hover:underline flex items-center"
          >
            {postTitle}
            <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </CardTitle>
        
        <CardDescription className="line-clamp-3">
          {getExcerpt()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>Comments</span>
          </div>
        </div>
        
        {postTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {postTags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {postTags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{postTags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}