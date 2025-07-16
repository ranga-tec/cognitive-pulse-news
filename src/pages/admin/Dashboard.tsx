import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { FileText, MessageSquare, Eye, Plus, Users, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
    pendingComments: 0,
    articlePosts: 0,
    threadPosts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Get posts stats
      const { data: posts } = await supabase
        .from('posts')
        .select('status, post_type')
      
      // Get comments stats
      const { data: comments } = await supabase
        .from('comments')
        .select('approved')

      const totalPosts = posts?.length || 0
      const publishedPosts = posts?.filter(p => p.status === 'published').length || 0
      const draftPosts = posts?.filter(p => p.status === 'draft').length || 0
      const articlePosts = posts?.filter(p => p.post_type === 'article').length || 0
      const threadPosts = posts?.filter(p => p.post_type === 'thread').length || 0
      const totalComments = comments?.length || 0
      const pendingComments = comments?.filter(c => !c.approved).length || 0

      setStats({
        totalPosts,
        publishedPosts,
        draftPosts,
        totalComments,
        pendingComments,
        articlePosts,
        threadPosts
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your content.</p>
        </div>
        <Link to="/admin/posts/new">
          <Button size="lg">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedPosts} published • {stats.draftPosts} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedPosts}</div>
            <p className="text-xs text-muted-foreground">
              Live on the website
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingComments} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Types</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.articlePosts + stats.threadPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.articlePosts} articles • {stats.threadPosts} threads
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/posts/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </Link>
            <Link to="/admin/posts" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Manage Posts
              </Button>
            </Link>
            <Link to="/admin/comments" className="block">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Moderate Comments
                {stats.pendingComments > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {stats.pendingComments}
                  </span>
                )}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
            <CardDescription>Your content at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Articles</span>
              <span className="text-sm text-gray-500">{stats.articlePosts} posts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Discussion Threads</span>
              <span className="text-sm text-gray-500">{stats.threadPosts} posts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Engagement</span>
              <span className="text-sm text-gray-500">{stats.totalComments} comments</span>
            </div>
            {stats.pendingComments > 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  You have {stats.pendingComments} comment(s) waiting for approval.
                </p>
                <Link to="/admin/comments">
                  <Button variant="link" size="sm" className="p-0 h-auto text-yellow-600">
                    Review now →
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}