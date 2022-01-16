

// callbacks are a pain to chain entity creation and editing, might as well expose a simple promise-based client
module.exports = class promisifiedNewsClient {
    constructor(client) {
        this.client = client
    }

    async get(id) {
        return new Promise((resolve, reject) => {
            this.client.Get({ id: id }, (err, res) => {
                if (err) reject(err);
                else (resolve(res));
            });
        });
    }

    async update(payload) {
        return new Promise((resolve, reject) => {
            this.client.Update(payload, (err, res) => {
                if (err) reject(err);
                else (resolve(res));
            });
        });
    }
    async delete(id) {
        return new Promise((resolve, reject) => {
            this.client.Delete({ id: id }, (err, res) => {
                if (err) reject(err);
                else (resolve(res));
            });
        });
    }

    async create(payload) {
        return new Promise((resolve, reject) => {
            this.client.Create(payload, (err, res) => {
                if (err) reject(err);
                else (resolve(res));
            });
        });
    }

    async query(payload) {
        return new Promise((resolve, reject) => {
            this.client.Query(payload, (err, res) => {
                if (err) reject(err);
                else (resolve(res));
            });
        });
    }
}