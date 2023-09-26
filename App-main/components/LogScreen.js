import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Button, Animated, Alert } from 'react-native'; // import react-native tools
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [noteIndex, setNoteIndex] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState(''); // These look the exact same... why?

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes !== null) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveNote = async () => {
    
    let summary = newNote.slice(0, 40);
    if (newNote.length >= 40){
      summary += '...';
    }
    const date = new Date().toLocaleString(); // Get the current date/time

    const newNoteObject = { 
      content: newNote,
      summary: summary,
      date: date,
    };

    let savedNotes = await AsyncStorage.getItem('notes');
    let notesArray = savedNotes ? JSON.parse(savedNotes) : [];

    if (noteIndex !== null) {
      notesArray[noteIndex] = newNoteObject;
    } else {
      notesArray.push(newNoteObject);
    }

    await AsyncStorage.setItem('notes', JSON.stringify(notesArray));

    setModalVisible(false); // setVisible
    setNewNote(''); // whenever a new note is created set blank
    setNoteIndex(null); // set note index passing null (no clue?)
    setNotes(notesArray);
  };

  const handleDeleteNote = (index) => {
    const newNotes = [...notes];
    newNotes.splice(index, 1);
    setNotes(newNotes);
  };
  
  const renderItem = ({ item, index }) => {
    const handleDeleteSwipe = () => {
      handleDeleteNote(index);
    };
    const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 0, 100],
    });
      return (
      <TouchableOpacity
        style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', padding: 20, width: 100 }}
        onPress={handleDeleteSwipe}
      >
        <Animated.Text style={{ color: 'white', transform: [{ translateX: trans }] }}>
          Delete
        </Animated.Text>
      </TouchableOpacity>
    );
  };
    return (
      <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={() => console.log('onSwipeableWillOpen')}
      onSwipeableWillClose={() => console.log('onSwipeableWillClose')}
      overshootRight={false}
      overshootLeft={false}
      friction={1}
      leftThreshold={30}
      rightThreshold={40}
      containerStyle={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    >

      <TouchableOpacity onPress={() => {
        setNewNote(item.content);
        setNoteIndex(index);
        setModalVisible(true);
      }}>
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18 }}>{item.emoji}{item.summary}</Text>
          <Text style={{ fontSize: 12, color: 'gray' }}>{item.date}</Text>
        </View>
      </TouchableOpacity>

    </Swipeable>
  );
};

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
      } catch (error) {
        console.error(error);
      }
    };
    saveNotes();
  }, [notes]);

  return (
    <View style={{flex: 1, paddingTop: 10, backgroundColor: '#fff'}}>
      {notes.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Text style={{ fontStyle: 'italic', fontSize: 24, textAlign: 'center' }}>No items yet, {'\n'}add one by pressing the "+"</Text>
        </View>
      ) : (
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        extraData={notes}
      />
      )}
      <Modal 
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={{ flex: 1, paddingTop: 50}}>
          <TextInput
            placeholder="Enter name of product"
            multiline={true}
            numberOfLines={4} // I mean I suppose these are meant to be short
            onChangeText={(text) => setNewNote(text)}
            value={newNote}
            style={{ fontSize: 24, padding: 20 }}
          />
          <Button title="Save" onPress={handleSaveNote} />
          <Button
            title="Cancel"
            onPress={() => {
            setModalVisible(false);
            }}
            color="red"
          />
          </View>
      </Modal>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Text style={{ fontSize: 30, color: 'white', backgroundColor: 'blue', padding: 10, borderRadius: 50 }}>+</Text>
      </TouchableOpacity>
    </View>


    );
  };
export default NotesScreen;
