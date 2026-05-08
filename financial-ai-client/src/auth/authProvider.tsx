import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useCookies } from 'react-cookie';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuardProvider({ children }: AuthGuardProps) {
  const [cookies] = useCookies(['user']);
  const router = useRouter();
  const pathName=usePathname()

  useEffect(() => {
    // 加上 typeof 檢查，避免 cookies.user 是奇怪的非字串值
    if (typeof cookies.user !== 'string' || !cookies.user.trim()) {
      if (pathName !== '/register') {
        router.replace('/login'); // 用 replace，避免用戶點返回鍵回到無效頁
      }
    }
  }, [cookies.user, pathName]);
  
  return <>{children}</>;
}
