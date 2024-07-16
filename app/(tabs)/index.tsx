import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  Text,
  RadioButton,
  Modal,
  Portal,
  PaperProvider,
  TextInput,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Question, Answer } from "@/interface/question";
import { MathQuestions } from "@/components/MathQuestion";
import { router, useFocusEffect } from "expo-router";

export default function HomeScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const [score, setScore] = useState<number>(0);
  const [name, setName] = useState<string>("");

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  useEffect(() => {
    setName("");
    setScore(0);
    shuffleQuestion(MathQuestions);
  }, []);

  const checkAnswer = () => {
    const updatedQuestions = [...questions];
    let newScore = 0;
    for (const question of questions) {
      if (question.choose) {
        question.correct = question.answer[question.choose].isAnswer
          ? true
          : false;
        if (question.correct) {
          newScore++;
        }
      }
    }
    setScore(newScore);
    setQuestions(updatedQuestions);
    showModal();
  };

  const sendToLeaderboard = async () => {
    await _storeData();
  };
  const _storeData = async () => {
    let leaderboardScore = await _retrieveData();
    if (!leaderboardScore) {
      leaderboardScore = { data: [] };
    }
    leaderboardScore.data.push({
      name: name,
      score: score,
    });
    const jsonScore = JSON.stringify(leaderboardScore);
    try {
      await AsyncStorage.setItem("LEADERBOARDSCORE", jsonScore);
      console.log(jsonScore);
      hideModal();
      router.replace("/leaderboard");
    } catch (error) {
      console.log(error);
    }
  };

  const _retrieveData = async () => {
    try {
      const scoreJson = await AsyncStorage.getItem("LEADERBOARDSCORE");

      return scoreJson != null ? JSON.parse(scoreJson) : { data: [] };
    } catch (error) {
      console.log(error);
    }
  };
  const shuffleQuestion = (question: any) => {
    let curIndex = question.length;

    while (curIndex != 0) {
      let randomIndex = Math.floor(Math.random() * curIndex);
      curIndex--;

      [question[curIndex], question[randomIndex]] = [
        question[randomIndex],
        question[curIndex],
      ];
    }
    setQuestions(question);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.textHeader}>Question</Text>

        <ScrollView>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}
            >
              <View style={styles.scoreCotainer}>
                <Text style={styles.scoreHeader}>Your Score</Text>
                <Text style={styles.scoreText}>{score}</Text>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  theme={{ colors: { primary: "black" } }}
                  placeholder="Enter your name"
                  textColor="black"
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
                <View style={styles.scoreButtonContainer}>
                  <Button
                    style={styles.scoreButton}
                    mode="contained"
                    disabled={!name.length}
                    onPress={sendToLeaderboard}
                  >
                    Send Score
                  </Button>
                  <Button
                    style={styles.scoreButton}
                    mode="contained"
                    onPress={hideModal}
                  >
                    Close
                  </Button>
                </View>
              </View>
            </Modal>
          </Portal>
          <Button style={{ marginTop: 30 }} onPress={showModal}>
            Your Score
          </Button>
          {questions.map((question: Question, index: number) => (
            <Card style={styles.cardQuestion} key={index}>
              <Card.Title
                title={
                  <View style={styles.cardTitle}>
                    <Text>{index + 1 + ". " + question.question}</Text>
                    {question.correct !== null &&
                    question.correct !== undefined ? (
                      <Text
                        style={
                          question.correct ? styles.correct : styles.incorrect
                        }
                      >
                        {question.correct ? "Correct" : "Incorrect"}
                      </Text>
                    ) : null}
                  </View>
                }
              />
              <Card.Content>
                <RadioButton.Group
                  onValueChange={(value) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].choose = Number(value);
                    setQuestions(updatedQuestions);
                  }}
                  value={
                    question.choose !== undefined
                      ? question.choose.toString()
                      : ""
                  }
                >
                  {question.answer.map((answer: Answer, i: number) => (
                    <RadioButton.Item
                      key={i}
                      label={answer.choiceText}
                      value={i.toString()}
                    />
                  ))}
                </RadioButton.Group>
              </Card.Content>
            </Card>
          ))}
          <Button
            style={styles.buttonSubmit}
            mode="contained"
            onPress={checkAnswer}
          >
            Check Answer
          </Button>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  textHeader: {
    textAlign: "center",
    fontSize: 24,
  },
  cardQuestion: {
    marginTop: 5,
    marginHorizontal: 5,
  },
  container: {
    flex: 1,
  },
  buttonSubmit: {
    marginVertical: 5,
  },
  cardTitle: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  correct: {
    color: "green",
  },
  incorrect: {
    color: "red",
  },
  textInput: {
    backgroundColor: "white",
    width: "100%",
  },
  scoreCotainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  scoreHeader: {
    fontSize: 25,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 10,
    color: "green",
  },
  scoreButtonContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  scoreButton: {
    flex: 1,
    marginHorizontal: 1,
  },
});
