import { icons } from "@/constants/icons";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

const profile = () => {
  return (
    <View>
      <Text>profile</Text>
      <Image source={icons.logo}></Image>
    </View>
  );
};

export default profile;
