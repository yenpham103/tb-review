'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home } from 'lucide-react'

export default function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl text-red-600">
                        Không thể đăng nhập
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="text-gray-600">
                        {error === 'AccessDenied' ? (
                            <div>
                                <p className="mb-2">
                                    Chỉ các email thuộc domain <strong>@bsscommerce.com</strong> mới được phép truy cập hệ thống.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Vui lòng sử dụng email công ty để đăng nhập.
                                </p>
                            </div>
                        ) : (
                            <p>Đã xảy ra lỗi trong quá trình đăng nhập.</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <Link href="/">
                            <Button className="w-full">
                                <Home className="w-4 h-4 mr-2" />
                                Về trang chủ
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}