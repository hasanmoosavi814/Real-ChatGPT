import { LoginForm } from "@modules/auth/login-form";
import { AuthCard } from "@modules/auth/auth-card";

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
