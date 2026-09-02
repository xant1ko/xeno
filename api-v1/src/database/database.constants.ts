// Токен позволяет внедрять подключённую базу без привязки к классу клиента.
export const MONGO_DB = Symbol('MONGO_DB');
// Токен позволяет явно внедрять единый MongoClient при необходимости.
export const MONGO_CLIENT = Symbol('MONGO_CLIENT');
