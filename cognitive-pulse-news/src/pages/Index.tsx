import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/Header'
import { PostCard } from '@/components/PostCard'
import { Footer } from '@/components/Footer'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, Post } from '@/lib/supabase'
import {
  AlertCircle,
  ArrowRight,
  Beaker,
  BookOpen,
  GraduationCap,
  Loader2,
  MessageSquare,
  Search,
  Sparkles,
} from 'lucide-react'

const POST_CARD_FIELDS = `
  id,
  title,
  excerpt,
  content,
  featured_image,
  tags,
  post_type,
  created_at,
  categories (
    id,
    name,
    slug
  )
`

export function Index() {
  const [posts, setPosts] = useState<Post[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([])
  const [threadPosts, setThreadPosts] = useState<Post[]>([])
  const [totalArticleCount, setTotalArticleCount] = useState(0)
  const [totalThreadCount, setTotalThreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setError('')
      setLoading(true)

      if (!supabase) {
        throw new Error('Supabase is not properly configured. Please check your environment variables.')
      }

      const baseQuery = () =>
        supabase
          .from('posts')
          .select(POST_CARD_FIELDS)
          .eq('status', 'published')

      const [
        { data: featured, error: featuredError },
        { data: articles, error: articlesError },
        { data: threads, error: threadsError },
        { count: articleCount, error: articleCountError },
        { count: threadCount, error: threadCountError },
      ] = await Promise.all([
        baseQuery().eq('featured', true).order('created_at', { ascending: false }).limit(3),
        baseQuery().eq('post_type', 'article').order('created_at', { ascending: false }).limit(9),
        baseQuery().eq('post_type', 'thread').order('created_at', { ascending: false }).limit(6),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published').eq('post_type', 'article'),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published').eq('post_type', 'thread'),
      ])

      if (featuredError || articlesError || threadsError || articleCountError || threadCountError) {
        const msg = featuredError?.message || articlesError?.message || threadsError?.message || 'Unable to load content.'
        throw new Error(msg)
      }

      setFeaturedPosts(featured || [])
      setPosts(articles || [])
      setThreadPosts(threads || [])
      setTotalArticleCount(articleCount || 0)
      setTotalThreadCount(threadCount || 0)
    } catch (error: any) {
      console.error('Error fetching posts:', error)
      setError(error.message || 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => {
    const names = [...posts, ...featuredPosts, ...threadPosts]
      .map((post) => post.categories?.name)
      .filter(Boolean) as string[]
    return Array.from(new Set(names)).slice(0, 8)
  }, [posts, featuredPosts, threadPosts])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="flex h-72 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-white" />
            <p className="text-sm font-medium text-slate-400">Loading learning resources...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                Unable to Load Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-red-700">{error}</p>
              <Button onClick={fetchPosts} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const leadPost = featuredPosts[0] || posts[0]
  const secondaryFeatured = featuredPosts.slice(1, 3)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Glow accent */}
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <Badge className="mb-5 w-fit border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/10">
              AI News · Tutorials · Tools
            </Badge>
            <h1 className="max-w-3xl bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl lg:text-6xl">
              AI news, tutorials & tools — no fluff.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              The latest on AI developments, hands-on tutorials, and tool breakdowns — built for builders and curious minds.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-100">
                <Link to="/articles">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read Articles
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                <Link to="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Link>
              </Button>
            </div>
            {totalArticleCount > 0 && (
              <p className="mt-6 text-sm text-slate-500">
                {totalArticleCount} articles · updated weekly
              </p>
            )}
          </div>

          <div className="grid content-start gap-4">
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h2 className="text-base font-semibold text-white">Explore content</h2>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: GraduationCap, label: 'Tutorials', href: '/tutorials', text: 'Hands-on AI guides', color: 'text-emerald-400' },
                  { icon: Beaker, label: 'Research', href: '/research', text: 'AI research & analysis', color: 'text-sky-400' },
                  { icon: MessageSquare, label: 'Discussions', href: '/threads', text: 'Community Q&A', color: 'text-violet-400' },
                  { icon: BookOpen, label: 'Reviews', href: '/product-reviews', text: 'AI tool reviews', color: 'text-amber-400' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="rounded-lg border border-slate-700 bg-slate-800/60 p-4 transition-all hover:border-slate-500 hover:bg-slate-700/80"
                  >
                    <item.icon className={`mb-3 h-5 w-5 ${item.color}`} />
                    <div className="font-semibold text-white">{item.label}</div>
                    <div className="text-sm text-slate-400">{item.text}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Featured resource ── */}
        {leadPost && (
          <section className="mb-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Start here</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">Featured learning resource</h2>
              </div>
              <Button asChild variant="ghost" className="hidden text-slate-600 hover:text-slate-900 sm:inline-flex">
                <Link to="/articles">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.7fr_0.3fr]">
              <ErrorBoundary>
                <PostCard post={leadPost} featured />
              </ErrorBoundary>
              <div className="flex flex-col gap-4">
                {secondaryFeatured.length > 0 ? (
                  secondaryFeatured.map((post) => (
                    <ErrorBoundary key={post.id}>
                      <PostCard post={post} compact />
                    </ErrorBoundary>
                  ))
                ) : (
                  <div className="self-start rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-950">Topics in the library</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(categories.length
                        ? categories
                        : ['AI basics', 'Machine learning', 'Prompting', 'Automation']
                      ).map((category) => (
                        <Badge key={category} variant="outline" className="border-slate-200 text-xs text-slate-600">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Recent articles ── */}
        <section className="mb-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Latest</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">Recent articles</h2>
            </div>
            <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:border-slate-500">
              <Link to="/articles">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {posts.length === 0 ? (
            <EmptyState
              title="No articles published yet."
              text="Create the first learning article from the admin post editor."
              icon={BookOpen}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <ErrorBoundary key={post.id}>
                    <PostCard post={post} />
                  </ErrorBoundary>
                ))}
              </div>

              {/* "More posts" CTA – always visible so readers know there's more */}
              <div className="relative mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-center text-white shadow-xl">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-600/20 blur-3xl" />
                <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-violet-600/15 blur-3xl" />
                <div className="relative">
                  {totalArticleCount > posts.length ? (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Showing {posts.length} of {totalArticleCount}
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-white">
                        {totalArticleCount - posts.length} more articles in the library
                      </h3>
                      <p className="mt-2 mx-auto max-w-md text-sm text-slate-400">
                        Browse tutorials, deep dives, research notes, and much more across every AI topic.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        All {totalArticleCount} articles
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-white">You're reading the freshest content</h3>
                      <p className="mt-2 mx-auto max-w-md text-sm text-slate-400">
                        New articles are published weekly. Browse all categories to find topics you haven't explored yet.
                      </p>
                    </>
                  )}
                  <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button asChild className="bg-white text-slate-950 hover:bg-slate-100">
                      <Link to="/articles">
                        Explore all {totalArticleCount > 0 ? totalArticleCount : ''} articles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                      <Link to="/tutorials">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        View Tutorials
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ── Discussion threads ── */}
        <section className="mb-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Community</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">Discussion threads</h2>
            </div>
            <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:border-slate-500">
              <Link to="/threads">
                View All Threads
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {threadPosts.length === 0 ? (
            <EmptyState
              title="No discussions started yet."
              text="Use threads for questions, short lessons, and community notes."
              icon={MessageSquare}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {threadPosts.map((post) => (
                  <ErrorBoundary key={post.id}>
                    <PostCard post={post} />
                  </ErrorBoundary>
                ))}
              </div>

              {totalThreadCount > threadPosts.length && (
                <div className="mt-8 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Showing {threadPosts.length} of {totalThreadCount} discussions
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Join the conversation on any AI topic</p>
                  </div>
                  <Button asChild variant="outline" className="shrink-0 border-slate-300">
                    <Link to="/threads">
                      All threads
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

function EmptyState({
  title,
  text,
  icon: Icon,
}: {
  title: string
  text: string
  icon: React.ElementType
}) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardContent className="py-10 text-center">
        <Icon className="mx-auto mb-3 h-10 w-10 text-slate-300" />
        <p className="font-semibold text-slate-700">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{text}</p>
      </CardContent>
    </Card>
  )
}
