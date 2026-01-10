// IframeContent - Displays a website in an iframe
// Default content type for pages with a URL

export default function IframeContent({ url, title, isActive, onFocus, windowId }) {
  return (
    <>
      <iframe
        src={url}
        title={title}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
      {/* Invisible overlay to capture clicks on inactive windows */}
      {!isActive && (
        <div
          className="window-inactive-overlay"
          onMouseDown={(e) => {
            e.stopPropagation();
            onFocus(windowId);
          }}
        />
      )}
    </>
  );
}

