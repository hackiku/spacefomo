import type { NewsItem } from '$lib/types';

export const SAMPLE_NEWS:NewsItem[] = [{
	id: {
		"title": [
			{
				"text": {
					"content": "1"
				}
			}
		]
	},
	"Headline": {
		"rich_text": [
			{
				"text": {
					"content": "BluShift Aerospace hopes to launch 1st suborbital rocket from Maine in 2025"
				}
			}
		]
	},
	"URL": {
		"url": "https://www.space.com/space-exploration/launches-spacecraft/blushift-aerospace-hopes-to-launch-1st-suborbital-rocket-from-maine-in-2025"
	},
	"Status": {
		"select": {
			"name": "Loaded"
		}
	},
	"PublishDate": {
		"date": {
			"start": "2025-01-06"
		}
	},
	"Type": {
		"select": {
			"name": "Launch"
		}
	},
	"Tags": {
		"multi_select": [
			{ "name": "BluShift" },
			{ "name": "Suborbital" },
			{ "name": "Biofuel" },
			{ "name": "Maine" }
		]
	},
	"AISummary": {
		"rich_text": [
			{
				"text": {
					"content": "BluShift Aerospace plans its first suborbital flight test in late 2025, following successful engine tests of their MAREVL technology. The company, known for using non-toxic biofuel, recently raised $1.4M and began a $15M equity round. They aim to launch their Starless Rogue rocket from Spaceport America in New Mexico, targeting altitudes of 120-140km initially, with plans to reach 350-400km in future launches."
				}
			}
		]
	},
	"DataPoints": {
		"rich_text": [
			{
				"text": {
					"content": JSON.stringify([
						{ "label": "Initial Launch Target", "value": "Late 2025" },
						{ "label": "Initial Altitude", "value": "120-140 km" },
						{ "label": "Future Altitude", "value": "350-400 km" },
						{ "label": "Recent Funding", "value": "$1.4M" },
						{ "label": "Equity Round", "value": "$15M" },
						{ "label": "Zero-G Time", "value": "6-8 minutes" }
					])
				}
			}
		]
	},
	"ReadTime": {
		"select": {
			"name": "5 min"
		}
	},
	"FOMOScore": {
		"number": 75
	},
	"MetricsSummary": {
		"rich_text": [
			{
				"text": {
					"content": "Key milestone: Successful MAREVL engine test completed in October 2024. Company secured $1.4M in private investment and launched $15M equity round. Plans for commercial launch license and private launch site in Maine."
				}
			}
		]
	}
}]
