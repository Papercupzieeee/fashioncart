import fs from "fs";
import { sequelize } from "./src/config/db.js";
import Product from "./src/modules/product/product.model.js";

async function run() {
    let scriptContent = fs.readFileSync("d:/fashion/script.js", "utf8");
    let arrStart = scriptContent.indexOf("const products = [");
    // Find the end of array matching this assignment
    let slice = scriptContent.slice(arrStart + "const products = ".length);
    let arrEnd = slice.indexOf("];");
    let productsArrayStr = slice.substring(0, arrEnd + 1);
    
    let products = eval("(" + productsArrayStr + ")");
    console.log("Extracted products:", products.length);
    
    await sequelize.authenticate();
    console.log("DB connected");

    for (let p of products) {
        if (!p.id || !p.image) continue;
        await Product.update({ image: p.image }, { where: { id: p.id } });
        console.log(`Updated product ${p.id} with image ${p.image}`);
    }
    console.log("Finished updating images!");
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
