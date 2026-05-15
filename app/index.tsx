import { SymbolView } from "expo-symbols";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WEBPAGE_URL } from "@/constants/url";
import { BestScoreContext } from "@/context/BestScoreContext";
import { getData, storeData } from "@/services/storage";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// padding between sides + between squares
const PADDING = 20;
const GAP = 6;

// 2 squares per row → divide available width
const squareSize = (width - PADDING * 2 - GAP) / 2;

let autoMoves = [];

//let level = 1;
//let opacity = {blue: false,red: false,green: false,orange: false,};

const colors = ["red", "blue", "green", "orange"];

export default function Index() {
  const playerButton = useAudioPlayer(require("../assets/audios/button.mp3"));
  const playerWrong = useAudioPlayer(require("../assets/audios/wrong.mp3"));
  const [play, setPlay] = useState(false);

  const router = useRouter();

  //const [best, setBest] = useState(0);

  const { best, setBest } = useContext(BestScoreContext);

  useEffect(() => {
    const loadBest = async () => {
      const value = await getData();

      setBest(value);
    };

    loadBest();
  }, []);

  //const [autoMoves, setAutoMoves] = useState([]);

  const [playerMoves, setPlayerMoves] = useState([]);

  const [level, setLevel] = useState(0);

  const [tryAgain, setTryAgain] = useState(false);

  const [keysDisabled, setKeysDisabled] = useState(false);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const [opacity, setOpacity] = useState({
    blue: false,
    red: false,
    green: false,
    orange: false,
  });

  const playButtonSound = async () => {
    await playerButton.seekTo(0);
    playerButton.play();
  };

  const playWrongSound = async () => {
    await playerWrong.seekTo(0);
    playerWrong.play();
  };

  const handleLink = useCallback(async () => {
    // Check if the link is supported
    const linkUrl = WEBPAGE_URL;
    const supported = await Linking.canOpenURL(linkUrl);

    if (supported) {
      // Open the URL
      await Linking.openURL(linkUrl);
    } else {
      Alert.alert(`Don't know how to open this URL: ${linkUrl}`);
    }
  }, []);

  const verifyGame = (playerMoves, autoMoves) => {
    for (let i: number = 0; i < playerMoves.length; i++) {
      //console.log("aqui");
      if (playerMoves[i] !== autoMoves[i]) {
        return false;
      }
    }

    //if (playerMoves.length === autoMoves.length) setLevel(level + 1);

    return true;
  };

  const autoPlay = async () => {
    const verification = verifyGame(playerMoves, autoMoves);

    if (verification) {
      if (play && playerMoves.length === autoMoves.length) {
        setKeysDisabled(true);

        if (autoMoves.length !== 0) setLevel(level + 1);

        const randomValue = Math.floor(Math.random() * 4);

        const color = colors[randomValue];

        //setAutoMoves((items) => [...items, color]);
        autoMoves.push(color);

        await sleep(500);

        //console.log("AutoMove", autoMoves);

        for (const item of autoMoves) {
          setOpacity((prev) => ({
            ...prev,
            [item]: true,
          }));

          await sleep(500);

          setOpacity((prev) => ({
            ...prev,
            [item]: false,
          }));

          await sleep(300);
        }

        //console.log(keysDisabled);

        setKeysDisabled(false);

        //console.log("done");
        setPlayerMoves([]);
      }
    } else {
      //console.log("Try again");
      setKeysDisabled(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      playWrongSound();

      if (best < level) {
        setBest(level);
      }
      setTryAgain(true);
    }
  };

  useEffect(() => {
    storeData(best);
  }, [best]);

  /*useEffect(() => {
    //console.log("autoMoves", autoMoves);
    if (playerMoves.length !== 0) {
      //console.log("PlayerMove", playerMoves, "\n\n");
    }
  }, [playerMoves]);*/

  useEffect(() => {
    autoPlay();
  }, [play, playerMoves]);

  if (!play) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
            //backgroundColor: "red",
            //flex: 1,
            height: "50%",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#2f6aee",
                textAlign: "center",
                //marginBottom: 30,
                fontSize: 50,
                fontWeight: "800",
              }}
            >
              PA
            </Text>

            <Text
              style={{
                color: "#fcc70f",
                textAlign: "center",
                //marginBottom: 30,
                fontSize: 50,
                fontWeight: "800",
              }}
            >
              TT
            </Text>

            <Text
              style={{
                color: "#f63830",
                textAlign: "center",
                //marginBottom: 30,
                fontSize: 50,
                fontWeight: "800",
              }}
            >
              E
            </Text>
            <Text
              style={{
                color: "#49b13b",
                textAlign: "center",
                //marginBottom: 30,
                fontSize: 50,
                fontWeight: "800",
              }}
            >
              RN
            </Text>
          </View>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 50,
              //marginBottom: 30,
              fontWeight: "800",
            }}
          >
            MATCH
          </Text>
          <Text
            style={{
              color: "lightgray",
              textAlign: "center",
              marginTop: 20,
              fontWeight: "500",
            }}
          >
            Repeat the sequence. Don't make a mistake!
          </Text>
          <View
            style={{
              marginTop: 30,
              backgroundColor: "#1a1e24",
              paddingVertical: 15,
              width: "45%",
              borderRadius: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SymbolView
                name={"crown.fill"}
                size={18}
                tintColor={"#f8bd32"}
                style={{ marginBottom: 5, marginRight: 5 }}
              />
              <Text
                style={{
                  color: "lightgray",
                  textAlign: "center",
                  fontSize: 15,
                  marginBottom: 5,
                  fontWeight: "600",
                }}
              >
                BEST SCORE
              </Text>
            </View>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 30,
                fontWeight: "700",
              }}
            >
              {best}
            </Text>
          </View>
        </View>

        <View
          style={{
            height: "50%",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[
              styles.buttonStart,
              {
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                //marginTop: 40,
              },
            ]}
            onPress={() => setPlay(true)}
          >
            <SymbolView
              name={"play.fill"}
              tintColor={"white"}
              style={{ marginRight: 10 }}
              size={20}
            />
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              Play
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/settings")}
            style={{
              alignSelf: "center",
              marginTop: 50,
              backgroundColor: "#1d1f26",
              padding: 10,
              borderRadius: 50,
            }}
          >
            <SymbolView name={"gear"} tintColor={"white"} size={32} />
          </TouchableOpacity>
          <Text
            onPress={handleLink}
            style={{ color: "lightgray", textAlign: "center", marginTop: 20 }}
          >
            Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        {tryAgain ? (
          <View
            style={{
              height: "40%",
              //backgroundColor: "blue",
              justifyContent: "center",
            }}
          >
            <Text style={[styles.level, { color: "#f84142", fontSize: 38 }]}>
              GAME OVER
            </Text>
            <Text
              style={{
                color: "lightgray",
                textAlign: "center",
                fontSize: 15,
                marginTop: 15,
                fontWeight: "600",
              }}
            >
              SCORE
            </Text>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 30,
                marginBottom: 5,
                fontWeight: "600",
              }}
            >
              {level}
            </Text>
            <Text
              style={{
                color: "lightgray",
                textAlign: "center",
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              BEST SCORE
            </Text>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 30,
                marginBottom: 5,
                fontWeight: "600",
              }}
            >
              {best}
            </Text>
          </View>
        ) : (
          <View
            style={{
              height: "40%",
              //backgroundColor: "blue",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SymbolView
                name={"crown.fill"}
                size={30}
                tintColor={"#f8bd32"}
                style={{ marginBottom: 5, marginRight: 5 }}
              />
              <Text
                style={{
                  color: "lightgray",
                  textAlign: "center",
                  fontSize: 30,
                  marginBottom: 5,
                  fontWeight: "600",
                }}
              >
                {best}
              </Text>
            </View>
            <Text
              style={{
                color: "lightgray",
                textAlign: "center",
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              BEST
            </Text>
            <Text style={styles.level}>{level}</Text>
            <Text
              style={{
                color: "lightgray",
                textAlign: "center",
                fontSize: 18,
                marginBottom: 35,
                fontWeight: "600",
              }}
            >
              SCORE
            </Text>
            <Text
              style={{
                color: "lightgray",
                textAlign: "center",
                //marginBottom: 30,
                fontWeight: "500",
              }}
            >
              Watch the color. Tap the same one.
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            height: "50%",
            width: "100%",
            justifyContent: "center",
            //backgroundColor: "yellow",
          }}
        >
          <View>
            <TouchableOpacity
              disabled={keysDisabled ? true : false}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                playButtonSound();
                setPlayerMoves((items) => [...items, "blue"]);
              }}
              style={[
                styles.square,
                { backgroundColor: "#2f6aee", opacity: opacity.blue ? 0.2 : 1 },
              ]}
            />
            <TouchableOpacity
              disabled={keysDisabled ? true : false}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                playButtonSound();
                setPlayerMoves((items) => [...items, "red"]);
              }}
              style={[
                styles.square,
                { backgroundColor: "#f63830", opacity: opacity.red ? 0.2 : 1 },
              ]}
            />
          </View>

          <View>
            <TouchableOpacity
              disabled={keysDisabled ? true : false}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                playButtonSound();
                setPlayerMoves((items) => [...items, "orange"]);
              }}
              style={[
                styles.square,
                {
                  backgroundColor: "#fcc70f",
                  opacity: opacity.orange ? 0.2 : 1,
                },
              ]}
            />
            <TouchableOpacity
              disabled={keysDisabled ? true : false}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                playButtonSound();
                setPlayerMoves((items) => [...items, "green"]);
              }}
              style={[
                styles.square,
                {
                  backgroundColor: "#49b13b",
                  opacity: opacity.green ? 0.2 : 1,
                },
              ]}
            />
          </View>
        </View>

        <View
          style={{
            height: "10%",
            //backgroundColor: "red"
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[
              styles.buttonHome,
              {
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={() => {
              //console.log("home pressed");
              setKeysDisabled(false);
              setPlayerMoves([]);
              autoMoves = [];
              //setAutoMoves([]);
              setLevel(0);
              setOpacity({
                blue: false,
                red: false,
                green: false,
                orange: false,
              });
              setTryAgain(false);
              setPlay(false);
            }}
          >
            <SymbolView
              name={"house.fill"}
              tintColor={"white"}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.font}>HOME</Text>
          </TouchableOpacity>
          {tryAgain ? (
            <TouchableOpacity
              style={[
                styles.button,
                {
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f84142",
                },
              ]}
              onPress={() => {
                //console.log("try pressed");
                setPlayerMoves([]);
                setOpacity({
                  blue: false,
                  red: false,
                  green: false,
                  orange: false,
                });
                setKeysDisabled(false);
                autoMoves = [];
                //setAutoMoves([]);
                setLevel(0);
                setTryAgain(false);
              }}
            >
              <SymbolView
                name={"arrow.clockwise"}
                tintColor={"white"}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.font}>TRY AGAIN</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                {
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              onPress={() => {
                //console.log("retry pressed");
                setPlayerMoves([]);
                setOpacity({
                  blue: false,
                  red: false,
                  green: false,
                  orange: false,
                });
                autoMoves = [];
                setKeysDisabled(false);
                //setAutoMoves([]);
                setLevel(0);
                setTryAgain(false);
              }}
            >
              <SymbolView
                name={"arrow.clockwise"}
                tintColor={"white"}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.font}>RETRY</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes up the full screen
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#0d0f13",
  },
  content: {
    flex: 1, // Pushes the footer down by occupying all remaining space
  },
  footer: {
    justifyContent: "flex-end", // Aligns children to the end of the container
    padding: 20,
  },

  square: {
    width: squareSize,
    height: squareSize,
    margin: GAP / 2,
    borderRadius: 10,
  },

  button: {
    backgroundColor: "#2c68f3",
    paddingVertical: 15,
    width: "35%",
    marginLeft: 8,
    alignSelf: "center",
    borderRadius: 10,
  },
  buttonStart: {
    backgroundColor: "#43af3a",
    paddingVertical: 15,
    width: "45%",
    marginLeft: 8,
    alignSelf: "center",
    borderRadius: 10,
  },
  buttonHome: {
    backgroundColor: "#2f3339",
    paddingVertical: 15,
    width: "35%",
    marginRight: 8,

    alignSelf: "center",
    borderRadius: 10,
  },
  font: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  level: {
    color: "white",
    fontSize: 60,
    //marginBottom: 100,
    fontWeight: "700",
    textAlign: "center",
  },
});
