import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { defaultPizzaImage } from "@/components/ProductListItem";
import React, { useState } from "react";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";
import Colors from "@/constants/Colors";
import {FontAwesome} from "@expo/vector-icons";
import { useProduct } from "@/app/api/products";

const sizes: PizzaSize[]= ['S','M','L','XL'];

const ProductDetailsScreen = () =>{
  const { id: idString } = useLocalSearchParams();
    
  const id= parseFloat(typeof idString == 'string'? idString : idString[0]);

  //console.log(' 333 ' + id);
  const { data: product, error, isLoading} = useProduct(id);
  
    
    const { addItem } = useCart();

    const router = useRouter();
    const [selectedSize, setSelectedSize]= useState<PizzaSize>('M');

    const addToCart = () => {
        if(!product){
            return;
        }
        addItem(product, selectedSize);
        router.push('/cart');
    };
    if (isLoading) {
      return <ActivityIndicator />;
    }
  if (error || !product) {
      return <Text>Failed to fetch product</Text>;
    }


return (
        <View style={styles.container}>
<Stack.Screen
        options={{
          title: 'Menu' ,
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          }}
          />


            <Stack.Screen options={{ title: product.name }}/>
            <Image source={{uri: product.image || defaultPizzaImage}} style={styles.image}/>
            

            <Text style={styles.title} > {product.name}</Text>
            <Text style={styles.price} > €{product.price}</Text>

            {/* <Button onPress={addToCart} text="Add to cart"/> */}
        </View>
    )
};

const styles=StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 10,
    },
    image :{
        width: '100%',
        aspectRatio: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    

});

export default ProductDetailsScreen;