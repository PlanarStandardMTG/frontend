export interface RankedInfoDTO {
    id: string;
    username: string | null;
    elo: number;
    createdAt: string;
    updatedAt: string;
    userId: string | null;
    connectionId: string | null;
}

export interface UserDTO {
    id: string;
    email: string;
    username: string;
    /**
     * Some endpoints (admin list) still return a computed `elo` value. For
     * most UI code you should prefer `rankedInfo?.elo` and fall back to this
     * property if you know the server is returning it. It will be undefined
     * for `/api/users/me` after the backend migration.
     */
    elo?: number;
    admin: boolean;
    tournamentOrganizer?: boolean;
    blogger?: boolean;
    rankedInfo?: RankedInfoDTO;
}