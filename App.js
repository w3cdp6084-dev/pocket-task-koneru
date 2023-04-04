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
import Swipeout from 'react-native-swipeout';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

function AppContent() {
  const [savedTexts, setSavedTexts] = useState([]);
  const Tab = createBottomTabNavigator();
  const filteredFavorites = savedTexts.filter((text) => text.isFavorite);
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          children={() => <HomeScreen savedTexts={savedTexts} setSavedTexts={setSavedTexts} />}
        />
      <Tab.Screen name="Favorites">
        {() => <FavoritesScreen favoriteTexts={filteredFavorites} />}
      </Tab.Screen>
        </Tab.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({savedTexts, setSavedTexts, setFavoriteTexts}) => {
  const [visible, setVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const toggleFavorite = (id) => {
    const updatedTexts = savedTexts.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
    );
    setSavedTexts(updatedTexts);

    const newFavoriteTexts = updatedTexts.filter((item) => item.isFavorite);
    setFavoriteTexts(newFavoriteTexts);
  };

  const deleteText = (id) => {
    setSavedTexts(savedTexts.filter((item) => item.id !== id));
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={savedTexts}
          renderItem={({item}) => {
            const swipeoutButtons = [
              {
                text: '削除',
                backgroundColor: 'red',
                onPress: () => deleteText(item.id),
              },
            ];
            return (
              <Swipeout
                right={swipeoutButtons}
                autoClose={true}
                backgroundColor="transparent"
              >
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>{item.text}</Text>
                  <IconButton
                    icon={item.isFavorite ? 'star' : 'star-outline'}
                    onPress={() => toggleFavorite(item.id)}
                  />
                </View>
              </Swipeout>
            );
          }}
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
                label="テキスト"
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
const FavoritesScreen = ({ favoriteTexts }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteTexts}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
      />
    </View>
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
