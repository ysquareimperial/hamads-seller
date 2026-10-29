import { Share } from 'react-native';

import { STORE_URL, USERNAME_MAX } from '@/config';

/** What the seller may type: lowercase letters, numbers, dot, underscore, hyphen. The server has the final say. */
export const cleanUsername = (text) => text.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9._-]/g, '').slice(0, USERNAME_MAX);

/** "Mama Amina's Kitchen" -> "mamaaminaskitchen" */
export const suggestUsername = (name) => cleanUsername(name.replace(/[^A-Za-z0-9]/g, ''));

/** Full public link when the web domain is configured, else null. */
export const storeLink = (username) => (STORE_URL && username ? `${STORE_URL}/${username}` : null);

export const storeLinkLabel = (username) => storeLink(username)?.replace(/^https?:\/\//, '') ?? `@${username}`;

export function shareStore(username, name) {
    const link = storeLink(username);
    return Share.share({
        message: link ? `Shop with ${name} on Hamads: ${link}` : `Find ${name} on Hamads: @${username}`,
    }).catch(() => { });
}
