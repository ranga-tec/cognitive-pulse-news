import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import  Header from '@/components/Header'
import { PostCard } from '@/components/PostCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, Post } from '@/lib/supabase'
import { TrendingUp, BookOpen, MessageSquare, Users, ArrowRight } from 'lucide-react'

export function Index() {
  const [posts, setPosts] = useState<Post[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([])
  const [threadPosts, setThreadPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      // Fetch featured posts
      const { data: featured } = await supabase
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

      // Fetch recent article posts
      const { data: articles } = await supabase
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

      // Fetch recent thread posts
      const { data: threads } = await supabase
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

      setFeaturedPosts(featured || [])
      setPosts(articles || [])
      setThreadPosts(threads || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            AI Insights Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your premier destination for artificial intelligence insights, machine learning breakthroughs, 
            and cutting-edge technology discussions. Join our community of innovators and thought leaders.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/news">
              <Button size="lg" className="px-8">
                Explore Latest News
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/threads">
              <Button size="lg" variant="outline" className="px-8">
                <MessageSquare className="mr-2 h-4 w-4" />
                Join Discussions
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Stories</h2>
                <p className="text-gray-600">Hand-picked content from our editorial team</p>
              </div>
              <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-purple-600">
                Editor's Choice
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
              <p className="text-xs text-muted-foreground">
                In-depth analysis and insights
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Discussions</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{threadPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                Community conversations
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growing Community</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2K+</div>
              <p className="text-xs text-muted-foreground">
                Active members
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Latest Articles */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Articles</h2>
              <p className="text-gray-600">Deep dives into AI and technology trends</p>
            </div>
            <Link to="/articles">
              <Button variant="outline">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {posts.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No articles published yet.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* Discussion Threads */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Hot Discussions</h2>
              <p className="text-gray-600">Join the conversation with our community</p>
            </div>
            <Link to="/threads">
              <Button variant="outline">
                View All Threads
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {threadPosts.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No discussions started yet.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {threadPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Stay at the Forefront of AI
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore specialized sections for the latest in artificial intelligence, 
            from breaking news to in-depth tutorials and cutting-edge research.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link to="/news">
              <Button className="w-full h-16 text-lg" variant="default">
                <TrendingUp className="mr-3 h-5 w-5" />
                Latest News
              </Button>
            </Link>
            <Link to="/tutorials">
              <Button className="w-full h-16 text-lg" variant="outline">
                <BookOpen className="mr-3 h-5 w-5" />
                Tutorials
              </Button>
            </Link>
            <Link to="/research">
              <Button className="w-full h-16 text-lg" variant="outline">
                <Users className="mr-3 h-5 w-5" />
                Research
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}