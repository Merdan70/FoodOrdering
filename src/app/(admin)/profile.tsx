import { supabase } from "@/lib/supabase";
import { Text, View, Button } from "react-native";


const ProfileScreen = () =>{
    return (
        <View>
            <Text>profile</Text>

            <Button title="Sign out"
            onPress={ () =>  supabase.auth.signOut()}
            />
        </View>
    );
};

export default ProfileScreen;