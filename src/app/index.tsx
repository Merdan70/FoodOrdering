import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import Button from '../components/Button';
import { Link, Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

const index = () => {
  const { session, loading, isAdmin} = useAuth();
//   if(loading){
//     return <ActivityIndicator/>;
//   }
// if(!session){
//   return <Redirect href={`/sign-in`} />
// }

// if(!isAdmin){
//   return <Redirect href={`/(user)`} />
// }
// else {
//   return <Redirect href={`/(admin)`} />
// }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      
      
      <Link href={'/(admin)'} asChild>
        <Button text="Admin" />
      </Link>
      <Link href={'/(user)'} asChild>
        <Button text="Users" />
      </Link>
      <Link href={'/sign-in'} asChild>
        <Button text="Sign In" />
      </Link>

      
      <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
    </View>
  );
};

export default index;