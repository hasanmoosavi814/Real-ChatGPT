import { RegisterForm } from "@/components/modules/auth/register-form";
import { AuthCard } from "@/components/modules/auth/auth-card";

const RegisterPage = () => {
  return (
    <AuthCard
      title="Create account"
      description="Register to start creating AI conversations."
    >
      <RegisterForm />
    </AuthCard>
  );
};

export default RegisterPage;
