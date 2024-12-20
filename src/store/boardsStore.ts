import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board } from '../types';

interface BoardsState {
  boards: Board[];
  currentBoardId: string | null;
  addBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  setCurrentBoard: (id: string) => void;
  currentBoard: Board | null;
}

export const useBoardsStore = create<BoardsState>()(
  persist(
    (set, get) => ({
      boards: [],
      currentBoardId: null,
      currentBoard: null,

      addBoard: (board) => {
        set((state) => {
          const newBoards = [...state.boards, board];
          // Если это первая доска, делаем её текущей
          if (newBoards.length === 1) {
            return {
              boards: newBoards,
              currentBoardId: board.id,
              currentBoard: board,
            };
          }
          return { boards: newBoards };
        });
      },

      updateBoard: (id, updates) => {
        set((state) => {
          const updatedBoards = state.boards.map((board) =>
            board.id === id ? { ...board, ...updates } : board
          );
          const updatedCurrentBoard = state.currentBoardId === id
            ? { ...state.currentBoard!, ...updates }
            : state.currentBoard;
          return {
            boards: updatedBoards,
            currentBoard: updatedCurrentBoard,
          };
        });
      },

      deleteBoard: (id) => {
        set((state) => {
          const filteredBoards = state.boards.filter((board) => board.id !== id);
          const newCurrentBoardId = state.currentBoardId === id
            ? filteredBoards[0]?.id || null
            : state.currentBoardId;
          const newCurrentBoard = newCurrentBoardId
            ? filteredBoards.find(board => board.id === newCurrentBoardId) || null
            : null;
          return {
            boards: filteredBoards,
            currentBoardId: newCurrentBoardId,
            currentBoard: newCurrentBoard,
          };
        });
      },

      setCurrentBoard: (id) => {
        set((state) => {
          const board = state.boards.find((b) => b.id === id) || null;
          return {
            currentBoardId: id,
            currentBoard: board,
          };
        });
      },
    }),
    {
      name: 'boards-storage',
    }
  )
);