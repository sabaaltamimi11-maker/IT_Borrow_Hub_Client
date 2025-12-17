import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AdminDashboard from "./components/AdminDashboard";
import DeviceDetails from "./components/DeviceDetails";
import BorrowingHistory from "./components/BorrowingHistory";
import NewPost from "./components/NewPost";
import PaymentPage from "./components/PaymentPage";

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route
            path="/admin"
            element={
              user && user.role === "Admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/device/:id" element={<DeviceDetails />} />
          <Route
            path="/borrowings"
            element={
              user && user.role !== "Admin" ? (
                <BorrowingHistory />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/newpost/:deviceId"
            element={user ? <NewPost /> : <Navigate to="/login" />}
          />
          <Route
            path="/payment/:borrowingId"
            element={user ? <PaymentPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

