import ColliderDB from "../../client-data/ColliderDB";

class ColliderDataController{
    constructor() {
    }

    static getColliderDataById(id) {
        const records = ColliderDB.filter((rec) => rec.colliderId === id)
        if (records && records.length > 0) {
            return ColliderDataController.populateRecord(records[0]);
        }
        return null;
    }

    static populateRecord(record) {

        if (record) {

            return {
                colliderId:record.colliderId,
                displayCollider: record.displayCollider || 'Y',
            }
        }
    }
}

export default ColliderDataController;
