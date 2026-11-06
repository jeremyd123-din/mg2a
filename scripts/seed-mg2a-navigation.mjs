import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import nextEnv from '@next/env';
import {createClient} from '@sanity/client';
nextEnv.loadEnvConfig(process.cwd());
const {primaryNavigation,launchRoutes}=await import(pathToFileURL(path.resolve('lib/mg2a/navigation.js')));
const client=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:'production',apiVersion:'2025-02-19',token:process.env.SANITY_TOKEN,useCdn:false,perspective:'raw'});
const docs=await client.fetch('*[_type=="mg2a_settings"]');
fs.writeFileSync(`/private/tmp/mg2a-navigation-backup-${Date.now()}.json`,JSON.stringify(docs,null,2));
for(const doc of docs){
 const primaryLinks=primaryNavigation.map(item=>{
  const prior=doc.primaryLinks?.find(link=>link.href===item.href);
  return {...item,...(prior?{_key:prior._key,label:prior.label}:{}),...(item.groups?{groups:item.groups}:{})};
 });
 const companyLinks=[...(doc.companyLinks||[])];
 await client.patch(doc._id).ifRevisionId(doc._rev).set({primaryLinks,companyLinks,primaryCta:{...doc.primaryCta,href:'/contact'}}).commit();
}
console.log(`Configured launch navigation for ${docs.length} settings records. ${launchRoutes.length} static launch routes catalogued; only Services and Industries expand. No pages deployed.`);
