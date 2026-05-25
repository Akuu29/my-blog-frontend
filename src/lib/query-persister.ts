import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { createStore, get, set, del } from 'idb-keyval';

const queryCacheStore = createStore('query-cache-db', 'cache');

export const idbPersister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => get(key, queryCacheStore),
    setItem: (key, value) => set(key, value, queryCacheStore),
    removeItem: (key) => del(key, queryCacheStore),
  },
  key: 'blog-query-cache',
});
