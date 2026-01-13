type Props = { url: string; onClose: () => void }

export default function FilePreviewModal({ url, onClose }: Props) {
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-card rounded shadow-lg w-full max-w-3xl p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">File preview</div>
          <button onClick={onClose} aria-label="Close preview">✕</button>
        </div>
        <div style={{ minHeight: 360 }}>
          <iframe src={url} className="w-full h-[60vh] border border-border" title="file-preview" />
        </div>
      </div>
    </div>
  )
}

