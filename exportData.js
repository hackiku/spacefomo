import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function exportData() {
    try {
        // Replace 'news_items' with your collection name
        const records = await pb.records.getList('news_items');
        console.log(JSON.stringify(records, null, 2));
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

exportData();