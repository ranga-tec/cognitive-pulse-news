import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'

// Import existing pages
import { Index } from '@/pages/Index'
import News from '@/pages/News'
import Tutorials from '@/pages/Tutorials'
import Articles from '@/pages/Articles'
import Research from '@/pages/Research'
import ProductReviews from '@/pages/ProductReviews'
import { Threads } from '@/pages/Threads'
import Search from '@/pages/Search'
import NotFound from '@/pages/NotFound'

// Import new pages
import { PostDetail } from '@/pages/PostDetail'
import { AdminLogin } from '@/pages/admin/Login'
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { AdminPosts } from '@/pages/admin/Posts'
import { AdminComments } from '@/pages/admin/Comments'
import { PostForm } from '@/components/admin/PostForm'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/news" element={<News />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/research" element={<Research />} />
              <Route path="/product-reviews" element={<ProductReviews />} />
              <Route path="/threads" element={<Threads />} />
              <Route path="/search" element={<Search />} />
              <Route path="/post/:id" element={<PostDetail />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="posts" element={<AdminPosts />} />
                <Route path="posts/new" element={<PostForm mode="create" />} />
                <Route path="posts/edit/:id" element={<PostForm mode="edit" />} />
                <Route path="comments" element={<AdminComments />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App