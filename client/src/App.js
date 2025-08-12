import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import MovieDetail from "@/pages/MovieDetail";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
function Router() {
    return (<Switch>
      <Route path="/" component={Home}/>
      <Route path="/movie/:id" component={MovieDetail}/>
      <Route path="/admin" component={Admin}/>
      <Route component={NotFound}/>
    </Switch>);
}
function App() {
    return (<QueryClientProvider client={queryClient}>
      <div className="min-h-screen cine-bg-dark">
        <Toaster />
        <Router />
      </div>
    </QueryClientProvider>);
}
export default App;
