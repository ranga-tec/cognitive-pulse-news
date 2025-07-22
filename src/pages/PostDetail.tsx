// pages/PostDetail.tsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import  {Header}  from '@/components/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowLeft, MessageSquare, Clock, Eye } from 'lucide-react'
import { supabase, Post, Comment } from '@/lib/supabase'
import { CommentSection } from '@/components/CommentSection'

export function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchPost()
      fetchComments()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('id', id)
        .eq('status', 'published')
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .eq('approved', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="aspect-video mb-8 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-8">
          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {post.categories && (
              <Badge variant="secondary" className="px-3 py-1">
                {post.categories.name}
              </Badge>
            )}
            <Badge 
              variant={post.post_type === 'article' ? 'default' : 'outline'}
              className="px-3 py-1"
            >
              {post.post_type === 'article' ? 'Article' : 'Discussion Thread'}
            </Badge>
            {post.featured && (
              <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1">
                Featured
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Post Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{getReadingTime(post.content)} min read</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>{comments.length} comments</span>
            </div>
          </div>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="px-2 py-1">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
          <style jsx>{`
            .blog-post-content p,
            .blog-post-content div,
            .blog-post-content span,
            .blog-post-content li {
              text-align: left !important;
            }
            
            .blog-post-content .ql-align-center {
              text-align: center !important;
            }
            
            .blog-post-content .ql-align-right {
              text-align: right !important;
            }
            
            .blog-post-content .ql-align-justify {
              text-align: justify !important;
            }
            
            .blog-post-content .ql-indent-1,
            .blog-post-content .ql-indent-2,
            .blog-post-content .ql-indent-3,
            .blog-post-content .ql-indent-4,
            .blog-post-content .ql-indent-5,
            .blog-post-content .ql-indent-6,
            .blog-post-content .ql-indent-7,
            .blog-post-content .ql-indent-8 {
              text-align: left !important;
            }
          `}</style>
          
          <div 
            className="blog-post-content prose prose-lg prose-gray max-w-none 
                       prose-headings:text-gray-900 prose-headings:font-bold
                       prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-left
                       prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-gray-900 prose-strong:font-semibold
                       prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                       prose-pre:bg-gray-900 prose-pre:text-gray-100
                       prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:text-left
                       prose-img:rounded-lg prose-img:shadow-md
                       prose-li:text-left"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Comments Section */}
        <section className="bg-white rounded-xl shadow-sm p-8">
          <CommentSection 
            postId={post.id} 
            comments={comments}
            onCommentAdded={fetchComments}
          />
        </section>
      </article>
    </div>
  )
}