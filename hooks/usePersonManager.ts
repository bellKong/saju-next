"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPerson, deletePerson } from "@/services/persons.api";
import { ERROR_NETWORK, ERROR_GENERIC, ERROR_DELETE_FAILED } from "@/constants/messages";
import type { Person, SajuResult, LatestReading } from "@/types";

export function usePersonManager(initialPersons: Person[]) {
  const router = useRouter();
  const [persons, setPersons] = useState<Person[]>(initialPersons);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingPerson, setSavingPerson] = useState(false);

  const addPerson = async (data: {
    name: string;
    relationship: string;
    birthDate: string;
    birthTime: string | null;
    calendarType: string;
    gender: string;
  }): Promise<boolean> => {
    setSavingPerson(true);
    try {
      const res = await createPerson(data);
      if (res.success) {
        const newPerson: Person = {
          id: res.person.id,
          name: res.person.name,
          relationship: res.person.relationship,
          birthDate: res.person.birthDate,
          birthTime: res.person.birthTime,
          calendarType: res.person.calendarType,
          gender: res.person.gender,
          manseryeok: null,
          latestReading: null,
        };
        setPersons((prev) => [newPerson, ...prev]);
        return true;
      } else {
        alert(res.error || ERROR_GENERIC);
        return false;
      }
    } catch {
      alert(ERROR_NETWORK);
      return false;
    } finally {
      setSavingPerson(false);
    }
  };

  const removePerson = async (
    e: React.MouseEvent,
    id: string,
    selectedPersonId: string | null,
    onDeselect: () => void
  ) => {
    e.stopPropagation();
    if (!confirm("이 사람을 삭제하시겠습니까?")) return;
    setDeletingId(id);
    try {
      await deletePerson(id);
      setPersons((prev) => prev.filter((p) => p.id !== id));
      if (selectedPersonId === id) {
        onDeselect();
      }
      router.refresh();
    } catch {
      alert(ERROR_DELETE_FAILED);
    } finally {
      setDeletingId(null);
    }
  };

  const updateManseryeok = (personId: string, sajuResult: SajuResult) => {
    setPersons((prev) =>
      prev.map((p) =>
        p.id === personId ? { ...p, manseryeok: sajuResult } : p
      )
    );
  };

  const updateReading = (personId: string, reading: LatestReading) => {
    setPersons((prev) =>
      prev.map((p) =>
        p.id === personId ? { ...p, latestReading: reading } : p
      )
    );
  };

  return {
    persons,
    deletingId,
    savingPerson,
    addPerson,
    removePerson,
    updateManseryeok,
    updateReading,
  };
}
