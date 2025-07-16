import React from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare,
  LogOut,
  Brain,
  Eye
} from 'lucide-react'

export function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const isActiveRoute = (path: string) => {
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/admin/dashboard" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="font-bold text-xl text-gray-900">AI Insights Admin</span>
              </Link>
              <div className="flex space-x-1">
                <Link 
                  to="/admin/dashboard" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute('/admin/dashboard') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/admin/posts" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute('/admin/posts') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Posts</span>
                </Link>
                <Link 
                  to="/admin/comments" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute('/admin/comments') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Comments</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                target="_blank" 
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Eye className="h-4 w-4" />
                <span>View Site</span>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}