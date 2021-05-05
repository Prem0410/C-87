import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ListItem,Icon } from "react-native-elements";

import db from "../config";
import MyHeader from "../components/MyHeader";
import firebase from "firebase";

export default class MyDonationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      allDonations: [],
      donorName: "",
    };
    this.requestRef = null;
  }

  getAllDonations = () => {
    this.requestRef = db
      .collection("all_donations")
      .where("donor_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allDonations = [];
        snapshot.docs.map((doc) => {
          var donation = doc.data();
          donation["doc_id"] = doc.id;
          allDonations.push(donation);
        });
        this.setState({
          allDonations: allDonations,
        });
      });
  };

  getDonorDetails = (userId) => {
    db.collection("users")
      .where("username", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  sendNotification = (bookDetails, requestStatus) => {
    var requestId = bookDetails.request_id;
    var donorId = bookDetails.donor_id;

    db.collection("all_notifications")
      .where("request_id", "==", requestId)
      .where("donor_id", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus === "Book Sent") {
            message = this.state.donorName + " sent you book";
          } else {
            message =
              this.state.donorName + " has shown interest in donating the book";
          }
          db.collection("all_notifications").doc(doc.id).update({
            message: message,
            notification_status: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  sendBook = (bookDetails) => {
    if (bookDetails.requestStatus === "Book Sent") {
      var requestStatus = "Donor Interested";
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        request_status: "Donor Interested",
      });
      this.sendNotification(bookDetails, requestStatus);
    } else {
      var requestStatus = "Book Sent";
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        request_status: "Book Sent",
      });
      this.sendNotification(bookDetails, requestStatus);
    }
  };

  componentDidMount() {
    this.getDonorDetails(this.state.userId);
    this.getAllDonations();
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
        subtitle={
          "Requested By: " +
          item.requested_by +
          "\nStatus: " +
          item.request_status
        }
        leftElement={<Icon name="book" type="font-awesome" color="#696969" />}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        rightElement={
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  item.request_status === "Book Sent" ? "green" : "#ff5722",
              },
            ]}
            onPress={() => {
              this.sendBook(item);
            }}
          >
            <Text style={{ color: "#ffff" }}>
              {item.request_status === "Book Sent" ? "Book Sent" : "Send Book"}
            </Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="My Donations" navigation={this.props.navigation}/>
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 30 }}>List of all book donations</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
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
