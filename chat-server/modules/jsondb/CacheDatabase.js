class CacheDatabase {
  static getInstance(dbName, data) {
    this.instance = this.instance || {};
    this.instance[dbName] = this.instance[dbName] || new this(data);
    return this.instance[dbName];
  }

  constructor(data) {
    this._data = data || null;
  }

  set data(data) {
    this._data = data;
  }

  get data() {
    return this._data;
  }

  clear() {
    delete CacheDatabase.instance[dbName];
    this._data = null;
  }
}

module.exports = CacheDatabase;