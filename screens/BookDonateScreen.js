import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ListItem } from "react-native-elements";
import db from "../config";
import MyHeader from "../components/MyHeader";

export default class BookDonateScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      requestedBookList: [],
    };
    this.requestRef = null;
  }

  getRequestedBookList = () => {
    this.requestRef = db
      .collection("requested_books")
      .onSnapshot((snapshot) => {
        var reqBookList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          requestedBookList: reqBookList,
        });
      });
  };

  componentDidMount() {
    this.getRequestedBookList();
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
        subtitle={item.reason_to_request}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        rightElement={
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate("ReceiverDetails", {
                details: item,
              });
            }}
          >
            <Text style={{ color: "#000" }}>View</Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Donate Books" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.requestedBookList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 30 }}>List of all requested books</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requestedBookList}
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
