import React, { useEffect, useState } from 'react'
import  {Header}  from '@/components/Header'
import { PostCard } from '@/components/PostCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase, Post, Category } from '@/lib/supabase'
import { MessageSquare, Search, Filter, Plus } from 'lucide-react'

export function Threads() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  useEffect(() => {
    fetchThreads()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchThreads()
  }, [selectedCategory, sortBy])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchThreads = async () => {
    try {
      let query = supabase
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

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }

      query = query.order('created_at', { ascending: sortBy === 'oldest' })

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching threads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Discussion Threads</h1>
          </div>
          <p className="text-xl text-gray-600">
            Join the conversation with our community of AI enthusiasts, researchers, and developers.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest') => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge 
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory('all')}
            >
              All Discussions ({posts.length})
            </Badge>
            {categories.map((category) => {
              const categoryCount = posts.filter(p => p.category_id === category.id).length
              return (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({categoryCount})
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {searchTerm ? (
              <>Showing {filteredPosts.length} results for "{searchTerm}"</>
            ) : (
              <>Showing {filteredPosts.length} discussion threads</>
            )}
          </p>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
            >
              Clear search
            </Button>
          )}
        </div>

        {/* Threads Grid */}
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No discussions found' : 'No discussions yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms or filters'
                    : 'Be the first to start a discussion in our community!'
                  }
                </p>
                {!searchTerm && (
                  <Button className="px-8">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Discussion
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-16 p-8 bg-white rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join the Conversation
            </h3>
            <p className="text-gray-600 mb-6">
              Have something to share? Start your own discussion and connect with the community.
            </p>
            <Button size="lg" className="px-8">
              <Plus className="h-4 w-4 mr-2" />
              Start New Discussion
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}