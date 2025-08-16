import React from 'react';
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import ChatPage from "@/pages/chat-dark";
import AuthPage from "@/pages/auth-page-dark";
import AdminPanel from "@/pages/admin-panel";
import NotFoundPage from "@/pages/not-found";
import TermsOfServicePage from "@/pages/terms-of-service";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import ProtectedRoute from "@/lib/protected-route";

// Using the properly configured queryClient from lib/queryClient.ts

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-950 dark:bg-gray-900">
          <Switch>
            <Route path="/auth" component={AuthPage} />
            <Route path="/admin">
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            </Route>
            <Route path="/terms" component={TermsOfServicePage} />
            <Route path="/privacy" component={PrivacyPolicyPage} />
            <Route path="/">
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            </Route>
            <Route component={NotFoundPage} />
          </Switch>
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;