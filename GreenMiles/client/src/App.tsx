import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Map from "@/pages/Map";
import Tokens from "@/pages/Tokens";
import Impact from "@/pages/Impact";
import { UserProvider } from "@/context/UserContext";
import { RouteProvider } from "@/context/RouteContext";
import { ThemeProvider } from "@/context/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={SignUp}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/map" component={Map}/>
      <Route path="/tokens" component={Tokens}/>
      <Route path="/impact" component={Impact}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <RouteProvider>
            <Router />
            <Toaster />
          </RouteProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
