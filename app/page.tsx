import { Metadata } from 'next';
import HomeComponent from './components/Home';

export const metadata: Metadata = {
  title: 'YuRoutine | Inicio',
  description: 'Página principal de YuRoutine',
};

export default function Page() {
  return <HomeComponent />;
}
