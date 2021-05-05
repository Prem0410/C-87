import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import { Avatar } from "react-native-elements";
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import db from "../config";
export default class CustomSideBarMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      image: "#",
      userId: firebase.auth().currentUser.email,
      name: "",
      docId: "",
    };
  }

  selectPictur = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  getUserProfile = () => {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .onSnapshot((querySnapshort) => {
        querySnapshort.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };
  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{ flex: 0.5, alignItems: "center", backgroundColor: "black" }}
        >
          <Avatar
            rounded
            size="xlarge"
            source={{ uri: this.state.image }}
            onPress={() => {
              this.selectPictur();
            }}
            containerStyle={styles.image}
            showEditButton
          />
          <Text style={{ fontWeight: "bold", fontSize: 20, paddingTop: 10 }}>
            {this.state.name}
          </Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate("WelcomeScreen");
              firebase.auth().signOut();
            }}
          >
            <Text style={styles.logOutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  logOutButton: {
    height: 60,
    width: "100%",
    justifyContent: "center",
    padding: 10,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  image: {
    flex: 0.75,
    //width: "40%",
    //height: "40%",
    marginLeft: 5,
    marginTop: 30,
    borderRadius: 40,
  },
});
