import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const ErrorPage = () => {
    const error = useRouteError();
    console.error("Router Error:", error);

    // Provide defaults if error is null (e.g. when used as a regular element)
    const errorStatusText = error?.statusText || error?.message || "Not Found";
    const is404 = error?.status === 404 || !error;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
            <div className="bg-destructive/10 p-4 rounded-full mb-6">
                <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Ooops!</h1>
            <p className="text-xl text-muted-foreground mb-8">
                {is404 ? "This page doesn't exist." : "Sorry, an unexpected error has occurred."}
            </p>

            <div className="bg-card border rounded-lg p-6 mb-8 max-w-md w-full shadow-sm">
                <p className="font-mono text-sm text-destructive">
                    {errorStatusText}
                </p>
            </div>

            <Button asChild>
                <Link to="/">Go back home</Link>
            </Button>
        </div>
    );
};

export default ErrorPage;
