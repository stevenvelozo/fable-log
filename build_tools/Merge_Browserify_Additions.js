// Simple script to backup the current package.json, and then merge in the browserify package.json
let libFS = require('fs');

let _BasePackageJSON = require(`${__dirname}/../package.json`);
let _BrowserifyAddonJSON = require(`${__dirname}/browserify_additions_to_package.json`);

libFS.writeFile(`${__dirname}/base_package.json`, JSON.stringify(_BasePackageJSON,null,4),
	(pBackupError) =>
	{
	  if (pBackupError)
	  {
		console.log(`Error writing base_package.json backup file -- aborting: ${pBackupError}`);
		return false;
	  }

		libFS.writeFile(`${__dirname}/../package.json`, JSON.stringify(Object.assign({},_BasePackageJSON,_BrowserifyAddonJSON),null,4),
			(pWriteMergedError) =>
			{
				if (pBackupError)
				{
					console.log(`Error writing base_package.json backup file -- aborting: ${pBackupError}`);
					return false;
				}

				console.log(`--> package.json updated!`);
				return true;	
			});
	});
