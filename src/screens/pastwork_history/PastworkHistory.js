import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'

const PastworkHistory = () => {
  return (
   <SafeAreaView style={{flex:1}}>
     <LinearGradient colors={['#26525A','#B4C6D0']} style={styles.gradient}>
     <View style={styles.container}>
      <Text style={styles.profileText}>past wrok history</Text>
    </View>
     </LinearGradient>
   </SafeAreaView>
  )
}

export default PastworkHistory

const styles = StyleSheet.create({
  gradient:{
    flex:1
  },
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  profileText:{
    color:'#ffffff',
    fontSize:20
  }
})