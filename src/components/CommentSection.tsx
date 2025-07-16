import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MessageSquare, Send, CheckCircle, Clock, User } from 'lucide-react'
import { supabase, Comment } from '@/lib/supabase'

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  onCommentAdded: () => void
}

export function CommentSection({ postId, comments, onCommentAdded }: CommentSectionProps) {
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!authorName.trim() || !content.trim()) {
      setError('Name and comment are required')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            author_name: authorName.trim(),
            author_email: authorEmail.trim() || null,
            content: content.trim(),
            approved: false // Comments need approval
          }
        ])

      if (error) throw error

      setAuthorName('')
      setAuthorEmail('')
      setContent('')
      setSuccess('Comment submitted successfully! It will appear after moderation.')
      onCommentAdded()
    } catch (error: any) {
      setError('Failed to submit comment. Please try again.')
      console.error('Error submitting comment:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-8">
      {/* Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Join the Discussion</span>
          </CardTitle>
          <CardDescription>
            Share your thoughts about this post. All comments are moderated before appearing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your name"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Comment *</Label>
              <Textarea
                id="comment"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                required
                disabled={loading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                <Clock className="h-4 w-4 inline mr-1" />
                Comments are reviewed before publishing
              </p>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Comment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-gray-600" />
          <h3 className="text-xl font-semibold">
            Comments ({comments.length})
          </h3>
        </div>

        {comments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No comments yet</p>
                <p className="text-gray-400">Be the first to share your thoughts!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <Card key={comment.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(comment.author_name)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{comment.author_name}</CardTitle>
                        <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      #{String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Comment Guidelines */}
      {comments.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Community Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be respectful and constructive in your comments</li>
                  <li>• Stay on topic and contribute to the discussion</li>
                  <li>• No spam, self-promotion, or offensive content</li>
                  <li>• Comments are moderated and may take time to appear</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engagement Stats */}
      {comments.length > 0 && (
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 py-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>
              {new Set(comments.map(c => c.author_name)).size} participant{new Set(comments.map(c => c.author_name)).size !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}