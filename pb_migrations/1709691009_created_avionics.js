/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "va1si98l83mehvv",
    "created": "2024-03-06 02:10:09.259Z",
    "updated": "2024-03-06 02:10:09.259Z",
    "name": "avionics",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qzr1c5vj",
        "name": "intel_url",
        "type": "url",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("va1si98l83mehvv");

  return dao.deleteCollection(collection);
})
