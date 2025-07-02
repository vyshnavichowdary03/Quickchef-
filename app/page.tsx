import Header from '@/components/Header';
import ClientApp from '@/components/ClientApp';

export default function Home() {
  return (
    <div className="min-h-screen bg-background spice-pattern">
      <Header />
      <ClientApp />
    </div>
  );
}