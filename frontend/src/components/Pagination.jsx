import { ChevronLeft, ChevronRight } from 'lucide-react';

// Puslapių numeriai: 1 … 4 5 6 … 12
function pageNumbers(current, last) {
  const pages = new Set([1, last, current - 1, current, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push(`gap-${page}`);
    result.push(page);
  });
  return result;
}

export default function Pagination({ meta, onPage }) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page: current, last_page: last } = meta;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" className="pagination__btn" disabled={current <= 1} onClick={() => onPage(current - 1)}>
        <ChevronLeft aria-hidden="true" /> Prev
      </button>
      {pageNumbers(current, last).map((page) =>
        typeof page === 'string' ? (
          <span key={page} className="pagination__gap">…</span>
        ) : (
          <button
            type="button"
            key={page}
            className="pagination__btn pagination__num"
            aria-current={page === current ? 'page' : undefined}
            onClick={() => onPage(page)}
          >
            {page}
          </button>
        ),
      )}
      <button type="button" className="pagination__btn" disabled={current >= last} onClick={() => onPage(current + 1)}>
        Next <ChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
}
