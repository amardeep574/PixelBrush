import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can change the icon library

const TextInputComp = ({
  inputStyle, // Ensure this is applied to TextInput, not the container
  style,
  icon,
  iconColor = '#555',
  iconSize = 24,
  secureTextEntry = false,
  onIconPress,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={[styles.input, inputStyle]} // Apply inputStyle correctly
        secureTextEntry={secureTextEntry}
        {...props}
      />
      {icon && (
        <TouchableOpacity onPress={onIconPress}>
          <Icon name={icon} size={iconSize} color={iconColor} style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
});

export default TextInputComp;
