// src/lib/pocketbase.js

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
// export const pb = new PocketBase('http://127.0.0.1:8090');
// export const pb = new PocketBase('http://127.0.0.1:8090/api/');

// const record = await pb.collection('avionics').getOne('intel_url', {
const record = await pb.collection('avionics').getOne('va1si98l83mehvv', {
  expand: 'relField1,relField2.subRelField',
});


export async function fetchSingleAvionicsRecord() {
  try {
      const list = await pb.collection('avionics').getList(1, 1);
      if (list.items.length > 0) {
          return list.items[0];
      } else {
          console.log('No records found');
          return null;
      }
  } catch (error) {
      console.error('Failed to fetch avionics record:', error);
      return null;
  }
}



// export async function fetchAvionics() {
//   return await pb.collection('avionics').getFullList({ sort: '-created' });
// }

// fetch a paginated records list
// const resultList = await pb.collection('avionics').getList(1, 50, {
//     filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
// });

// you can also fetch all records at once via getFullList
// const records = await pb.collection('avionics').getFullList({
//     sort: '-created',
// });



// export const articles = writable(pb.collection('articles'));
// console.log('PocketBase', pb);
