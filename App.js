import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View, Text} from 'react-native';
import {FAB, Portal, Provider, TextInput, Button} from 'react-native-paper';
import Modal from 'react-native-modal';

const AppContent = () => {
  const [visible, setVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [savedText, setSavedText] = useState('');
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text>{savedText}</Text>
          <Text>Hello, World!</Text>
          <FAB
            style={styles.fab}
            icon="plus"
            color='#fff'
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
                  label="テキスト"
                  mode="outlined"
                  style={styles.textInput}
                  onChangeText={text => setInputText(text)}
                  value={inputText}
                />
                <Button
                  mode="contained"
                  onPress={() => {
                    setSavedText(inputText);
                    setInputText('');
                    hideModal();
                  }}
                >
                  保存
                </Button>
              </View>
            </Modal>
          </Portal>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default function App() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
}
