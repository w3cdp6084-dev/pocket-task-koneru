import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import {
  FAB,
  Portal,
  Provider,
  TextInput,
  Button,
  IconButton,
} from 'react-native-paper';
import Modal from 'react-native-modal';

const AppContent = () => {
  const [visible, setVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [savedTexts, setSavedTexts] = useState([]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const toggleFavorite = (id) => {
    setSavedTexts(
      savedTexts.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={savedTexts}
          renderItem={({item}) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{item.text}</Text>
              <IconButton
                icon={item.isFavorite ? 'star' : 'star-outline'}
                onPress={() => toggleFavorite(item.id)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          color="#fff"
          onPress={showModal}
        />
        <Portal>
          <Modal
            isVisible={visible}
            onBackdropPress={hideModal}
            style={styles.modal}
            backdropColor="rgba(0, 0, 0, 0.5)"
          >
            <View style={styles.modalContainer}>
              <TextInput
                label="タスク"
                mode="outlined"
                style={styles.textInput}
                onChangeText={(text) => setInputText(text)}
                value={inputText}
              />
              <Button
                mode="contained"
                onPress={() => {
                  setSavedTexts([
                    ...savedTexts,
                    {
                      id: Date.now().toString(),
                      text: inputText,
                      isFavorite: false,
                    },
                  ]);
                  setInputText('');
                  hideModal();
                }}
              >
                保存
              </Button>
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#204877',
    borderRadius: 50,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textInput: {
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
   
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    },
    listItemText: {
    fontSize: 16,
    },
    });
    
    export default function App() {
    return (
    <Provider>
    <AppContent />
    </Provider>
    );
    }