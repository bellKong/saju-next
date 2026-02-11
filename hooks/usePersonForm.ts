"use client";

import { useState } from "react";

export function usePersonForm() {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("본인");
  const [birthDate, setBirthDate] = useState("");
  const [knowBirthTime, setKnowBirthTime] = useState(true);
  const [knowExactTime, setKnowExactTime] = useState(true);
  const [birthTime, setBirthTime] = useState("");
  const [calendarType, setCalendarType] = useState("양력");
  const [gender, setGender] = useState("여자");

  const resetForm = () => {
    setName("");
    setRelationship("본인");
    setBirthDate("");
    setKnowBirthTime(true);
    setKnowExactTime(true);
    setBirthTime("");
    setCalendarType("양력");
    setGender("여자");
  };

  return {
    name, setName,
    relationship, setRelationship,
    birthDate, setBirthDate,
    knowBirthTime, setKnowBirthTime,
    knowExactTime, setKnowExactTime,
    birthTime, setBirthTime,
    calendarType, setCalendarType,
    gender, setGender,
    resetForm,
  };
}
