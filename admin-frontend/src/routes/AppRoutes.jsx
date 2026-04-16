import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyCodePage from "../pages/auth/VerifyCodePage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-code" element={<VerifyCodePage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}