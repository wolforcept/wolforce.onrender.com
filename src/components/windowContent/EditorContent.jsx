// EditorContent - Monaco code editor
// Provides a full-featured code editor inside a window
// Can edit new files, existing text files, or system configuration files

import { useState, useRef, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { createTextFile, updateTextFile } from '../../services/FileSystem';
import { readRawData, writeRawData, validateJson } from '../../services/DataPersistence';

const DEFAULT_CODE = ``;

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'json', label: 'JSON' },
  { id: 'python', label: 'Python' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'plaintext', label: 'Plain Text' },
];

const THEMES = [
  { id: 'vs-dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'hc-black', label: 'High Contrast' },
];

export default function EditorContent({ 
  isActive,
  textFileId,         // ID of existing text file (null for new)
  initialContent,     // Initial content when opening a text file
  fileName,           // Name of the file being edited
  fileSystem,         // Current file system state
  onFileSystemChange, // Callback when file system changes (for saving)
  onTitleChange,      // Callback to update window title
  systemFileId,       // ID of system file being edited
  systemDataKey,      // localStorage key for system file
  systemLanguage,     // Language for system file (usually 'json')
  onSystemFileSave,   // Callback when system file is saved (to refresh components)
}) {
  // Determine if this is a system file
  const isSystemFile = Boolean(systemFileId && systemDataKey);
  
  // Initialize with appropriate content
  const getInitialContent = () => {
    if (isSystemFile) {
      return readRawData(systemDataKey);
    }
    return initialContent || DEFAULT_CODE;
  };
  
  const getInitialLanguage = () => {
    if (isSystemFile) {
      return systemLanguage || 'json';
    }
    if (fileName?.endsWith('.txt')) return 'plaintext';
    if (fileName?.endsWith('.json')) return 'json';
    return 'javascript';
  };

  const [code, setCode] = useState(getInitialContent);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [theme, setTheme] = useState('vs-dark');
  const [currentFileId, setCurrentFileId] = useState(textFileId || null);
  const [currentFileName, setCurrentFileName] = useState(fileName || null);
  const [isDirty, setIsDirty] = useState(false);
  const [jsonError, setJsonError] = useState(null);
  const editorRef = useRef(null);
  
  // Validate JSON on change for system files
  useEffect(() => {
    if (isSystemFile && isDirty) {
      const result = validateJson(code);
      setJsonError(result.valid ? null : result.error);
    }
  }, [code, isSystemFile, isDirty]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCodeChange = (value) => {
    setCode(value || '');
    setIsDirty(true);
  };

  // Save the file
  const handleSave = useCallback(() => {
    // Handle system file save
    if (isSystemFile) {
      const result = writeRawData(systemDataKey, code);
      if (result.success) {
        setIsDirty(false);
        setJsonError(null);
        // Notify parent to reload the affected data
        if (onSystemFileSave) {
          onSystemFileSave(systemDataKey);
        }
      } else {
        alert(`Error saving: ${result.error}`);
      }
      return;
    }
    
    // Handle text file save
    if (!fileSystem || !onFileSystemChange) {
      alert('Cannot save: File system not available');
      return;
    }

    if (currentFileId) {
      // Update existing file
      const updatedFs = updateTextFile(fileSystem, currentFileId, code);
      onFileSystemChange(updatedFs);
      setIsDirty(false);
    } else {
      // New file - prompt for name
      const name = prompt('Enter file name:', 'untitled.txt');
      if (!name) return; // User cancelled
      
      // Ensure .txt extension
      const finalName = name.endsWith('.txt') ? name : `${name}.txt`;
      
      // Create new file in user folder (the only persisted folder)
      const { fileSystem: updatedFs, file } = createTextFile(
        fileSystem,
        'user',
        finalName,
        code
      );
      
      if (file) {
        onFileSystemChange(updatedFs);
        setCurrentFileId(file.id);
        setCurrentFileName(file.label);
        setIsDirty(false);
        
        // Update window title
        if (onTitleChange) {
          onTitleChange(file.label);
        }
      } else {
        alert('Error saving file');
      }
    }
  }, [code, currentFileId, currentFileName, fileSystem, onFileSystemChange, onTitleChange, isSystemFile, systemDataKey, onSystemFileSave]);

  // Build title indicator
  const titleSuffix = isDirty ? ' •' : '';
  const displayName = isSystemFile ? fileName : (currentFileName || 'Untitled');
  
  // Determine save button state
  const canSave = isSystemFile ? !jsonError : true;
  const saveButtonTitle = isSystemFile 
    ? (jsonError ? 'Fix JSON errors before saving' : 'Save system configuration')
    : (currentFileId ? 'Save file' : 'Save as new file in Documents');

  return (
    <div className="editor-content">
      <div className="editor-toolbar">
        <button 
          className="editor-btn"
          onClick={handleSave}
          disabled={!canSave}
          title={saveButtonTitle}
        >
          💾 Save{(!isSystemFile && !currentFileId) ? ' As...' : ''}
        </button>
        <span className="editor-filename">
          {isSystemFile && <span className="editor-system-badge">⚙️ </span>}
          {displayName}{titleSuffix}
        </span>
        {jsonError && (
          <span className="editor-error" title={jsonError}>
            ⚠️ Invalid JSON
          </span>
        )}
        <div className="editor-toolbar-spacer" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="editor-select"
          disabled={isSystemFile} // Language is fixed for system files
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="editor-select"
        >
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="editor-container">
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}
