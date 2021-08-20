export interface UsernamesModel {
  userId: string;
  username: string;
}

export interface RoomModel {
  id: number;
  inviteCode: number;
  ghostName: string | null;
  lastUpdated: Date;
  obj2: string | null;
  obj2Done: boolean;
  obj3: string | null;
  obj3Done: boolean;
  obj4: string | null;
  obj4Done: boolean;
}

export interface EvidenceModel {
  id: number;
  roomId: number;
  name: string;
  state: string;
}

export interface RoomHistoryModel {
  id: number;
  roomId: number;
  userId: string;
  message: string;
}
