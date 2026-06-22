import { RegisterForm } from "@modules/auth/register-form";
import { AuthCard } from "@modules/auth/auth-card";

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
