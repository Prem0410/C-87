import React from "react";
import { View, Text } from "react-native";
import { Header, Icon, Badge } from "react-native-elements";
import db from "../config";

export default class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  getNumberOfUnreadNotifications = () => {
    db.collection("all_notifications")
      .where("notification_status", "==", "unread")
      .onSnapshot((snapShort) => {
        var UnreadNotifications = snapShort.docs.map((doc) => {});
        this.setState({
          value: UnreadNotifications.length,
        });
      });
  };

  componentDidMount() {
    this.getNumberOfUnreadNotifications();
  }

  BellIconWithBadge = () => {
    return (
      <View>
        <Icon
          name="bell"
          type="font-awesome"
          color="#000"
          onPress={() => this.props.navigation.navigate("Notification")}
        />
        <Badge
          value={this.state.value}
          containerStyle={{ position: "absolute", top: -4, right: -4 }}
        />
      </View>
    );
  };

  render() {
    return (
      <Header
        leftComponent={
          <Icon
            name="bars"
            type="font-awesome"
            color="#000"
            onPress={() => this.props.navigation.toggleDrawer()}
          />
        }
        centerComponent={{
          text: this.props.title,
          style: { color: "#000", fontSize: 20, fontWeight: "bold" },
        }}
        rightComponent={<this.BellIconWithBadge {...this.props} />}
        backgroundColor="#fff"
      />
    );
  }
}
