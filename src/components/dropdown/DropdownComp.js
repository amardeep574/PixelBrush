import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextInputComp from '../textinputcomp/TextInputComp';
import firestore from '@react-native-firebase/firestore';
import GlobalButtonComp from '../../components/button_component/GlobalButtonComp';

const { width, height } = Dimensions.get('screen');

const DropdownComp = ({ title, fields, onValuesChange, initialValues, collectionName,isEditable }) => {
  const [expanded, setExpanded] = useState(false);
  const [values, setValues] = useState(
    initialValues || fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
  );
  const [total, setTotal] = useState(initialValues?.total || '');
  const [finalTotal, setFinalTotal] = useState(initialValues?.finalTotal || '');
  const [docId, setDocId] = useState(null);

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
      setTotal(initialValues.total?.toString() || '');
      setFinalTotal(initialValues.finalTotal?.toString() || '');
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
    const sum = numericFields.reduce((acc, field) => acc + (parseFloat(updatedValues[field]) || 0), 0);
    const rate = parseFloat(updatedValues['rate/hour']) || 0;
    const final = sum * rate;

    const newTotal = sum > 0 ? sum.toString() : '';
    const newFinalTotal = final > 0 ? final.toString() : '';

    setTotal(newTotal);
    setFinalTotal(newFinalTotal);

    onValuesChange(title, {
      ...updatedValues,
      total: newTotal,
      finalTotal: newFinalTotal,
    });
  };

  const fetchPreviousData = async () => {
    try {
      const querySnapshot = await firestore()
        .collection("formData")
        .where(`tasks.${title}`, '!=', null) // Check if the task exists
        .limit(1)
        .get();
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setDocId(doc.id);
        const data = doc.data().tasks[title];
        setValues(data);
        console.log("DOC DATA--->", doc.data())
        setTotal(data.total?.toString() || '');
        setFinalTotal(data.finalTotal?.toString() || '');
        calculateTotals(data);
        Alert.alert('Success', 'Previous data loaded. Modify and save using the Update button.');
      } else {
        Alert.alert('Info', 'No previous data found for this dropdown.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data: ' + error.message);
    }
  };

  const handleUpdate = async () => {
    if (!docId) {
      Alert.alert('Error', 'No document selected. Fetch previous data first.');
      return;
    }
    try {
      await firestore().collection("formData").doc(docId).update({
        [`tasks.${title}`]: { ...values, total, finalTotal },
      });
      Alert.alert('Success', 'Data updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update data: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!docId) {
      Alert.alert('Error', 'No document selected to delete.');
      return;
    }
    try {
      await firestore().collection("formData").doc(docId).update({
        [`tasks.${title}`]: firestore.FieldValue.delete(), // Delete the entire task
      });
      setValues(fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
      setTotal('');
      setFinalTotal('');
      setDocId(null);
      onValuesChange(title, { ...values, total: '', finalTotal: '' });
      Alert.alert('Success', 'Dropdown data deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete data: ' + error.message);
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
                  onChangeText={(text) =>
                    item !== 'total' && item !== 'final total' && handleInputChange(item, text)
                  }
                  style={styles.input}
                  inputStyle={styles.inputText}
                  keyboardType="numeric"
                  editable={item !== 'total' && item !== 'final total' && !isEditable}
                />
              </View>
            )}
          />
          {!isEditable &&
          <View style={styles.buttonContainer}>
            <GlobalButtonComp
              title="Edit"
              onPress={fetchPreviousData}
              style={styles.smallBtn}
              textStyle={styles.btnTextStyle}
            />
            <GlobalButtonComp
              title="Update"
              onPress={handleUpdate}
              style={[styles.smallBtn, { backgroundColor: '#26525A' }]}
              textStyle={styles.btnTextStyle}
            />
            <GlobalButtonComp
              title="Delete"
              onPress={handleDelete}
              style={[styles.smallBtn, { backgroundColor: '#26525A' }]}
              textStyle={styles.btnTextStyle}
            />
          </View>}
          
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
    width: width * 0.85, // Wider input since buttons are moved
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
    justifyContent: 'space-around',
    marginTop: 10,
  },
  smallBtn: {
    width: width * 0.25, // Slightly wider buttons for better readability
    height: height * 0.04,
    borderRadius: 5,
    backgroundColor: '#26525A',
  },
  btnTextStyle: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 10,
  },
});

export default DropdownComp;



