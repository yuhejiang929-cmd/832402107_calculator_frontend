import { api } from './api.js';
import { displayExpression } from './expression.js';

export function initHistory(onReuse) {
  const list = document.querySelector('#history-list');
  const message = document.querySelector('#history-message');
  const search = document.querySelector('#history-search');
  const previous = document.querySelector('#previous-page');
  const next = document.querySelector('#next-page');
  const clear = document.querySelector('#clear-history');
  const dialog = document.querySelector('#clear-dialog');
  let page = 1;
  let totalPages = 1;
  let requestId = 0;
  let mutating = false;
  let total = 0;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function render(items) {
    list.replaceChildren();
    if (!items.length) {
      const empty = element('div', 'empty-state');
      empty.append(
        element('div', 'empty-icon', '↺'),
        element(
          'h3',
          '',
          search.value ? 'No matching calculations' : 'A fresh page for your thoughts',
        ),
        element(
          'p',
          '',
          search.value
            ? 'Try a different expression or result.'
            : 'Your calculations will appear here,\nready to revisit whenever you need.',
        ),
      );
      list.append(empty);
      return;
    }
    for (const record of items) {
      const row = element('article', 'history-record');
      const content = element('button', 'record-content');
      content.type = 'button';
      content.setAttribute('aria-label', `Reuse ${record.expression}`);
      const time = element(
        'time',
        'record-time',
        new Date(record.created_at).toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
      time.dateTime = record.created_at;
      content.append(
        element('span', 'record-expression', displayExpression(record.expression)),
        element('span', 'record-result', `= ${record.result}`),
        time,
      );
      content.addEventListener('click', () => onReuse(record.expression));
      const remove = element('button', 'delete-record', '×');
      remove.setAttribute('aria-label', `Delete calculation ${record.id}`);
      remove.disabled = mutating;
      remove.addEventListener('click', () => mutate(() => api.delete(record.id)));
      row.append(content, remove);
      list.append(row);
    }
  }

  async function load() {
    const current = ++requestId;
    message.textContent = 'Loading history…';
    list.setAttribute('aria-busy', 'true');
    previous.disabled = next.disabled = true;
    try {
      const data = await api.history(page, search.value.trim());
      if (current !== requestId) return;
      if (page > Math.max(1, data.total_pages)) {
        page = Math.max(1, data.total_pages);
        return await load();
      }
      total = data.total;
      totalPages = Math.max(1, data.total_pages);
      document.querySelector('#history-count').textContent = String(total);
      document.querySelector('#page-info').textContent = `Page ${page} / ${totalPages}`;
      render(data.items);
      message.textContent = '';
      previous.disabled = page <= 1;
      next.disabled = page >= totalPages;
      clear.disabled = mutating || (total === 0 && !search.value);
    } catch (error) {
      if (current !== requestId) return;
      message.textContent = `History could not be loaded. ${error.message}`;
      clear.disabled = true;
    } finally {
      if (current === requestId) list.setAttribute('aria-busy', 'false');
    }
  }

  async function mutate(operation) {
    if (mutating) return;
    mutating = true;
    clear.disabled = true;
    list.querySelectorAll('.delete-record').forEach((button) => {
      button.disabled = true;
    });
    try {
      await operation();
      await load();
    } catch (error) {
      message.textContent = error.message;
    } finally {
      mutating = false;
      clear.disabled = total === 0 && !search.value;
      list.querySelectorAll('.delete-record').forEach((button) => {
        button.disabled = false;
      });
    }
  }

  let timer;
  search.addEventListener('input', () => {
    ++requestId; // Invalidate old responses immediately, before the debounce expires.
    clearTimeout(timer);
    timer = setTimeout(() => {
      page = 1;
      load();
    }, 250);
  });
  previous.addEventListener('click', () => {
    page -= 1;
    load();
  });
  next.addEventListener('click', () => {
    page += 1;
    load();
  });
  clear.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'confirm') mutate(() => api.clear());
  });
  document.querySelector('#refresh-history').addEventListener('click', load);
  load();
  return {
    reload: () => {
      page = 1;
      return load();
    },
  };
}
