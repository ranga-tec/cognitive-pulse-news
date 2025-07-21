import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// FORCE IMPORT CSS FILES
import './index.css'
import './App.css'

// Import contexts and components
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
  // Add CSS loading verification
  React.useEffect(() => {
    console.log('🎨 App loaded, checking CSS...')
    
    // Force add basic styles if Tailwind fails
    const testElement = document.createElement('div')
    testElement.className = 'bg-blue-500'
    document.body.appendChild(testElement)
    
    const computedStyle = window.getComputedStyle(testElement)
    const backgroundColor = computedStyle.backgroundColor
    
    document.body.removeChild(testElement)
    
    if (backgroundColor !== 'rgb(59, 130, 246)') {
      console.warn('⚠️ Tailwind CSS not loading properly, adding fallback styles')
      
      // Add emergency inline styles
      const emergencyStyle = document.createElement('style')
      emergencyStyle.textContent = `
        body { 
          font-family: system-ui, -apple-system, sans-serif; 
          margin: 0; 
          padding: 0;
          background: #ffffff;
          color: #1f2937;
        }
        .bg-blue-500 { background-color: #3b82f6 !important; }
        .text-white { color: #ffffff !important; }
        .p-4 { padding: 1rem !important; }
        .rounded-lg { border-radius: 0.5rem !important; }
        .mb-4 { margin-bottom: 1rem !important; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      `
      document.head.appendChild(emergencyStyle)
    } else {
      console.log('✅ CSS loaded successfully')
    }
  }, [])

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