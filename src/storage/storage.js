// src/storage/storage.js
class Storage {
  async putObject(stream, options = {}) {
    throw new Error("putObject not implemented");
  }

  async getObjectStream(key, range) {
    throw new Error("getObjectStream not implemented");
  }

  async deleteObject(key) {
    throw new Error("deleteObject not implemented");
  }
}

export default Storage;
