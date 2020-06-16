# Ambrosus Event Entry Types

## Identification and Logistics

### Asset Informations

`"ambrosus.asset.info"` is used to record human readable information about an asset, such as its name, photos, description, etc. This is where to store information about an asset that will be displayed by applications (internal and consumer-facing). 

```json
{
	*"type": "ambrosus.asset.info",
	"assetType":"...",
	*"name": "...",
	"localisedName" : {
		"..." : "..."
	},
	"description": "...",
	"localisedDescription" : {
		"..." : "..."
	},
	"tags":["...","..."],
	"images" : {
		*"default" : {
		*"url":"http://...",
		"size":{
				"width":300,
				"height":600
			}
		},
		"...":{
			*"url":"http://...",
			"size":{
				"width":300,
				"height":600
			}
		}
	}
}
```

`assetType` is the type of the asset (such as a pallet, a box, an invoice, a batch, a unique item, etc.). Ambrosus provides the following types: `ambrosus.assetTypes.item` (for individual items with a unique serial number), `ambrosus.assetTypes.batch` (for a batch/lot of a certain), `ambrosus.assetTypes.sku` ("Stock Keeping Unit" used for a class of products that share the same attributes such as color, size, size, brand). Apps can create custom asset types as required. 

`name` is the default human readable name of the product (in English). Additionally localised versions of name can be provided using the `localisedName` dictionary, where the key is the ISO 639-1 language code, and the value holds the translation. 

`description` is the default human readable description of the asset (in English). Additionally localised versions of it can be provided using the `localisedDescription` dictionary, where the key is the ISO 639-1 language code, and the value holds the translation. (same as for name)

`tags` is an array of strings (`"tags":["test", "local", "UK"]`).

`images` is a dictionary that can hold any number of urls to images, with the identifiers stored as keys (this can be used to distinguish sizes, orientations, etc.)

VLAD: suggest we add a little more structure for the value (e.g. if we want to add legend or more infos about the image). We only expect a `url` field, the others are not validated/checked/enforced. 


```json
{
	"images" : {
		"default" : {
			*"url":"https://5.imimg.com/data5/WQ/JP/MY-10901605/coffee-packaging-bags-500x500.jpg",
			"name":"Main product image",
			"size":{
				"width":300,
				"height":600
			}
		},
		"second" : {
			"url":"https://5.imimg.com/data5/WQ/JP/MY-10901605/coffee-packaging-bags-500x500.jpg",
			"name":"Alternative product image",
			"size":{
				"width":300,
				"height":600
			}
		},
		"mobile":{...}		
	}
}
```

### Asset/Event identifier

The different identifiers for an asset. The event can only contain  Can represent a unique item (e.g. unique serial ID) or a identifier for a type of item (e.g. barcode).

```json
{
	"type": "ambrosus.asset.identifiers",
	*"identifiers": {
		"ean13": ["...."],
		"...": ["...."]
	}
}
```

The different identifiers for the event as opposed to the identifiers for an asset.

```json
{
	"type": "ambrosus.event.identifiers",
	"identifiers": {
		"...": ["...."]
	}
}
```

`identifiers` should be grouped by type (e.g. ean8, ean13, etc). It is structured with a map, where the type of the identifiers is the key. The values in this map are arrays of the actuall identifiers in string form. 

*Additional fields outside of `identifiers` are NOT allowed.*

### Asset/Event Location (geo)

Represents the location of the asset using geographical coordinates. 

VLAD: suggest we default to geoJson, as follows: 

```json
{
	"type": "ambrosus.event.location",
	"geoJson": {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [51.498916, -0.178991]
		},
		"properties": {
			"farm-id":"2203"
		}
	},	
	"name": "Huxley Building, Imperial College London",
	"city":"London",
	"country":"UK",
	"assetId":"0x...00",
	"locationId":"809c578721b74cae1d56504594819285",
	"GLN":9501101530003
	}
}
```

`name`, `country`, `city` must be strings, `assetId` must be a `0x` prefixed string. 



```json
{
	"type": "ambrosus.event.location.geo",
	"geoJson" : { 
		"type" : "Point",
		"coordinates": [13, -15]
	}
}
```

The value for `geoJson.type` must be `Point`. The `geoJson.coordinates` field is of type array with the first value representing the longnitude (valid range from -90 to 90) and the second the lattitude (valid range from -180 to 180).

*Additional fields are NOT allowed.*

### Asset/Event Location (assetId)

Represents the location of the asset expressed using an identifier for a different asset. 

```json
{
	"type": "ambrosus.asset.location.asset",
	"assetId" : "0x...."
}
```

Represents the location of the event expressed using an identifier for a asset (subject or other). In some cases this may be different then the location of the asset. For example, a document related to an asset may be created at the owners HQ.

```json
{
	"type": "ambrosus.event.location.asset",
	"assetId" : "0x...."
}
```

*Additional fields are NOT allowed.*

## Consumables (below is not validated, only proposed)


### Serialisation

Provides information about the process the product is a result of. 

```json
{
	"type": "ambrosus.asset.serialisation",
	"batchId": "...",
	"...": "..."
}
```

Adding addtional fields is allowed, but `batchId` should be used as much as possible.

### Expiration

```json
{
	"type": "ambrosus.consumables.expiration",
	"bestBeforeDate": "...",
	"useByDate: "..."
}
```

Both `bestBeforeDate` and `useByDate` should be expresed as Unix timestamp (numeber of seconds passed since 1 January 1970 UTC). If `bestBeforeDate` is not applicable, it should be set to match `useByDate`.

*Additional fields are NOT allowed.*

## Sensors

### Temperature

```json
{
	"type": "ambrosus.sensor.temperature",
	"value": 123,
	"unit": "celsius"
}
```

Valid values for the `unit` field are:

- C - Celsius scale
- F - Farenheit scale
- K - Kelvin scale

*Additional fields are NOT allowed.*

### Pressure

```json
{
	"type": "ambrosus.sensor.pressure",
	"value": 123,
	"unit": "bar"
}
```

Valid values for the `unit` field are:

- bar - Bar
- Pa - Pascal
- at - Technical atmosphere
- atm - Standard atmosphere
- psi - Pounds per square inch
- ? - More?

*Additional fields are NOT allowed.*

### Humidity

```json
{
	"type": "ambrosus.sensor.humidity",
	"value": 45,
	"unit": "AH"
}
```

Valid values for the `unit` field are:

- AH - absolute humidity in kg/kg
- RH - relative humidity in percent

*Additional fields are NOT allowed.*

### Acceleration

```json
{
	"type": "ambrosus.sensor.acceleration",
	"x": 123,
	"y": 32,
	"z": 92,
	"unit": "g"
}
```

Valid values for the `unit` field are:

- g - Standard gravity
- m/s2 - metre per seconds squared
- ft/s2 - feet per second squared

*Additional fields are NOT allowed.*

### Orientation

```json
{
	"type": "ambrosus.sensor.orientation",
	"x": 1.0,
	"y": 0,
	"z": 0
}
```

`x`,`y` and `z` form a unit vector.

*Additional fields are NOT allowed.*

## Entry Propousal Procedure

If you think there is a entry type missing, please contact us at <TBD email address>. We plan to extend the list on a regular basis.