import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { HomePage } from '@/app/components/HomePage';
import { LoginPage } from '@/app/components/LoginPage';
import { SignUpPage } from '@/app/components/SignUpPage';
import { AccountPage } from '@/app/components/AccountPage';
import { SearchPage } from '@/app/components/SearchPage';
import { PlaceDetailPage } from '@/app/components/PlaceDetailPage';
import { CreatePostPage } from '@/app/components/CreatePostPage';
import { WeekendPlannerPage } from '@/app/components/WeekendPlannerPage';
import { BookmarksPage } from '@/app/components/BookmarksPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    // Check if user wants to keep credentials saved
    const savedCredentials = localStorage.getItem('savedCredentials');
    const shouldKeepCredentials = savedCredentials && JSON.parse(savedCredentials).remember;
    
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    
    // Only clear credentials if user hasn't enabled "Remember Me"
    if (!shouldKeepCredentials) {
      localStorage.removeItem('savedCredentials');
    }
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-neutral-900 text-white">
        {/* Fixed Left Navigation - only show on pages other than home, login, signup */}
        <Routes>
          <Route path="/" element={null} />
          <Route path="/login" element={null} />
          <Route path="/signup" element={null} />
          <Route path="*" element={<Navigation user={currentUser} onLogout={handleLogout} />} />
        </Routes>

        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage user={currentUser} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUpPage onSignup={handleLogin} />} />
            <Route path="/search" element={<SearchPage user={currentUser} />} />
            <Route path="/place/:id" element={<PlaceDetailPage user={currentUser} />} />
            <Route path="/post" element={
              currentUser ? <CreatePostPage user={currentUser} /> : <Navigate to="/login" />
            } />
            <Route path="/bookmarks" element={
              currentUser ? <BookmarksPage user={currentUser} /> : <Navigate to="/login" />
            } />
            <Route path="/planner" element={
              currentUser ? <WeekendPlannerPage user={currentUser} /> : <Navigate to="/login" />
            } />
            <Route path="/account" element={
              currentUser ? <AccountPage user={currentUser} onUpdateUser={handleLogin} /> : <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}