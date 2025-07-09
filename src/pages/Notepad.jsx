import React, { useState, useEffect } from 'react';
import NoteEditor from './NoteEditor';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from "react-router-dom";

const Notepad = () => {
    const [notes, setNotes] = useState([{ id: 1, title: "Note 1", content: "", tags: [] }]);
    const [activeId, setActiveId] = useState(1);
    const [editingTitleId, setEditingTitleId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [newTag, setNewTag] = useState('');
    const navigate = useNavigate();
    const [currentContent, setCurrentContent] = useState(notes[0].content);

    useEffect(() => {
        const activeNote = notes.find(n => n.id === activeId);
        setCurrentContent(activeNote ? activeNote.content : "");
    }, [activeId, notes]);

    useEffect(() => {
        localStorage.setItem("notepad-notes", JSON.stringify(notes));
    }, [notes]);

    const addNote = () => {
        setNotes(prevNotes => {
            const updatedNotes = prevNotes.map(note =>
                note.id === activeId ? { ...note, content: currentContent } : note
            );
            const newId = Date.now();
            return [...updatedNotes, { id: newId, title: `Note ${updatedNotes.length + 1}`, content: "", tags: [] }];
        });
        const newId = Date.now();
        setActiveId(newId);
        setCurrentContent("");
    };

    const removeNote = (id) => {
        const updated = notes.filter(n => n.id !== id);
        if (updated.length === 0) {
            const newId = Date.now();
            const fallbackNote = { id: newId, title: "Note 1", content: "", tags: [] };
            setNotes([fallbackNote]);
            setActiveId(newId);
        } else {
            setNotes(updated);
            if (activeId === id) setActiveId(updated[0].id);
        }
    };

    const updateContent = (id, content) => {
        setNotes(notes.map(n => n.id === id ? { ...n, content } : n));
    };

    const renameNote = (id, newTitle) => {
        setNotes(notes.map(n => n.id === id ? { ...n, title: newTitle || 'Untitled' } : n));
        setEditingTitleId(null);
    };

    const handleSave = () => {
    // Update current note's content before saving
    const updatedNotes = notes.map(note =>
        note.id === activeId ? { ...note, content: currentContent } : note
    );
    console.log("Saving notes:", updatedNotes);
    setNotes(updatedNotes); // Update state
    localStorage.setItem("notepad-notes", JSON.stringify(updatedNotes)); // Save correct data
    alert("Notes saved!");
};

    const clearContent = () => {
        if (window.confirm("Clear content of this note?")) {
            updateContent(activeId, "");
        }
    };

    const exportToTXT = () => {
        const activeNote = notes.find(n => n.id === activeId);
        const element = document.createElement("a");
        const blob = new Blob([activeNote.content], { type: "text/plain" });
        element.href = URL.createObjectURL(blob);
        element.download = `${activeNote.title || "note"}.txt`;
        element.click();
    };

    const addTag = () => {
        if (!newTag.trim()) return;
        setNotes(notes.map(n => n.id === activeId && !n.tags.includes(newTag.trim())
            ? { ...n, tags: [...n.tags, newTag.trim()] }
            : n));
        setNewTag('');
    };

    const removeTag = (tag) => {
        setNotes(notes.map(n => n.id === activeId
            ? { ...n, tags: n.tags.filter(t => t !== tag) }
            : n));
    };

    const switchNote = (id) => {
        setNotes(prevNotes => prevNotes.map(note =>
            note.id === activeId ? { ...note, content: currentContent } : note
        ));
        setActiveId(id);
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeNote = notes.find(n => n.id === activeId);

    return (
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-4 max-w-5xl mx-auto min-h-screen">
            {/* Back and Search */}
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
                >
                    ← Back to Dashboard
                </button>

                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 border rounded shadow-sm focus:outline-none bg-white text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b pb-2 mb-4 overflow-x-auto">
                {filteredNotes.map(note => (
                    <div
                        key={note.id}
                        className={`relative px-3 py-1 rounded-t cursor-pointer transition 
                                    ${note.id === activeId 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white'}`}
                        onClick={() => switchNote(note.id)}
                        onDoubleClick={() => setEditingTitleId(note.id)}
                    >
                        {editingTitleId === note.id ? (
                            <input
                                autoFocus
                                onBlur={(e) => renameNote(note.id, e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && renameNote(note.id, e.target.value)}
                                defaultValue={note.title}
                                className="bg-transparent border-b border-gray-300 focus:outline-none text-black dark:text-white dark:border-gray-600"
                            />
                        ) : (
                            <>
                                {note.title}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm("Delete this note?")) removeNote(note.id);
                                    }}
                                    className="bg-white text-red-500 dark:bg-gray-900 dark:text-red-500 ml-2 text-sm text-red-500 hover:text-red-700"
                                    title="Delete Note"
                                >
                                    ×
                                </button>
                            </>
                        )}
                    </div>
                ))}

                <button
                    onClick={addNote}
                    className="bg-white text-green-600 dark:bg-gray-900 dark:text-green-600 ml-2 text-green-600 hover:text-green-800 font-semibold text-sm px-3 py-1 border border-green-300 rounded"
                    title="New Note"
                >
                    + New
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 mb-3">
                <button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
                >
                    💾 Save
                </button>
                <button
                    onClick={clearContent}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded shadow"
                >
                    🧹 Clear
                </button>
                <button
                    onClick={exportToTXT}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded shadow"
                >
                    📤 Export
                </button>
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded shadow"
                >
                    {showPreview ? "✏️ Edit" : "👁️ Preview"}
                </button>
            </div>

            {/* Tags */}
            {activeNote && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                        {activeNote.tags.map(tag => (
                            <span key={tag} className="bg-indigo-300 text-indigo-900 px-2 py-1 rounded-full flex items-center gap-1">
                                {tag}
                                <button onClick={() => removeTag(tag)} className="text-red-600 font-bold">×</button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2 max-w-sm">
                        <input
                            type="text"
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            placeholder="Add tag"
                            className="border px-2 py-1 rounded flex-grow focus:outline-none bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                        <button
                            onClick={addTag}
                            className="bg-green-400 hover:bg-green-500 text-black px-3 py-1 rounded"
                        >
                            Add Tag
                        </button>
                    </div>
                </div>
            )}

            {/* Editor / Markdown Preview */}
            {activeNote && (
                showPreview ? (
                    <div className="prose max-w-none p-4 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 overflow-auto" style={{ minHeight: "300px" }}>
                        <ReactMarkdown>{activeNote.content}</ReactMarkdown>
                    </div>
                ) : (
                    <NoteEditor
                        content={currentContent}
                        onChange={(content) => setCurrentContent(content)}
                    />
                )
            )}
        </div>
    );
};

export default Notepad;