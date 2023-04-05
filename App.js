import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  FlatList,
} from "react-native";
import {
  FAB,
  Portal,
  Provider,
  TextInput,
  Button,
  IconButton,
  Searchbar,
} from "react-native-paper";
import Modal from "react-native-modal";
import Swipeout from "react-native-swipeout";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const TopTab = createMaterialTopTabNavigator();

function AppContent() {
  const [savedTexts, setSavedTexts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const Tab = createMaterialTopTabNavigator();
  const filteredFavorites = savedTexts.filter((text) => text.isFavorite);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [inputText, setInputText] = useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <NavigationContainer>
      <SafeAreaView>
        <Searchbar
          placeholder="検索"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </SafeAreaView>
      <TopTab.Navigator>
      <TopTab.Screen
          name="Home"
          children={() => (
            <HomeScreen
              searchQuery={searchQuery}
              savedTexts={savedTexts}
              setSavedTexts={setSavedTexts}
              visible={visible}
              setVisible={setVisible}
              hideModal={hideModal}
              inputText={inputText}
              setInputText={setInputText}
            />
          )}
        />
        <TopTab.Screen
          name="Favorites"
          children={() => <FavoritesScreen searchQuery={searchQuery} favoriteTexts={filteredFavorites} />}
        />
      </TopTab.Navigator>
      <FAB
        style={styles.fab}
        icon="plus"
        color="#fff"
        onPress={() => setVisible(true)}
      />
    </NavigationContainer>
  );
}

const HomeScreen = ({ savedTexts = [], setSavedTexts, setVisible, visible, inputText, setInputText, hideModal, }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const toggleFavorite = (id) => {
    const updatedTexts = savedTexts.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setSavedTexts(updatedTexts);
  };

  const deleteText = (id) => {
    setSavedTexts(savedTexts.filter((item) => item.id !== id));
  };
  const onChangeSearch = (query) => setSearchQuery(query);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <FlatList
            data={savedTexts.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase()),
  )}
          renderItem={({ item }) => {
            const swipeoutButtons = [
              {
                text: "削除",
                backgroundColor: "red",
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
                    icon={item.isFavorite ? "star" : "star-outline"}
                    onPress={() => toggleFavorite(item.id)}
                  />
                </View>
              </Swipeout>
            );
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
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
                  setInputText("");
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

const FavoritesScreen = ({ savedTexts = [] }) => {
  const favoriteTexts = savedTexts.filter((text) => text.isFavorite);
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
  searchbar: {
    margin: 10,
  },
  content: {
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#204877",
    borderRadius: 50,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textInput: {
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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