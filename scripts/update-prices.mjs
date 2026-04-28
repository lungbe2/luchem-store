import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '..', '.env.local');

if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in client/.env.local');
  process.exit(1);
}

const products = [
  { name: 'Pine Gel', size: '5L', price: 169, category: 'floor_cleaner' },
  { name: 'Dish Wash', size: '5L', price: 125, category: 'dishwashing' },
  { name: 'Dish Wash', size: '25L', price: 360, category: 'dishwashing' },
  { name: 'Pine Gel', size: '1L', price: 169, category: 'floor_cleaner' },
  { name: 'Bleach', size: '5L', price: 52, category: 'bleach' },
  { name: 'Dashboard Cleaner', size: '25L', price: 229, category: 'car_wash' },
  { name: 'Tile Cleaner', size: '5L', price: 60, category: 'floor_cleaner' },
  { name: 'Handy Andy', size: '5L', price: 149, category: 'kitchen' },
  { name: 'Handy Andy', size: '750ml', price: 26, category: 'kitchen' },
  { name: 'Toilet Dip', size: '5L', price: 98, category: 'bathroom' },
  { name: 'Wash and Wax', size: '5L', price: 69, category: 'car_wash' }
].map((product) => ({
  ...product,
  description: `${product.size} ${product.name} from LuChem Cleaning Solutions.`,
  brand: 'LuChem',
  stock_quantity: 20,
  is_active: true
}));

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

let updated = 0;
let inserted = 0;

for (const product of products) {
  const { data: existing, error: findError } = await supabase
    .from('products')
    .select('id')
    .ilike('name', product.name)
    .eq('size', product.size)
    .maybeSingle();

  if (findError) {
    console.error(`Could not check ${product.name} ${product.size}:`, findError.message);
    continue;
  }

  if (existing?.id) {
    const { error } = await supabase
      .from('products')
      .update({
        price: product.price,
        category: product.category,
        brand: product.brand,
        is_active: product.is_active
      })
      .eq('id', existing.id);

    if (error) {
      console.error(`Could not update ${product.name} ${product.size}:`, error.message);
    } else {
      updated += 1;
      console.log(`Updated ${product.name} ${product.size} -> R${product.price.toFixed(2)}`);
    }
  } else {
    const { error } = await supabase.from('products').insert([product]);

    if (error) {
      console.error(`Could not insert ${product.name} ${product.size}:`, error.message);
    } else {
      inserted += 1;
      console.log(`Inserted ${product.name} ${product.size} -> R${product.price.toFixed(2)}`);
    }
  }
}

console.log(`Finished. Updated: ${updated}. Inserted: ${inserted}.`);
