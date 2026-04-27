import fs from "fs";
import { Sequelize, DataTypes } from "sequelize";

// Connect directly to the database
const sequelize = new Sequelize("fashioncart", "postgres", "DB", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
});

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  image: { type: DataTypes.STRING },
});

async function run() {
    let scriptContent = fs.readFileSync("d:/fashion/script.js", "utf8");
    let arrStart = scriptContent.indexOf("const products = [");
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
