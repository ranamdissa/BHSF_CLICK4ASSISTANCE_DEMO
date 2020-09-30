import {FLOOR_NUMBER, CameraLocationsDB} from "../../client-data/CameraLocationsDB";

class CameraLocationsDataController {

    static getCameraLocationsData() {
        let records = null;
         records = CameraLocationsDB.map( (record) => {
            return (
                CameraLocationsDataController.populateCameraLocationRecord(record)
            )
        });
         return records;
    }

    static getCameraLocationById(id) {
       /* const records = CameraLocationsDB.filter((rec) => rec.cameraLocationId === id)
        if (records && records.length > 0) {
            return CameraLocationsDataController.populateCameraLocationRecord(records[0]);
        }
        return null;*/

        const index = CameraLocationsDB.findIndex((item) => {
            return item.cameraLocationId === id;
        });

        if (index !== -1 ) {
            return  CameraLocationsDB[index];
        }

        return null;
    }

    static populateCameraLocationRecord(record) {
        if(record) {
            return (
                {
                    cameraLocationId: record.cameraLocationId,
                    floorNumber: record.floorNumber || FLOOR_NUMBER.BOTTOM_FLOOR,
                    locationName: record.locationName,
                    cameraPosition: record.cameraPosition,
                    cameraRotation:record.cameraRotation,
                }

            )

        }
        return null;
    }

    static updateCameraLocationRecord(record) {

       let rec = CameraLocationsDataController.getCameraLocationById(record.cameraLocationId);
       if (rec) {
           let {cameraPosition, cameraRotation} = rec;
           if (!cameraPosition) {
               rec.cameraPosition = record.cameraPosition
           }
           if (!cameraRotation) {
               rec.cameraRotation = record.cameraRotation
           }
           return CameraLocationsDataController.populateCameraLocationRecord(rec);

       }
       return null;
    }

}

export default CameraLocationsDataController;
