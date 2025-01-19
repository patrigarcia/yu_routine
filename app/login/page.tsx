import { Metadata } from 'next';
import LoginComponent from '@/app/components/Login';

export const metadata: Metadata = {
  title: 'YuRoutine | Iniciar sesión',
  description: 'Página de inicio de sesión de YuRoutine',
};

export default function LoginPage() {
  return <LoginComponent />;
}
