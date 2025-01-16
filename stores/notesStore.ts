import { defineStore } from 'pinia';
import type { Todo } from '@/models/Todo';
import type { Note } from '@/models/Note';

const LOCAL_STORAGE_KEY = 'notes';

// Загрузка данных из localStorage
const loadNotesFromLocalStorage = (): Note[] => {
    const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedNotes ? JSON.parse(savedNotes) : [];
};

// Сохранение данных в localStorage
const saveNotesToLocalStorage = (notes: Note[]): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
};

export const useNotesStore = defineStore('notes', () => {
    const _notes = reactive<Note[]>(loadNotesFromLocalStorage());

    const notes = computed(() => _notes as Note[]);

    function getNoteById(id: string): Note | null {
        const foundIndex = _notes.findIndex((note) => note.id === id);
        if (foundIndex >= 0) {
            return _notes[foundIndex];
        } else {
            return null;
        }
    }

    function addNote(note: Note) {
        _notes.push(note);
        saveNotesToLocalStorage(_notes);
    }

    const updateNote = (updatedNote: Note) => {
        const index = _notes.findIndex((note) => note.id === updatedNote.id);
        if (index !== -1) {
            _notes[index] = updatedNote;
            saveNotesToLocalStorage(_notes);
        }
    };

    function removeNote(id: string) {
        const index = _notes.findIndex((note) => note.id === id);
        if (index >= 0) {
            _notes.splice(index, 1);
            saveNotesToLocalStorage(_notes);
        }
    }

    return { notes, getNoteById, addNote, updateNote, removeNote };
})
