import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 main.tsx loading...')

const rootElement = document.getElementById('root')
console.log('Root element found:', !!rootElement)

if (!rootElement) {
  console.error('❌ Root element not found!')
} else {
  console.log('✅ Root element exists, rendering App...')
}

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)