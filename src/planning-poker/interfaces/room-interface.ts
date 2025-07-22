export interface Room {
  id: string;
  moderator: string;
  participants: Set<string>;
  name?: string;
  currentTask?: {
    title: string;
    description?: string;
    votes: Map<string, number>;
    revealed: boolean;
  };
}
