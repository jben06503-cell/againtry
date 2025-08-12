import { QueryClientProvider } from '@tanstack/react-query'
import { Router, Route } from 'wouter'
import { queryClient } from '@/lib/queryClient'
import Home from '@/pages/Home'
import MovieDetail from '@/pages/MovieDetail'
import Admin from '@/pages/Admin'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/movie/:id" component={MovieDetail} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Router>
    </QueryClientProvider>
  )
}

export default App