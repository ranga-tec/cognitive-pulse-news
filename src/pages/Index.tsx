import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/Header'
import { PostCard } from '@/components/PostCard'
import { Footer } from '@/components/Footer'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, Post } from '@/lib/supabase'
import { TrendingUp, BookOpen, MessageSquare, Users, ArrowRight, AlertCircle, Brain } from 'lucide-react'

export function Index() {
  const [posts, setPosts] = useState<Post[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([])
  const [threadPosts, setThreadPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setError('')
      
      if (!supabase) {
        throw new Error('Supabase is not properly configured. Please check your environment variables.')
      }

      // Fetch featured posts
      const { data: featured, error: featuredError } = await supabase
        .from('posts')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('status', 'published')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (featuredError) {
        console.warn('Featured posts error:', featuredError)
      }

      // Fetch recent article posts
      const { data: articles, error: articlesError } = await supabase
        .from('posts')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('status', 'published')
        .eq('post_type', 'article')
        .order('created_at', { ascending: false })
        .limit(6)

      if (articlesError) {
        console.warn('Articles error:', articlesError)
      }

      // Fetch recent thread posts
      const { data: threads, error: threadsError } = await supabase
        .from('posts')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('status', 'published')
        .eq('post_type', 'thread')
        .order('created_at', { ascending: false })
        .limit(4)

      if (threadsError) {
        console.warn('Threads error:', threadsError)
      }

      setFeaturedPosts(featured || [])
      setPosts(articles || [])
      setThreadPosts(threads || [])

      if (featuredError && articlesError && threadsError) {
        throw new Error('Unable to load content. Please check your database connection.')
      }

    } catch (error: any) {
      console.error('Error fetching posts:', error)
      setError(error.message || 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading content...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span>Unable to Load Content</span>
              </CardTitle>
              <CardDescription className="text-red-600">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={fetchPosts}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section - NurAledge Style */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Brain className="h-12 w-12 text-blue-200" />
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-2">
                AI Insights Hub
              </h1>
             
            </div>
          </div>
          
          
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/articles">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore AI Articles
              </Button>
            </Link>
            <Link to="/threads">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3">
                <MessageSquare className="mr-2 h-5 w-5" />
                Join Discussions
              </Button>
            </Link>
          </div>
          
          {/* Company Link */}
          <div className="mt-8">
            
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Insights</h2>
                <p className="text-gray-600">Hand-picked content from our AI experts</p>
              </div>
              <Badge variant="default" className="bg-blue-600">
                Editor's Choice
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <ErrorBoundary key={post.id}>
                  <PostCard post={post} featured />
                </ErrorBoundary>
              ))}
            </div>
          </section>
        )}

        {/* Stats Cards - NurAledge Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">AI Articles</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{posts.length}</div>
              <p className="text-xs text-blue-600">
                In-depth analysis and insights
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Active Discussions</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{threadPosts.length}</div>
              <p className="text-xs text-blue-600">
                Community conversations
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Tech Community</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">1.2K+</div>
              <p className="text-xs text-blue-600">
                Innovation enthusiasts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Latest Articles */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest AI Insights</h2>
              <p className="text-gray-600">Deep dives into artificial intelligence and technology trends</p>
            </div>
            <Link to="/articles">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {posts.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No articles published yet.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Check back soon for cutting-edge AI insights!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <ErrorBoundary key={post.id}>
                  <PostCard post={post} />
                </ErrorBoundary>
              ))}
            </div>
          )}
        </section>

        {/* Discussion Threads */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tech Discussions</h2>
              <p className="text-gray-600">Join the conversation with our innovation community</p>
            </div>
            <Link to="/threads">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                View All Threads
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {threadPosts.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No discussions started yet.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Be the first to start an AI conversation!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {threadPosts.map((post) => (
                <ErrorBoundary key={post.id}>
                  <PostCard post={post} />
                </ErrorBoundary>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section - NurAledge Style */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-12 shadow-lg">
          <h3 className="text-3xl font-bold mb-4">
            Pioneering the Future of AI
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Explore cutting-edge artificial intelligence solutions, insights, and discussions. 
            Join NeurAledge Technologies in shaping tomorrow's intelligent systems.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link to="/news">
              <Button className="w-full h-16 text-lg bg-white text-blue-700 hover:bg-blue-50">
                <TrendingUp className="mr-3 h-5 w-5" />
                Latest AI News
              </Button>
            </Link>
            <Link to="/tutorials">
              <Button className="w-full h-16 text-lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
                <BookOpen className="mr-3 h-5 w-5" />
                AI Tutorials
              </Button>
            </Link>
            <Link to="/research">
              <Button className="w-full h-16 text-lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
                <Brain className="mr-3 h-5 w-5" />
                Research Papers
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}