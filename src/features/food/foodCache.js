// Rows by id. The API has no "get one" endpoint for vendor orders or menu items,
// so detail/edit screens read from what the lists already fetched.
const make = () => {
    const map = new Map();
    return {
        put(items) {
            items.forEach((item) => map.set(item.id, item));
        },
        get(id) {
            return map.get(id) ?? null;
        },
        remove(id) {
            map.delete(id);
        },
    };
};

export const foodOrderCache = make();
export const foodItemCache = make();
