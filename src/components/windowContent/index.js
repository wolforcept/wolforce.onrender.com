// Window Content Components Registry
// Maps content types to their corresponding components
// To add a new content type:
// 1. Create a component in this folder
// 2. Import and register it here
// 3. Add a page in pages.js with contentType: 'your-type'

import IframeContent from './IframeContent';
import FolderContent from './FolderContent';
import EditorContent from './EditorContent';
import RecycleBinContent from './RecycleBinContent';

// Registry of content type to component mapping
const contentComponents = {
  iframe: IframeContent,
  folder: FolderContent,
  editor: EditorContent,
  recycleBin: RecycleBinContent,
};

// Get the component for a given content type
export function getContentComponent(contentType) {
  return contentComponents[contentType] || IframeContent;
}

// Check if a content type exists
export function hasContentType(contentType) {
  return contentType in contentComponents;
}

export default contentComponents;

