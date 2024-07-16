import React, { useCallback } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView, Text } from "react-native";
import { DataTable } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

import { useState, useEffect } from "react";
const leaderboard = () => {
  const [leaderboardScore, setLeaderboardScore] = useState<any>([]);
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const scoreJson = await AsyncStorage.getItem("LEADERBOARDSCORE");
          const data = scoreJson != null ? JSON.parse(scoreJson).data : [];
          data.sort((a: any, b: any) => b.score - a.score);

          setLeaderboardScore(data);
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }, [])
  );
  useEffect(() => {}, []);

  const _retrieveData = async () => {
    try {
      const scoreJson = await AsyncStorage.getItem("LEADERBOARDSCORE");

      return scoreJson != null ? JSON.parse(scoreJson) : { data: [] };
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title numeric>Score</DataTable.Title>
          </DataTable.Header>
          {leaderboardScore?.map((item: any) => (
            <DataTable.Row>
              <DataTable.Cell>
                <Text>{item.name}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text>{item.score}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default leaderboard;
