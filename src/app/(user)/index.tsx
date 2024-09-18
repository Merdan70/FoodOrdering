import { Redirect } from "expo-router";
import { useAuth } from '@/providers/AuthProvider';

export default function TabIndex() {
    const { session, loading, profile, isAdmin} = useAuth();
    if(!session){
        return <Redirect href={`/sign-in`} />
    }
    return <Redirect href={'/(user)/menu/'} />;
}