
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextInputComp from '../textinputcomp/TextInputComp';
import firestore from '@react-native-firebase/firestore';
import GlobalButtonComp from '../../components/button_component/GlobalButtonComp';

const { width, height } = Dimensions.get('screen');

const DropdownComp = ({ title, fields, onValuesChange, initialValues }) => {
  const [expanded, setExpanded] = useState(false);
  const [values, setValues] = useState(
    initialValues || fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
  );
  const [total, setTotal] = useState(initialValues?.total || '0');
  const [finalTotal, setFinalTotal] = useState(initialValues?.finalTotal || '0');
  const [docId, setDocId] = useState(null); // Store document ID for update/delete

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
      setTotal(initialValues.total || '0');
      setFinalTotal(initialValues.finalTotal || '0');
    }
  }, [initialValues]);

  const toggleDropdown = () => setExpanded(!expanded);

  const handleInputChange = (field, text) => {
    const updatedValues = { ...values, [field]: text };
    setValues(updatedValues);
    calculateTotals(updatedValues);
  };

  const calculateTotals = (updatedValues) => {
    const numericFields = ['bldg1', 'bldg2', 'bldg3', 'bldg4'];
    let sum = numericFields.reduce((total, field) => total + (parseFloat(updatedValues[field]) || 0), 0);
    let rate = parseFloat(updatedValues['rate/hour']) || 0;
    let final = sum * rate;

    setTotal(sum.toFixed(2));
    setFinalTotal(final.toFixed(2));

    onValuesChange(title, { ...updatedValues, total: sum.toFixed(2), finalTotal: final.toFixed(2) });
  };

  const fetchPreviousData = async (field) => {
    try {
      const querySnapshot = await firestore()
        .collection('prepForms')
        .where(`tasks.${title}.${field}`, '!=', '')
        .limit(1)
        .get();
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setDocId(doc.id);
        const data = doc.data().tasks[title];
        setValues(data);
        setTotal(data.total || '0');
        setFinalTotal(data.finalTotal || '0');
        Alert.alert('Success', 'Previous data loaded. Modify and save using the Update button.');
      } else {
        Alert.alert('Info', 'No previous data found for this field.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data: ' + error.message);
    }
  };

  const handleUpdate = async (field) => {
    if (!docId) {
      Alert.alert('Error', 'No document selected. Fetch previous data first.');
      return;
    }
    try {
      await firestore().collection('prepForms').doc(docId).update({
        [`tasks.${title}`]: { ...values, total, finalTotal },
      });
      Alert.alert('Success', 'Data updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update data: ' + error.message);
    }
  };

  const handleDelete = async (field) => {
    if (!docId) {
      Alert.alert('Error', 'No document selected to delete.');
      return;
    }
    try {
      await firestore().collection('prepForms').doc(docId).update({
        [`tasks.${title}.${field}`]: firestore.FieldValue.delete(),
      });
      const updatedValues = { ...values, [field]: '' };
      setValues(updatedValues);
      calculateTotals(updatedValues);
      Alert.alert('Success', 'Field deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete field: ' + error.message);
    }
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.header} onPress={toggleDropdown}>
        <Text style={styles.headerText}>{title}</Text>
        <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color="#fff" />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.body}>
          <FlatList
            data={['bldg1', 'bldg2', 'bldg3', 'bldg4', 'rate/hour', 'total', 'final total']}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.inputRow}>
                <TextInputComp
                  placeholder={`Enter ${item}`}
                  value={
                    item === 'total'
                      ? total
                      : item === 'final total'
                        ? finalTotal
                        : values[item] || ''
                  }
                  onChangeText={(text) => handleInputChange(item, text)}
                  style={styles.input}
                  inputStyle={styles.inputText}
                  keyboardType="numeric"
                  editable={!(item === 'total' || item === 'final total')}
                />
                {item !== 'total' && item !== 'final total' && (
                  <View style={styles.buttonContainer}>
                    <GlobalButtonComp
                      title="Fetch"
                      onPress={() => fetchPreviousData(item)}
                      style={styles.smallBtn}
                      textStyle={styles.btnTextStyle}
                    />
                    <GlobalButtonComp
                      title="Update"
                      onPress={() => handleUpdate(item)}
                      style={[styles.smallBtn, { backgroundColor: '#26525A' }]}
                      textStyle={styles.btnTextStyle}
                    />
                    <GlobalButtonComp
                      title="Delete"
                      onPress={() => handleDelete(item)}
                      style={[styles.smallBtn, { backgroundColor: '#26525A' }]}
                      textStyle={styles.btnTextStyle}
                    />
                  </View>
                )}
              </View>
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
    height: height * 0.05,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Medium',
  },
  body: {
    backgroundColor: '#204B57',
    padding: 9,
    width: width * 0.9,
    alignSelf: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    height: height * 0.042,
    width: width * 0.40, // Adjusted width to fit additional button
    marginRight: 5,
  },
  inputText: {
    fontSize: 10,
    paddingHorizontal: 10,
    fontFamily: 'Montserrat-Regular',
    color: '#535C60',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  smallBtn: {
    width: width * 0.14,
    height: height * 0.04,
    borderRadius: 5,
    backgroundColor: '#26525A',
    marginHorizontal: 2,
  },
  btnTextStyle: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '500',
    fontSize: 10
  }
});

export default DropdownComp;