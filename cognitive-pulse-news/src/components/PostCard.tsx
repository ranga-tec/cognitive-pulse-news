import React from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MessageSquare, MoveRight } from 'lucide-react'
import { Post } from '@/lib/supabase'

interface PostCardProps {
  post: Post
  featured?: boolean
  compact?: boolean
}

export function PostCard({ post, featured = false, compact = false }: PostCardProps) {
  if (!post) {
    return null
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
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

  const plainText = stripHtml(post.content || '')
  const getExcerpt = () => {
    if (post.excerpt) return post.excerpt
    const maxLength = featured ? 220 : 150
    return plainText.length > maxLength ? `${plainText.substring(0, maxLength)}...` : plainText
  }

  const getReadingTime = () => {
    const words = plainText.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
  }

  const postTitle = post.title || 'Untitled Post'
  const postTags = post.tags || []
  const postType = post.post_type || 'article'
  const createdAt = post.created_at || new Date().toISOString()
  const categoryName = post.categories?.name

  if (compact) {
    return (
      <Link
        to={`/post/${post.id}`}
        className="group grid min-h-40 rounded-md border border-slate-200 bg-white p-5 transition-all hover:border-slate-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {categoryName && (
            <Badge variant="outline" className="border-slate-300 text-slate-700">
              {categoryName}
            </Badge>
          )}
          <Badge className={postType === 'article' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 'bg-amber-100 text-amber-800 hover:bg-amber-100'}>
            {postType === 'article' ? 'Article' : 'Thread'}
          </Badge>
        </div>
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-950 group-hover:text-slate-700">
          {postTitle}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{getExcerpt()}</p>
        <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(createdAt)}
          </span>
          <MoveRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-700" />
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/post/${post.id}`}
      className={`group block h-full rounded-md border bg-white transition-all hover:border-slate-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${
        featured ? 'border-slate-300 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-start' : 'border-slate-200'
      }`}
    >
      {post.featured_image && (
        <div className={`card-image relative overflow-hidden ${featured ? 'aspect-video rounded-t-md bg-slate-100 lg:rounded-l-md lg:rounded-tr-none' : 'aspect-video rounded-t-md bg-slate-100'}`}>
          <img
            src={post.featured_image}
            alt={postTitle}
            loading={featured ? 'eager' : 'lazy'}
            decoding="async"
            width={1200}
            height={675}
            sizes={featured ? '(max-width: 1024px) 100vw, 48vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      <div className={`flex h-full flex-col ${featured ? 'p-6 md:p-8' : 'p-5'}`}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {featured && (
            <Badge className="bg-slate-950 text-white hover:bg-slate-950">
              Featured
            </Badge>
          )}
          {categoryName && (
            <Badge variant="outline" className="border-slate-300 text-slate-700">
              {categoryName}
            </Badge>
          )}
          <Badge className={postType === 'article' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 'bg-amber-100 text-amber-800 hover:bg-amber-100'}>
            {postType === 'article' ? 'Article' : 'Thread'}
          </Badge>
        </div>

        <h3 className={`line-clamp-2 font-bold leading-tight text-slate-950 group-hover:text-slate-700 ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          {postTitle}
        </h3>

        <p className={`mt-3 leading-7 text-slate-600 ${featured ? 'line-clamp-4 text-base' : 'line-clamp-3 text-sm'}`}>
          {getExcerpt()}
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {getReadingTime()} min read
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            Discuss
          </span>
        </div>

        {postTags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {postTags.slice(0, featured ? 5 : 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                {tag}
              </Badge>
            ))}
            {postTags.length > (featured ? 5 : 3) && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-100">
                +{postTags.length - (featured ? 5 : 3)}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-auto pt-5">
          <span className="inline-flex items-center text-sm font-semibold text-slate-900">
            Read resource
            <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}
