import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ListItem, Icon } from "react-native-elements";

import db from "../config";
import MyHeader from "../components/MyHeader";
import firebase from "firebase";

export default class MyReceivedBookScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      receivedBookList: [],
    };
    this.requestRef = null;
  }

  getReceivedBookList = () => {
    this.requestRef = db
      .collection("requested_books")
      .where("user_id", "==", this.state.userId)
      .where("book_status", "==", "recieved")
      .onSnapshot((snapshot) => {
        var bookList = snapshot.docs.map((doc) => doc.data());

        this.setState({
          receivedBookList: bookList,
        });
      });
  };

  componentDidMount() {
    this.getReceivedBookList();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, i) => i.toString();

  renderItem = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        title={item.book_name}
        subtitle={item.book_status}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader
          title="My Received Books"
          navigation={this.props.navigation}
        />
        <View style={{ flex: 1 }}>
          {this.state.receivedBookList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 30 }}>List of all received books</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.receivedBookList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  button: {
    justifyContent: "center",
    width: 100,
    height: 40,
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "black",
  },
});
