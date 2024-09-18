import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import Button from '../components/Button';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

const index = () => {
 // const { flag } = useLocalSearchParams<{ flag: string }>();
  const { session, loading, profile, isAdmin} = useAuth();
  
  if(!isAdmin)
    console.log('111  not Admin ');
  console.log('111  admin');
  if(profile?.group!='Admin')
    console.log('222 not Admin');
  console.log('222 admin');
  if(loading){
    return <ActivityIndicator/>;
  }
  
  // if(flag=='1'){
  //   //console.log(flag);
  //   supabase.auth.signOut();
  //   return <Redirect href={`/sign-in`} />;
  // }

if(!session){
  return <Redirect href={`/sign-in`} />
}

//if(!isAdmin)
if(profile?.group!='Admin')  
{
  return <Redirect href={`/(user)`} />
}
else {
  return <Redirect href={`/(admin)`} />
}

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      
      
      {/* <Link href={'/(admin)'} asChild>
        <Button text="Admin" />
      </Link>
      <Link href={'/(user)'} asChild>
        <Button text="Users" />
      </Link>
      <Link href={'/sign-in'} asChild>
        <Button text="Sign In" />
      </Link> */}

      
      <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
    </View>
  );
};

export default index;