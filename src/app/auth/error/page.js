import { Suspense } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import ErrorContent from '@/components/auth/ErrorContent'

function LoadingError() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl text-red-600">
                        Đang tải...
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<LoadingError />}>
            <ErrorContent />
        </Suspense>
    )
}