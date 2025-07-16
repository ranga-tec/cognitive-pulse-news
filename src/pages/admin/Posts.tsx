import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Plus, Edit, Trash2, Eye, Filter } from 'lucide-react'
import { supabase, Post } from '@/lib/supabase'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'article' | 'thread'>('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
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
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchPosts() // Refresh the list
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true
    if (filter === 'published' || filter === 'draft') return post.status === filter
    if (filter === 'article' || filter === 'thread') return post.post_type === filter
    return true
  })

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
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-gray-600">Manage your articles and discussion threads</p>
        </div>
        <Link to="/admin/posts/new">
          <Button size="lg">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Posts ({filteredPosts.length})</CardTitle>
              <CardDescription>
                Manage your blog posts, edit content, and control publication status.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="thread">Threads</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {filter === 'all' ? 'No posts yet.' : `No ${filter} posts found.`}
              </p>
              <Link to="/admin/posts/new">
                <Button>Create your first post</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium line-clamp-2">{post.title}</div>
                        {post.featured && (
                          <Badge variant="secondary" className="mt-1">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.post_type === 'article' ? 'default' : 'outline'}>
                        {post.post_type === 'article' ? 'Article' : 'Thread'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.categories ? (
                        <Badge variant="outline">
                          {post.categories.name}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">Uncategorized</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {formatDate(post.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {post.status === 'published' && (
                          <Link to={`/post/${post.id}`} target="_blank">
                            <Button variant="ghost" size="sm" title="View post">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Link to={`/admin/posts/edit/${post.id}`}>
                          <Button variant="ghost" size="sm" title="Edit post">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}