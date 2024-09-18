import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { Redirect, router } from "expo-router";
import { Text, View, Button, StyleSheet } from "react-native";

// const LogOut = () =>{
//     return <Redirect href={'/?flag=1'} />;
// };
const ProfileScreen = () =>{
    return (
        <View>
           {/* <Text>profile</Text> */}

            <Button title="Sign out"
            onPress ={() => supabase.auth.signOut()}
            // {() => LogOut()}
             
            />
           
        </View>
        
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
      padding: 20,
      justifyContent: 'center',
      flex: 1,
    },
    textButton: {
      alignSelf: 'center',
      fontWeight: 'bold',
      color: Colors.light.tint,
      marginVertical: 10,
    },
  });
  