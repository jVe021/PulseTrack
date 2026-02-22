import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <GlassCard className="flex flex-col items-center text-center max-w-md w-full">
                <h1 className="text-4xl font-bold text-gradient mb-2">404</h1>
                <h2 className="text-xl font-semibold mb-4 text-text-primary">Page Not Found</h2>
                <p className="text-text-secondary mb-8">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>
                <Link href="/dashboard" className="w-full">
                    <Button variant="primary" className="w-full">
                        Go to Dashboard
                    </Button>
                </Link>
            </GlassCard>
        </div>
    );
}
