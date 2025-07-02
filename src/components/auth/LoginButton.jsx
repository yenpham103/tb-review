'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogIn, LogOut } from 'lucide-react'

export default function LoginButton() {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <Button disabled>Đang tải...</Button>
    }

    if (session) {
        return (
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image} />
                    <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{session.user?.name}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="flex items-center gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                </Button>
            </div>
        )
    }

    return (
        <div className="text-center">
            <Button
                onClick={() => signIn('google')}
                className="flex items-center gap-2 mb-2"
            >
                <LogIn className="h-4 w-4" />
                Đăng nhập với Google
            </Button>
            <p className="text-xs text-gray-500">
                Chỉ email @bsscommerce.com được phép truy cập
            </p>
        </div>
    )
}
