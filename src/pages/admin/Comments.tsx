import React, { useEffect, useState } from 'react'
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
import { Check, X, MessageSquare, ExternalLink } from 'lucide-react'
import { supabase, Comment } from '@/lib/supabase'
import { Link } from 'react-router-dom'

interface CommentWithPost extends Comment {
  posts: {
    id: string
    title: string
  }
}

export function AdminComments() {
  const [comments, setComments] = useState<CommentWithPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          posts (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ approved: true })
        .eq('id', id)

      if (error) throw error
      fetchComments()
    } catch (error) {
      console.error('Error approving comment:', error)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true
    if (filter === 'pending') return !comment.approved
    if (filter === 'approved') return comment.approved
    return true
  })

  const pendingCount = comments.filter(c => !c.approved).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Comments</h1>
        <p className="text-gray-600">Moderate and manage user comments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={filter === 'pending' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('pending')}
          className="relative"
        >
          Pending
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
              {pendingCount}
            </Badge>
          )}
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('approved')}
        >
          Approved
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>
              {filter === 'pending' && 'Pending Comments'}
              {filter === 'approved' && 'Approved Comments'} 
              {filter === 'all' && 'All Comments'}
              ({filteredComments.length})
            </span>
          </CardTitle>
          <CardDescription>
            {filter === 'pending' && 'Comments waiting for your approval'}
            {filter === 'approved' && 'Comments that are live on your site'}
            {filter === 'all' && 'All comments across your site'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredComments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">
                {filter === 'pending' && 'No pending comments'}
                {filter === 'approved' && 'No approved comments yet'}
                {filter === 'all' && 'No comments yet'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{comment.author_name}</div>
                        {comment.author_email && (
                          <div className="text-sm text-gray-500">{comment.author_email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-3">{comment.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/post/${comment.posts.id}`}
                        target="_blank"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                      >
                        <span className="max-w-32 truncate">{comment.posts.title}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={comment.approved ? 'default' : 'secondary'}>
                        {comment.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(comment.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {!comment.approved ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(comment.id)}
                              className="text-green-600 hover:text-green-700"
                              title="Approve comment"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(comment.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete comment"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(comment.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete comment"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions Section */}
      {filteredComments.length > 0 && filter === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
            <CardDescription>
              Perform actions on multiple comments at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={async () => {
                  const pendingComments = filteredComments.filter(c => !c.approved)
                  if (pendingComments.length === 0) return
                  
                  const confirmed = confirm(`Approve all ${pendingComments.length} pending comments?`)
                  if (!confirmed) return

                  try {
                    const { error } = await supabase
                      .from('comments')
                      .update({ approved: true })
                      .in('id', pendingComments.map(c => c.id))

                    if (error) throw error
                    fetchComments()
                  } catch (error) {
                    console.error('Error bulk approving comments:', error)
                  }
                }}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve All Pending
              </Button>
              
              <Button
                variant="outline"
                onClick={async () => {
                  const pendingComments = filteredComments.filter(c => !c.approved)
                  if (pendingComments.length === 0) return
                  
                  const confirmed = confirm(`Delete all ${pendingComments.length} pending comments? This cannot be undone.`)
                  if (!confirmed) return

                  try {
                    const { error } = await supabase
                      .from('comments')
                      .delete()
                      .in('id', pendingComments.map(c => c.id))

                    if (error) throw error
                    fetchComments()
                  } catch (error) {
                    console.error('Error bulk deleting comments:', error)
                  }
                }}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-2" />
                Delete All Pending
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Comment Statistics</CardTitle>
          <CardDescription>
            Overview of your comment activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{comments.length}</div>
              <div className="text-sm text-blue-600">Total Comments</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {comments.filter(c => c.approved).length}
              </div>
              <div className="text-sm text-green-600">Approved</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-yellow-600">Pending Review</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}