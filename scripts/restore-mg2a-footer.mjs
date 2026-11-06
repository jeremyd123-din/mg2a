import fs from 'node:fs';
import nextEnv from '@next/env';
import {createClient} from '@sanity/client';
import {settings} from '../lib/mg2a/defaults.js';
nextEnv.loadEnvConfig(process.cwd());
const client=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:'production',apiVersion:'2025-02-19',token:process.env.SANITY_TOKEN,useCdn:false,perspective:'raw'});
const docs=await client.fetch('*[_type=="mg2a_settings"]');
fs.writeFileSync(`/private/tmp/mg2a-footer-backup-${Date.now()}.json`,JSON.stringify(docs,null,2));
for(const doc of docs){
 await client.patch(doc._id).ifRevisionId(doc._rev).set({serviceLinks:settings.serviceLinks,companyLinks:settings.companyLinks}).commit();
}
console.log(`Restored original HTML footer menu on ${docs.length} settings records; header edits preserved.`);
