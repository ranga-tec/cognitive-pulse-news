//components/ PosrForm.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import { RichTextEditor } from '@/components/RichTextEditor'
import { supabase, Post, Category } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { ImageUpload } from '../ImageUpload'

interface PostFormProps {
  mode: 'create' | 'edit'
}

export function PostForm({ mode }: PostFormProps) {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tags, setTags] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [postType, setPostType] = useState<'article' | 'thread'>('article')
  const [featured, setFeatured] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(mode === 'edit')
  const [error, setError] = useState('')
  
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
    if (mode === 'edit' && id) {
      fetchPost()
    }
  }, [mode, id])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchPost = async () => {
    if (!id) return

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      setPost(data)
      setTitle(data.title)
      setExcerpt(data.excerpt || '')
      setContent(data.content)
      setCategoryId(data.category_id || '')
      setTags(data.tags?.join(', ') || '')
      setFeaturedImage(data.featured_image || '')
      setStatus(data.status)
      setPostType(data.post_type)
      setFeatured(data.featured)
    } catch (error: any) {
      console.error('Error fetching post:', error)
      setError('Failed to load post')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      setLoading(false)
      return
    }

    try {
      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim() || null,
        content,
        category_id: categoryId || null,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        featured_image: featuredImage.trim() || null,
        status,
        post_type: postType,
        featured,
        author_id: user?.id,
        updated_at: new Date().toISOString()
      }

      if (mode === 'create') {
        const { error } = await supabase
          .from('posts')
          .insert([postData])
      } else {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id)
      }

      if (error) throw error

      navigate('/admin/posts')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    const originalStatus = status
    setStatus('draft')
    
    // Create form event
    const event = new Event('submit', { bubbles: true, cancelable: true })
    await handleSubmit(event as any)
    
    setStatus(originalStatus)
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/posts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {mode === 'create' ? 'Create New Post' : 'Edit Post'}
            </h1>
            <p className="text-gray-600">
              {mode === 'create' 
                ? 'Fill in the details below to create your post.' 
                : 'Update your post details below.'}
            </p>
          </div>
        </div>
        {mode === 'edit' && post?.status === 'published' && (
          <Button variant="outline" asChild>
            <a href={`/post/${post.id}`} target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4 mr-2" />
              View Live
            </a>
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>
                  The main content of your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief summary of the post..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content *</Label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your post content here..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
                <CardDescription>
                  Configure your post options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="post-type">Post Type</Label>
                  <Select value={postType} onValueChange={(value: 'article' | 'thread') => setPostType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="thread">Discussion Thread</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                  <Label htmlFor="featured">Featured Post</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meta Information</CardTitle>
                <CardDescription>
                  Additional post metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="AI, Machine Learning, Tutorial (comma-separated)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured-image">Featured Image URL</Label>
                  <Input
                    id="featured-image"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                </div>
              </CardContent>
            </Card>
              {/* Enhanced Featured Image Section */}
<Card className="mt-6">
  <CardHeader>
    <CardTitle>Featured Image</CardTitle>
    <CardDescription>
      This image will appear as a preview in post tiles and social media shares
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Image URL Input */}
    <div className="space-y-2">
      <Label htmlFor="featured-image">Image URL</Label>
      <Input
        id="featured-image"
        value={featuredImage}
        onChange={(e) => setFeaturedImage(e.target.value)}
        placeholder="https://example.com/image.jpg or upload to your server"
        type="url"
      />
      <p className="text-xs text-gray-500">
        Recommended size: 1200x630px for best social media sharing
      </p>
    </div>

 

// Replace the featured image section in your PostForm.tsx with this:

{/* Enhanced Featured Image Section with Server Upload */}
<Card>
  <CardHeader>
    <CardTitle>Featured Image</CardTitle>
    <CardDescription>
      Upload an image to your server. This will appear as a preview in post tiles and social media shares.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ImageUpload
      value={featuredImage}
      onChange={setFeaturedImage}
      label="Post Featured Image"
    />
  </CardContent>
</Card>

    {/* Quick Image Sources */}
    <div className="space-y-2">
      <Label>Quick Image Sources</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
        <a 
          href="https://unsplash.com/s/photos/artificial-intelligence" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 border rounded text-center hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">Unsplash</span><br/>
          <span className="text-gray-500">Free AI photos</span>
        </a>
        <a 
          href="https://pixabay.com/images/search/technology/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 border rounded text-center hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">Pixabay</span><br/>
          <span className="text-gray-500">Free tech images</span>
        </a>
        <a 
          href="https://pexels.com/search/machine%20learning/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 border rounded text-center hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">Pexels</span><br/>
          <span className="text-gray-500">Free ML photos</span>
        </a>
      </div>
    </div>

    {/* Image Tips */}
    <div className="bg-blue-50 p-3 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-2">💡 Image Tips:</h4>
      <ul className="text-sm text-blue-800 space-y-1">
        <li>• Use 16:9 aspect ratio (1200x675px) for best results</li>
        <li>• Ensure images are optimized (under 500KB)</li>
        <li>• Use descriptive alt text for accessibility</li>
        <li>• Consider your brand colors and style</li>
      </ul>
    </div>
  </CardContent>
</Card>        
            {/* Action Buttons */}
            <div className="space-y-3">
              {status === 'published' ? (
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Post'}
                </Button>
              ) : (
                <>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Publishing...' : 'Publish Post'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleSaveDraft}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}