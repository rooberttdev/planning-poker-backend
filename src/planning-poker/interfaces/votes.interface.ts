interface VoteResultDTO {
  participant: string;
  value: number;
}

interface TaskDTO {
  title: string;
  description?: string;
  revealed: boolean;
  votes: VoteResultDTO[];
}

interface RoomDTO {
  id: string;
  moderator: string;
  name?: string;
  participants: string[];
  issues: any[];
  currentTask?: TaskDTO;
}
