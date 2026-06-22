import { LoginForm } from "@/components/modules/auth/login-form";
import { AuthCard } from "@/components/modules/auth/auth-card";

const LoginPage = () => {
  return (
    <AuthCard
      title="Welcome back"
      description="Login to continue your chat workspace."
    >
      <LoginForm />
    </AuthCard>
  );
};

export default LoginPage;
