import router, { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../../Services/APIClient";

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}

type SignInCredentials = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

type AuthContextData = {
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => void;
    user: User;
    isAuthenticated: boolean;
}

export function signOut() {
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')

    authChannel.postMessage('signOut')

    router.push('/')
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter()
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    useEffect(() => {
        authChannel = new BroadcastChannel('auth')

        authChannel.onmessage = (message) => {
            switch (message.data) {
                case 'signOut':
                    signOut();
                    break;
                default:
                    break;
            }
        }
    }, [])

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()

        if (token) {
            api.get('/me').then(response => {
                const { email, permissions, roles } = response.data;

                setUser({ email, permissions, roles })
            })
                .catch(() => {
                    signOut()
                })
        }
    }, [])

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const { data } = await api.post('sessions', {
                email,
                password
            })

            const { token, refreshToken, permissions, roles } = data;

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            })
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            })

            setUser({
                email: email,
                permissions: permissions,
                roles: roles
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            router.push('/dashboard');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, user, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}