/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nogwj1gqt0ginwv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "o9wihadk",
    "name": "rich_text",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xu05dt63",
    "name": "media_outlet",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nogwj1gqt0ginwv")

  // remove
  collection.schema.removeField("o9wihadk")

  // remove
  collection.schema.removeField("xu05dt63")

  return dao.saveCollection(collection)
})
