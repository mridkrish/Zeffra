import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../quill-custom.css";

const NoteEditor = ({ content, onChange }) => {
  return (
    <div className="bg-white text-black dark:bg-gray-800 dark:text-white">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={{
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
          ]
        }}
        formats={[
          'header', 'bold', 'italic', 'underline', 'strike',
          'list', 'bullet', 'color', 'background'
        ]}
      />
    </div>
  );
};

export default NoteEditor;
