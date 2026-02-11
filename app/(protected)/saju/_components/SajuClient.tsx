"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePersonManager } from "@/hooks/usePersonManager";
import { useSajuPreview } from "@/hooks/useSajuPreview";
import { createReading } from "@/services/readings.api";
import { ERROR_NETWORK, ERROR_GENERIC, ERROR_CREDIT_INSUFFICIENT, LOADING_PLEASE_WAIT } from "@/constants/messages";
import { LoadingSpinner } from "@/components/ui";
import PersonListView from "./PersonListView";
import PersonFormView from "./PersonFormView";
import SajuPreviewView from "./SajuPreviewView";
import SajuDetailView from "./SajuDetailView";
import type { Person, LatestReading } from "@/types";

type View = "list" | "form" | "loading" | "preview" | "detail";

interface Props {
  creditBalance: number;
  initialPersons: Person[];
}

export default function SajuClient({ creditBalance, initialPersons }: Props) {
  const router = useRouter();
  const [view, setView] = useState<View>("list");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [currentReading, setCurrentReading] = useState<LatestReading | null>(null);

  const {
    persons, deletingId, savingPerson,
    addPerson, removePerson, updateManseryeok, updateReading,
  } = usePersonManager(initialPersons);

  const { previewLoading, sajuPreview, loadPreview, clearPreview } = useSajuPreview();

  const resetToList = () => {
    setView("list");
    setSelectedPerson(null);
    setCurrentReading(null);
    clearPreview();
  };

  const handlePersonClick = async (person: Person) => {
    if (person.latestReading) {
      setSelectedPerson(person);
      setCurrentReading(person.latestReading);
      setView("detail");
      return;
    }

    setSelectedPerson(person);
    setView("preview");

    if (person.manseryeok) {
      return;
    }

    loadPreview(
      person,
      (result) => updateManseryeok(person.id, result),
      () => setView("list")
    );
  };

  const handleGenerateReading = async () => {
    if (!selectedPerson) return;
    if (creditBalance <= 0) {
      alert(ERROR_CREDIT_INSUFFICIENT);
      return;
    }

    setView("loading");

    try {
      const data = await createReading({
        type: "SAJU",
        personId: selectedPerson.id,
      });

      if (data.success) {
        const reading: LatestReading = {
          id: data.reading.id,
          result: data.reading.result,
          summary: data.reading.summary,
          input: data.reading.input,
          createdAt: data.reading.createdAt,
        };
        setCurrentReading(reading);
        updateReading(selectedPerson.id, reading);
        setView("detail");
        router.refresh();
      } else {
        alert(data.error || ERROR_GENERIC);
        setView("preview");
      }
    } catch {
      alert(ERROR_NETWORK);
      setView("preview");
    }
  };

  const handleDeletePerson = (e: React.MouseEvent, id: string) => {
    removePerson(e, id, selectedPerson?.id ?? null, resetToList);
  };

  const handleSavePerson = async (data: {
    name: string;
    relationship: string;
    birthDate: string;
    birthTime: string | null;
    calendarType: string;
    gender: string;
  }) => {
    const success = await addPerson(data);
    if (success) setView("list");
    return success;
  };

  if (view === "loading" && selectedPerson) {
    return (
      <div className="pb-24">
        <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 px-6 py-5 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">사주 분석</h1>
        </div>
        <LoadingSpinner
          color="indigo"
          emoji="🔮"
          message={`${selectedPerson.name}님의 사주를 분석하고 있어요`}
          subMessage={LOADING_PLEASE_WAIT}
        />
      </div>
    );
  }

  if (view === "preview" && selectedPerson) {
    return (
      <SajuPreviewView
        person={selectedPerson}
        sajuPreview={selectedPerson.manseryeok || sajuPreview}
        previewLoading={previewLoading}
        creditBalance={creditBalance}
        onBack={resetToList}
        onGenerateReading={handleGenerateReading}
      />
    );
  }

  if (view === "detail" && selectedPerson && currentReading) {
    return (
      <SajuDetailView
        person={selectedPerson}
        reading={currentReading}
        onBack={resetToList}
      />
    );
  }

  if (view === "form") {
    return (
      <PersonFormView
        savingPerson={savingPerson}
        onSave={handleSavePerson}
        onCancel={() => setView("list")}
      />
    );
  }

  return (
    <PersonListView
      persons={persons}
      creditBalance={creditBalance}
      deletingId={deletingId}
      onAddClick={() => setView("form")}
      onPersonClick={handlePersonClick}
      onDeletePerson={handleDeletePerson}
    />
  );
}
