export interface ReadingResult {
  id: string;
  summary: string;
  result: { content: string } | null;
}
