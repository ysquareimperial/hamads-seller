// List rows by id, so the edit screen can render instantly (and still work if the
// public detail endpoint hides an unapproved product).
const cache = new Map();

export const productCache = {
    put(items) {
        items.forEach((item) => cache.set(item.id, item));
    },
    get(id) {
        return cache.get(id) ?? null;
    },
    remove(id) {
        cache.delete(id);
    },
};
