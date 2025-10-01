'use client';

export default function CsvExport() {
  const dl = async () => {
    const base = process.env.NEXT_PUBLIC_API || 'http://localhost:4000';
    const res = await fetch(`${base}/api/import/csv`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keywords.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={dl} className="px-4 py-2 border rounded">
      Export CSV
    </button>
  );
}

