import { Issue } from './issues.interface';

export interface Room {
  id: string;
  moderator: string;
  participants: Set<string>;
  name?: string;
  issues: Issue[];
  currentTask?: {
    title: string;
    description?: string;
    votes: Map<string, number>;
    revealed: boolean;
  };
}
