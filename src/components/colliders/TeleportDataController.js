
import TeleportDB from "../../client-data/TeleportDB";

class TeleportDataController{
    constructor() {
    }

    static getTeleportPointsDataById(id) {
        const records = TeleportDB.filter((rec) => rec.teleportPointId === id)
        if (records && records.length > 0) {
            return TeleportDataController.populateRecord(records[0]);
        }
        return null;
    }

    static populateRecord(record) {

        if (record) {

            return {
                teleportPointId:record.teleportPointId,
                displayTeleportPoint: record.displayTeleportPoint || 'Y',
            }
        }
    }
}
 export default TeleportDataController;
