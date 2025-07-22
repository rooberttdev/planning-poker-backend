export type IssueStatus = 'pending' | 'voting' | 'completed';

export interface Issue {
  id: string;
  title: string;
  description?: string;
  status: IssueStatus;
  createdAt: Date;
  result?: number;
  votes?: {
    [participant: string]: number;
  };
}
