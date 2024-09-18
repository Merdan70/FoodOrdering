import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useDeleteProdect, useInsertProduct, useProduct, useUpdateProduct } from "@/app/api/products";
import * as FileSystem from 'expo-file-system';
import { supabase } from "@/lib/supabase";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import RemoteImage from "@/components/RemoteImage";


const CreateProductScreen = () => {
const [name,setName]= useState('');
const [price, setPrice]= useState('');
const [errors, setErrors]= useState('');
const [image, setImage] = useState<string | null>(null);
const [uploadFlag, setUploasFlag] = useState(0);
const [isuploadFlag, setIsUploasFlag] = useState(false);
const { id: idString } = useLocalSearchParams();
const id = parseFloat(typeof idString == 'string' ? idString : idString?.[0]);
const { data: updatedProduct, isLoading } = useProduct(id);

//const { id } =useLocalSearchParams();
const isUpdating = !!id;
const { mutate: insertProduct } = useInsertProduct();
const { mutate: updateProduct } = useUpdateProduct();
const {data: updatingProduct} = useProduct(id);
const {mutate: deleteProduct}= useDeleteProdect();

const router = useRouter();

useEffect (() => {
    if(updatingProduct)
    {
        setName(updatingProduct.name);
        setPrice(updatingProduct.price.toString());
        setImage(updatingProduct.image);
    }
},[updatingProduct]);


const resetFields = () => {
    setName('');
    setPrice('');
    setImage('');
};
const validateInput = () => {
    setErrors('');
    if(!name){
        setErrors('Name is required');
        return false;
    }
    if(!price){
        setErrors('Price is required');
        return false;
    }
    if(isNaN(parseFloat(price))){
        setErrors('Price is not a number');
        return false;
    }
    
    return true;
};

const onSubmit = () => {
    if(isUpdating){
        onUpdate();
    }
    else{
        onCreate();
    }
};
const onCreate = async () =>{
    if(!validateInput())
    {
        return;
    }
    //console.warn('Create product');
    // save in the database
    const imagePath=await uploadImage();
    //console.log('1111 '+imagePath);
    insertProduct({ name, price: parseFloat(price), image: imagePath },{
         onSuccess: ()=>{
            resetFields();
            router.back();
         }
    });
};



const onUpdate = async () =>{
    if(!validateInput())
    {
        return;
    }
    const imagePath= await uploadImage();
    
    console.warn('Update product');
    updateProduct(
        
        { id, name, price: parseFloat(price), image: imagePath },
        {
          onSuccess: () => {
           // setImage(imagePath);
          //  console.log('Update is success');
            resetFields();
            router.back();
          },
        }
      );
    // save in the database
   // resetFields();
};
const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const onDelete = () => {
   deleteProduct(id, {
    onSuccess: () => {
        resetFields();
        router.replace('/(admin)');
        //router.back();
      },
   });
  };
// 
  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;
    }
    setIsUploasFlag(true);
    setUploasFlag(1);
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType });
      setIsUploasFlag(false);
    if (data) {
        return data.path;
    }
  };
  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product?', [
        {
            text: 'Cancel',
        },
        {
            text: 'Delete',
            style: 'destructive',
            onPress: onDelete,
        }
    ]);
  };
console.log(image);
    return (
        <View style={styles.container}>
<Stack.Screen options={{title: isUpdating ? 'Update Product' : 'Create Product'}} />
        { uploadFlag ? (<Image source={{uri: image || defaultPizzaImage}} style={styles.image}  />):(
            
             <RemoteImage 
            path = {image}
            fallback={defaultPizzaImage}
            style={styles.image}
            /> )}
             
            <Text onPress={pickImage} style={styles.textButton}>Select Image</Text>

            <Text style={styles.label}>create</Text>
            <TextInput 
            value={name} 
            onChangeText={setName}
            placeholder="Name" 
            style={styles.input}
            />
            <Text style={styles.label}>Price ($)</Text>
            <TextInput 
            value={price} 
            onChangeText={setPrice}
            placeholder="9.99" 
            style={styles.input} 
            keyboardType="numeric"
            />
            <Text style={{color: 'red'}} >{errors}</Text>
            <Button onPress={onSubmit} disabled={isuploadFlag} text={isUpdating ? 'Update':'Create'} />
            {isUpdating && (
                <Text onPress={confirmDelete} disabled={isuploadFlag} style={styles.textButton}>
                    Delete
                </Text>
            )}

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20,
    },
    label: {
        color: 'gray',
        fontSize: 16,
    },
    image: {
        width: '50%',
        aspectRatio: 1,
        alignSelf: 'center',
    },
    textButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Colors.light.tint,
        marginVertical: 10,
    },
});

export default CreateProductScreen;