import { RegisterForm } from '@/features/auth/RegisterForm';

export function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="absolute top-8 left-8">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
            SL
          </div>
          SmartLeads
        </div>
      </div>
      <RegisterForm />
    </div>
  );
}
