import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextInputComp from '../textinputcomp/TextInputComp';

const { width, height } = Dimensions.get('screen');

const DropdownComp = ({ title, fields }) => {
  const [expanded, setExpanded] = useState(false);
  const [values, setValues] = useState({});

  const toggleDropdown = () => setExpanded(!expanded);

  const handleInputChange = (field, text) => {
    setValues((prev) => ({ ...prev, [field]: text }));
  };

  return (
    <View style={styles.dropdownContainer}>
      {/* Dropdown Header */}
      <TouchableOpacity style={styles.header} onPress={toggleDropdown}>
        <View style={{ gap: 2 }}>
          <Text style={styles.headerText}>{title}</Text>
          <Text style={styles.fieldsText}>
            {fields.map((field, index) => index === fields.length - 1 ? field : `${field}, `)}
          </Text>
        </View>
        <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={15} color="#fff" />
      </TouchableOpacity>

      {/* Dropdown Body */}
      {expanded && (
        <View style={styles.body}>
          <FlatList
            data={fields}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TextInputComp
                placeholder={`Enter ${item}`}
                value={values[item] || ''}
                onChangeText={(text) => handleInputChange(item, text)}
                style={styles.input}
                inputStyle={styles.inputText}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E3A42',
    padding: 15,
    borderRadius: 3,
    width: width * 0.9,
    alignSelf: 'center',
    height: height * 0.05
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: "Montserrat-Medium",
    fontWeight: '600',
    lineHeight: 14,
  },
  body: {
    backgroundColor: '#204B57',
    padding: 9,
    width: width * 0.9,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#D9D9D9',
    marginVertical: 5,
    borderRadius: 8,
    height: height * 0.042,
    width: width * 0.85,
  },
  inputText: {
    fontSize: 10,
    paddingHorizontal: 10,
    fontFamily: "Montserrat-Regular",
    fontWeight: '400',
    lineHeight: 18,
    color: '#535C60'
  },
  fieldsText: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '300',
    fontSize: 8,
    lineHeight: 14,
    color: '#FFFFFF',
  }
});

export default DropdownComp;
