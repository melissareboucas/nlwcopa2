import { createContext , ReactNode, useState, useEffect} from "react";

import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

import {api} from '../services/api'

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: String
    avatarUrl: String
}


export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean
    signIn: () => Promise<void>
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>({} as UserProps)

    const[isUserLoading, setIsUserLoading] = useState(false)

    const [_, googleResponse, googleAuth] = Google.useAuthRequest({
        clientId: process.env.CLIENT_ID,
        androidClientId: '118742075177-6c0vosth5shbfai8umhdisliot6o07r1.apps.googleusercontent.com', 
        redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
        scopes: ['profile', 'email'],
        selectAccount: true
    })
    

    async function signIn() {
        try {
            setIsUserLoading(true)
            await googleAuth();


        } catch (error) {
            console.log(error)
            throw error;
            
        } finally {
            setIsUserLoading(false)
        }
    }

    


    useEffect(() => {

        async function signInWithGoogle(access_token: string) {
            try {
                setIsUserLoading(true);

               
                const tokenResponse = await api.post('/users', {access_token})
                api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`  
                //console.log(tokenResponse.data.token)
                
                const userInfoResponse = await api.get('/me');
                setUser(userInfoResponse.data.user)
                
    
            } catch (error) {
                console.log(error);
                throw error
            } finally {
                setIsUserLoading(false)
            }
        }

        if(googleResponse?.type === 'success') {
            const { access_token } = googleResponse.params;
            signInWithGoogle(access_token)
        }
    }, [googleResponse]);


    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user
        }}>
            {children}
        </AuthContext.Provider>
    )
}